# @philiprehberger/string-kit

[![CI](https://github.com/philiprehberger/string-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/string-kit/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/string-kit.svg)](https://www.npmjs.com/package/@philiprehberger/string-kit)
[![Last updated](https://img.shields.io/github/last-commit/philiprehberger/string-kit)](https://github.com/philiprehberger/string-kit/commits/main)

String manipulation utilities — truncate, pad, wrap, template

## Installation

```bash
npm install @philiprehberger/string-kit
```

## Usage

```ts
import {
  truncate,
  template,
  pluralize,
  wordWrap,
  pad,
  stripAnsi,
  stripHtml,
  indent,
  dedent,
  escapeHtml,
  unescapeHtml,
  countWords,
  countLines,
} from '@philiprehberger/string-kit';

// Truncate with word boundary
truncate('Hello world, this is a long string', { maxLength: 20 });
// => 'Hello world, this...'

// Truncate at start or middle
truncate('Hello world, this is a long string', { maxLength: 20, position: 'middle' });
// => 'Hello wo...ng string'

// Template interpolation
template('Hello, {name}! You have {count} messages.', { name: 'Alice', count: 5 });
// => 'Hello, Alice! You have 5 messages.'

// Pluralize
pluralize(1, 'item');   // => 'item'
pluralize(3, 'item');   // => 'items'
pluralize(2, 'person', 'people'); // => 'people'

// Word wrap
wordWrap('This is a long sentence that should be wrapped', { width: 20 });

// Pad
pad('hi', 10);              // => 'hi        '
pad('hi', 10, 'left');      // => '        hi'
pad('hi', 10, 'center');    // => '    hi    '

// Strip ANSI / HTML
stripAnsi('\x1B[31mred\x1B[0m');     // => 'red'
stripHtml('<p>Hello <b>world</b></p>'); // => 'Hello world'

// Indent / Dedent
indent('hello\nworld', 4);  // => '    hello\n    world'
dedent('    hello\n    world'); // => 'hello\nworld'

// Escape / Unescape HTML
escapeHtml('<div>"hi"</div>'); // => '&lt;div&gt;&quot;hi&quot;&lt;/div&gt;'
unescapeHtml('&lt;b&gt;');     // => '<b>'

// Count
countWords('hello world foo');  // => 3
countLines('line1\nline2');     // => 2
```

## API

### `truncate(str, options)`

Truncate a string to a maximum length. Options:

| Option | Type | Default | Description |
|---|---|---|---|
| `maxLength` | `number` | — | Maximum output length including ellipsis |
| `position` | `'end' \| 'middle' \| 'start'` | `'end'` | Where to truncate |
| `ellipsis` | `string` | `'...'` | Ellipsis string |
| `wordBoundary` | `boolean` | `true` | Truncate at word boundaries |

### `template(str, data)`

Replace `{key}` placeholders with values from `data`. Unknown keys are left as-is.

### `pluralize(count, singular, plural?)`

Return singular or plural form based on count. If `plural` is omitted, appends `'s'` to singular.

### `wordWrap(str, options?)`

Wrap text at word boundaries. Options: `width` (default 80), `newline` (default `'\n'`).

### `pad(str, length, direction?, fillChar?)`

Pad a string to a given length. Direction: `'left'`, `'right'` (default), or `'center'`.

### `stripAnsi(str)`

Remove ANSI escape codes from a string.

### `stripHtml(str)`

Remove HTML tags from a string.

### `indent(str, spaces?, char?)`

Indent each line by a number of characters. Defaults to 2 spaces.

### `dedent(str)`

Remove common leading whitespace from all lines.

### `escapeHtml(str)`

Escape `&`, `<`, `>`, `"`, and `'` to their HTML entity equivalents.

### `unescapeHtml(str)`

Unescape `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` back to characters.

### `countWords(str)`

Count the number of words in a string.

### `countLines(str)`

Count the number of lines in a string.

All functions are null-safe — passing `null` or `undefined` returns `''` (or `0` for count functions).

## Development

```bash
npm install
npm run build
npm test
npm run typecheck
```

## Support

If you find this project useful:

⭐ [Star the repo](https://github.com/philiprehberger/string-kit)

🐛 [Report issues](https://github.com/philiprehberger/string-kit/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

💡 [Suggest features](https://github.com/philiprehberger/string-kit/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

❤️ [Sponsor development](https://github.com/sponsors/philiprehberger)

🌐 [All Open Source Projects](https://philiprehberger.com/open-source-packages)

💻 [GitHub Profile](https://github.com/philiprehberger)

🔗 [LinkedIn Profile](https://www.linkedin.com/in/philiprehberger)

## License

[MIT](LICENSE)
