// The latest release, for the announcement badge of the home page. It reads the changelog of
// @moobitech/meridiana, which tools/export-docs.mjs copies to meridiana/CHANGELOG.md next to the
// site, so the badge follows every release without editing the home page.
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export interface Release {
  version: string;
  /** The first feature of the release, up to its first comma; missing for a release of fixes. */
  headline?: string;
  /** The page of the changelog. */
  link: string;
}

export function latestRelease(): Release | undefined {
  const file = fileURLToPath(new URL('../meridiana/CHANGELOG.md', import.meta.url));
  if (!existsSync(file)) return undefined;

  // The sections start with "## 0.4.4 (2026-10-26)": the first one is the latest release
  const [, latest] = readFileSync(file, 'utf8').split(/^## /m);
  const version = latest?.match(/^(\S+)/)?.[1];
  if (!version) return undefined;

  // "- **global:** renderDot and dotTemplate, the mark of …" → "renderDot and dotTemplate"
  const features = latest.split(/^### /m).find((part) => part.startsWith('Features'));
  const item = features?.match(/^- (?:⚠️\s*)?(?:\*\*[^*]+:\*\*\s*)?(.+)$/m)?.[1];
  const headline = item?.split(',')[0].trim();

  return { version, headline, link: '/meridiana/CHANGELOG' };
}
