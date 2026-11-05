// The Markdown of the docs is read on GitHub too (github.com/moobitech/meridiana-docs), so what the
// site draws as tabs and live examples is written as HTML comments, which GitHub hides, around plain
// code blocks, which GitHub shows:
//
//   <!-- tabs -->            code blocks with a [Title] each, as tabs (VitePress `::: code-group`)
//   <!-- /tabs -->
//   <!-- preview <id> -->    a live example of the React demo (Preview.vue, `?preview=<id>`), with
//   <!-- /preview -->        the code blocks inside as its Code tab
//   <!-- install -->         `npm install` / `npx expo install` blocks, as tabs per package manager
//   <!-- /install -->        (pnpm, npm, yarn, bun) and per framework when they have a [Title]
//
// A titled block starts with its title as a comment (`// React`, `# Angular`, `<!-- Angular -->`),
// so that GitHub names it too; the site drops that line, the tab shows the title.
//
// Leave a blank line before and after each comment.
import type { MarkdownRenderer } from 'vitepress';

type Token = ReturnType<MarkdownRenderer['parse']>[number];
type TokenClass = new (type: string, tag: string, nesting: -1 | 0 | 1) => Token;

export const PACKAGE_MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'] as const;

const TITLE = /\s*\[([^\]]+)\]/;

export function docsMarkdown(md: MarkdownRenderer) {
  // Before the block parser: the comments become the containers and components of the site, on
  // the same lines, so the line numbers of the source stay right
  md.core.ruler.before('block', 'docs-comments', (state) => {
    let previews = 0;
    state.src = state.src
      .replace(/^<!-- tabs -->[ \t]*$/gm, '::: code-group')
      .replace(/^<!-- \/tabs -->[ \t]*$/gm, ':::')
      // The first two examples of a page load at once, the others when they come into view
      .replace(
        /^<!-- preview ([\w-]+) -->[ \t]*$/gm,
        (_, id: string) => `<DocPreview id="${id}"${previews++ < 2 ? ' eager' : ''}>`,
      )
      .replace(/^<!-- \/preview -->[ \t]*$/gm, '</DocPreview>')
      .replace(/^<!-- install -->[ \t]*$/gm, '<InstallTabs>')
      .replace(/^<!-- \/install -->[ \t]*$/gm, '</InstallTabs>');
  });

  // After it: the first line of a titled block that only repeats its title (`// React`), which
  // names the block on GitHub, where the tabs are plain blocks
  md.core.ruler.after('block', 'docs-tab-labels', (state) => {
    for (const token of state.tokens) {
      const title = token.type === 'fence' ? TITLE.exec(token.info)?.[1] : undefined;
      if (title && labelLine(token.content.split('\n')[0]) === title) {
        token.content = token.content.slice(token.content.indexOf('\n') + 1);
      }
    }
  });

  // The props tables (first header "Prop"): an anchor per row, a mark on the required ones
  md.core.ruler.after('inline', 'docs-props', (state) => {
    const used: Set<string> = (state.env.propIds ??= new Set<string>());
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'table_open' && tokens[i + 4]?.content === 'Prop') {
        tokens[i].attrJoin('class', 'props-table');
        i = markProps(state, tokens, i, used);
      }
    }
  });

  // Inline code stays on one line (docs.css), except a long expression, which wraps at its spaces
  // only: on a phone it would push the page sideways
  const codeInline = md.renderer.rules.code_inline;
  md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
    const content = tokens[idx].content;
    if (content.length > 24 && /\s/.test(content)) tokens[idx].attrJoin('class', 'code-wrap');

    return codeInline
      ? codeInline(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options);
  };

  // Tables scroll inside a frame that tells when there is more on the right (theme/tables.ts)
  md.renderer.rules.table_open = (tokens, idx, options, _env, self) =>
    `<div class="table-wrap">${self.renderToken(tokens, idx, options)}`;
  md.renderer.rules.table_close = (tokens, idx, options, _env, self) =>
    `${self.renderToken(tokens, idx, options)}</div>`;

  // Then: each install command, once per package manager
  md.core.ruler.after('docs-tab-labels', 'docs-install', (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'html_block' && tokens[i].content.startsWith('<InstallTabs>')) {
        i = expandInstall(state, tokens, i);
      }
    }
  });
}

