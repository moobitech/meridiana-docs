// The code colors of the site, light and dark: few hues, each at least 4.5:1 on the background of
// the code blocks (docs.css: --vp-code-block-bg), so every token reads as body text.

interface Palette {
  name: string;
  type: 'light' | 'dark';
  background: string;
  foreground: string;
  comment: string;
  punctuation: string;
  keyword: string;
  string: string;
  number: string;
  fn: string;
  type_: string;
  tag: string;
  attribute: string;
}

function theme(p: Palette) {
  const rule = (scope: string[], foreground: string, fontStyle?: string) => ({
    scope,
    settings: fontStyle ? { foreground, fontStyle } : { foreground },
  });

  return {
    name: p.name,
    type: p.type,
    colors: { 'editor.background': p.background, 'editor.foreground': p.foreground },
    fg: p.foreground,
    bg: p.background,
    tokenColors: [
      rule(
        ['source', 'variable', 'meta.object-literal.key', 'variable.other.property'],
        p.foreground,
      ),
      rule(['comment', 'punctuation.definition.comment'], p.comment, 'italic'),
      rule(
        [
          'punctuation',
          'meta.brace',
          'keyword.operator',
          'punctuation.definition.tag',
          'meta.embedded punctuation',
        ],
        p.punctuation,
      ),
      rule(
        [
          'keyword',
          'storage',
          'storage.type',
          'storage.modifier',
          'keyword.control',
          'keyword.operator.new',
          'keyword.operator.expression',
          'variable.language',
          'constant.language',
        ],
        p.keyword,
      ),
      rule(['string', 'string.quoted', 'string.template', 'markup.inline.raw'], p.string),
      rule(
        ['constant.numeric', 'constant.other', 'support.constant', 'keyword.other.unit'],
        p.number,
      ),
      rule(
        ['entity.name.function', 'support.function', 'meta.function-call entity.name.function'],
        p.fn,
      ),
      rule(
        [
          'entity.name.type',
          'entity.name.class',
          'support.class',
          'support.type',
          'entity.other.inherited-class',
          'meta.decorator',
          'support.type.property-name',
          'variable.css',
          'variable.argument.css',
        ],
        p.type_,
      ),
      rule(['entity.name.tag', 'support.class.component'], p.tag),
      rule(
        ['entity.other.attribute-name', 'meta.attribute', 'entity.other.attribute-name.class.css'],
        p.attribute,
      ),
      rule(['markup.heading', 'markup.bold'], p.foreground, 'bold'),
    ],
  };
}

export const lightCode = theme({
  name: 'meridiana-light',
  type: 'light',
  background: '#fafafa',
  foreground: '#18181b',
  comment: '#63636b',
  punctuation: '#52525b',
  keyword: '#4338ca',
  string: '#047857',
  number: '#a3460a',
  fn: '#0e7490',
  type_: '#7e22ce',
  tag: '#be123c',
  attribute: '#92400e',
});

export const darkCode = theme({
  name: 'meridiana-dark',
  type: 'dark',
  background: '#121214',
  foreground: '#e4e4e7',
  comment: '#8e8e98',
  punctuation: '#a1a1aa',
  keyword: '#a5b4fc',
  string: '#6ee7b7',
  number: '#fcd34d',
  fn: '#67e8f9',
  type_: '#d8b4fe',
  tag: '#fda4af',
  attribute: '#fde68a',
});