/**
 * The rows of a props table from `open`: an id and a link on each prop (`#prop-days`, unless the
 * page has it already), a "Required" mark when the default cell says `required`. Returns the index
 * of the table end.
 */
function markProps(state: { Token: TokenClass }, tokens: Token[], open: number, used: Set<string>) {
  // The header of each column, for the cells stacked as cards on phones (docs.css)
  const labels: string[] = [];
  let i = open;
  while (tokens[i].type !== 'thead_close') {
    if (tokens[i].type === 'inline') labels.push(tokens[i].content);
    i++;
  }

  let column = 0;
  while (tokens[i].type !== 'table_close') {
    if (tokens[i].type === 'tr_open') column = 0;
    if (tokens[i].type === 'td_open') tokens[i].attrSet('data-label', labels[column++] ?? '');
    if (tokens[i].type === 'tr_open' && tokens[i + 1]?.type === 'td_open') {
      const nameCell = tokens[i + 2];
      const name = nameCell.children?.find((child) => child.type === 'code_inline')?.content;
      const defaultCell = tokens[i + 8];
      if (name && !used.has(name)) {
        used.add(name);
        tokens[i].attrSet('id', `prop-${name}`);
        const link = new state.Token('html_inline', '', 0);
        link.content = `<a class="prop-anchor" href="#prop-${name}" aria-label="Link to ${name}">#</a>`;
        nameCell.children?.push(link);
      }
      if (defaultCell?.type === 'inline' && defaultCell.content === 'required' && name) {
        tokens[i].attrJoin('class', 'is-required');
        const mark = new state.Token('html_inline', '', 0);
        mark.content = '<span class="prop-required">Required</span>';
        nameCell.children?.push(mark);
        const none = new state.Token('text', '', 0);
        none.content = '—';
        defaultCell.children = [none];
      }
    }
    i++;
  }

  return i;
}

/** Expands the code blocks of one `<InstallTabs>`; returns the index of its closing tag. */
function expandInstall(state: { Token: TokenClass }, tokens: Token[], open: number) {
  const frameworks: string[] = [];
  let i = open + 1;

  while (i < tokens.length && !tokens[i].content.startsWith('</InstallTabs>')) {
    const fence = tokens[i];
    if (fence.type !== 'fence') {
      i++;
      continue;
    }

    const framework = TITLE.exec(fence.info)?.[1] ?? '';
    frameworks.push(framework);
    const variants = PACKAGE_MANAGERS.map((pm) => {
      const first = frameworks.length === 1 && pm === PACKAGE_MANAGERS[0];
      const wrap = (html: string) => {
        const token = new state.Token('html_block', '', 0);
        token.content = html;
        token.block = true;

        return token;
      };
      const code = new state.Token('fence', 'code', 0);
      code.block = true;
      code.info = 'sh';
      code.markup = fence.markup;
      code.map = fence.map;
      code.content = forManager(fence.content, pm);
      const attrs = `data-fw="${escapeAttr(framework)}" data-pm="${pm}"${first ? '' : ' hidden'}`;

      return [wrap(`<div class="install-block" ${attrs}>\n`), code, wrap('</div>\n')];
    }).flat();
    tokens.splice(i, 1, ...variants);
    i += variants.length;
  }

  tokens[open].content =
    `<InstallTabs :frameworks='${JSON.stringify(frameworks).replace(/'/g, '&#39;')}'>\n`;

  return i;
}

// The text of a line that is only a comment: `# x`, `// x`, `/* x */` or `<!-- x -->`
function labelLine(line: string) {
  return /^\s*(?:#|\/\/|\/\*|<!--)\s*(.*?)\s*(?:\*\/|-->)?\s*$/.exec(line)?.[1];
}

function escapeAttr(text: string) {
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/**
 * The same commands for another package manager (the source is written for npm). `npx expo install`
 * stays as it is: the Expo docs give it for every package manager, and it picks the one of the
 * lockfile (https://docs.expo.dev/more/expo-cli/).
 */
export function forManager(source: string, pm: (typeof PACKAGE_MANAGERS)[number]) {
  if (pm === 'npm') return source;

  const install = { pnpm: 'pnpm add', yarn: 'yarn add', bun: 'bun add' }[pm];

  return source.replace(/^npm install\b/gm, install);
}
