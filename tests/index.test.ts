import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
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
} from '../dist/index.js';

describe('truncate', () => {
  it('returns empty string for null/undefined', () => {
    assert.equal(truncate(null, { maxLength: 10 }), '');
    assert.equal(truncate(undefined, { maxLength: 10 }), '');
  });

  it('returns original string if within maxLength', () => {
    assert.equal(truncate('hello', { maxLength: 10 }), 'hello');
  });

  it('truncates at end with word boundary', () => {
    const result = truncate('hello world foo bar', { maxLength: 14 });
    assert.equal(result, 'hello...');
  });

  it('truncates at end without word boundary', () => {
    const result = truncate('hello world', { maxLength: 8, wordBoundary: false });
    assert.equal(result, 'hello...');
  });

  it('truncates at start', () => {
    const result = truncate('hello world foo bar', { maxLength: 14, position: 'start' });
    assert.ok(result.startsWith('...'));
  });

  it('truncates at middle', () => {
    const result = truncate('hello world foo bar', { maxLength: 14, position: 'middle' });
    assert.ok(result.includes('...'));
  });

  it('handles maxLength smaller than ellipsis', () => {
    assert.equal(truncate('hello world', { maxLength: 2 }), '..');
  });

  it('uses custom ellipsis', () => {
    const result = truncate('hello world foo', { maxLength: 10, ellipsis: '~' });
    assert.ok(result.endsWith('~'));
  });
});

describe('template', () => {
  it('returns empty string for null/undefined', () => {
    assert.equal(template(null, {}), '');
    assert.equal(template(undefined, {}), '');
  });

  it('replaces placeholders with values', () => {
    assert.equal(template('Hello, {name}!', { name: 'World' }), 'Hello, World!');
  });

  it('replaces multiple placeholders', () => {
    const result = template('{greeting}, {name}!', { greeting: 'Hi', name: 'Alice' });
    assert.equal(result, 'Hi, Alice!');
  });

  it('leaves unknown placeholders untouched', () => {
    assert.equal(template('Hello, {name}!', {}), 'Hello, {name}!');
  });

  it('handles numeric and boolean values', () => {
    assert.equal(template('{count} items, active: {active}', { count: 5, active: true }), '5 items, active: true');
  });

  it('leaves placeholder for null/undefined values', () => {
    assert.equal(template('{key}', { key: null }), '{key}');
  });
});

describe('pluralize', () => {
  it('returns singular for count 1', () => {
    assert.equal(pluralize(1, 'item'), 'item');
  });

  it('returns default plural for count != 1', () => {
    assert.equal(pluralize(0, 'item'), 'items');
    assert.equal(pluralize(2, 'item'), 'items');
  });

  it('uses custom plural form', () => {
    assert.equal(pluralize(2, 'person', 'people'), 'people');
    assert.equal(pluralize(1, 'person', 'people'), 'person');
  });
});

describe('wordWrap', () => {
  it('returns empty string for null/undefined', () => {
    assert.equal(wordWrap(null), '');
    assert.equal(wordWrap(undefined), '');
  });

  it('does not wrap short lines', () => {
    assert.equal(wordWrap('hello world', { width: 80 }), 'hello world');
  });

  it('wraps long lines at word boundaries', () => {
    const result = wordWrap('one two three four', { width: 10 });
    const lines = result.split('\n');
    assert.ok(lines.length > 1);
    for (const line of lines) {
      assert.ok(line.length <= 10);
    }
  });

  it('preserves existing newlines', () => {
    const result = wordWrap('line one\nline two', { width: 80 });
    assert.equal(result, 'line one\nline two');
  });

  it('uses custom newline character', () => {
    const result = wordWrap('one two three', { width: 5, newline: '\r\n' });
    assert.ok(result.includes('\r\n'));
  });
});

describe('pad', () => {
  it('pads right by default', () => {
    assert.equal(pad('hi', 5), 'hi   ');
  });

  it('pads left', () => {
    assert.equal(pad('hi', 5, 'left'), '   hi');
  });

  it('pads center', () => {
    assert.equal(pad('hi', 6, 'center'), '  hi  ');
  });

  it('returns original if already at length', () => {
    assert.equal(pad('hello', 3), 'hello');
  });

  it('handles null/undefined', () => {
    assert.equal(pad(null, 3), '   ');
    assert.equal(pad(undefined, 3), '   ');
  });

  it('uses custom fill character', () => {
    assert.equal(pad('hi', 5, 'right', '-'), 'hi---');
  });
});

describe('stripAnsi', () => {
  it('returns empty string for null/undefined', () => {
    assert.equal(stripAnsi(null), '');
  });

  it('strips ANSI escape codes', () => {
    assert.equal(stripAnsi('\x1B[31mhello\x1B[0m'), 'hello');
  });

  it('returns plain strings unchanged', () => {
    assert.equal(stripAnsi('hello'), 'hello');
  });
});

describe('stripHtml', () => {
  it('returns empty string for null/undefined', () => {
    assert.equal(stripHtml(null), '');
  });

  it('strips HTML tags', () => {
    assert.equal(stripHtml('<p>Hello <b>world</b></p>'), 'Hello world');
  });

  it('strips self-closing tags', () => {
    assert.equal(stripHtml('line<br/>break'), 'linebreak');
  });
});

describe('indent', () => {
  it('returns empty string for null/undefined', () => {
    assert.equal(indent(null), '');
  });

  it('indents each line by default 2 spaces', () => {
    assert.equal(indent('a\nb'), '  a\n  b');
  });

  it('indents with custom count and character', () => {
    assert.equal(indent('a\nb', 1, '\t'), '\ta\n\tb');
  });
});

describe('dedent', () => {
  it('returns empty string for null/undefined', () => {
    assert.equal(dedent(null), '');
  });

  it('removes common leading whitespace', () => {
    const input = '    hello\n    world';
    assert.equal(dedent(input), 'hello\nworld');
  });

  it('preserves relative indentation', () => {
    const input = '  hello\n    world';
    assert.equal(dedent(input), 'hello\n  world');
  });

  it('ignores empty lines when calculating indent', () => {
    const input = '  hello\n\n  world';
    assert.equal(dedent(input), 'hello\n\nworld');
  });
});

describe('escapeHtml', () => {
  it('returns empty string for null/undefined', () => {
    assert.equal(escapeHtml(null), '');
  });

  it('escapes special characters', () => {
    assert.equal(escapeHtml('<div class="a">b & c</div>'), '&lt;div class=&quot;a&quot;&gt;b &amp; c&lt;/div&gt;');
  });

  it('escapes single quotes', () => {
    assert.equal(escapeHtml("it's"), 'it&#39;s');
  });
});

describe('unescapeHtml', () => {
  it('returns empty string for null/undefined', () => {
    assert.equal(unescapeHtml(null), '');
  });

  it('unescapes HTML entities', () => {
    assert.equal(unescapeHtml('&lt;b&gt;hi&lt;/b&gt;'), '<b>hi</b>');
  });

  it('round-trips with escapeHtml', () => {
    const original = '<p>"Hello" & \'world\'</p>';
    assert.equal(unescapeHtml(escapeHtml(original)), original);
  });
});

describe('countWords', () => {
  it('returns 0 for null/undefined', () => {
    assert.equal(countWords(null), 0);
    assert.equal(countWords(undefined), 0);
  });

  it('returns 0 for empty/whitespace strings', () => {
    assert.equal(countWords(''), 0);
    assert.equal(countWords('   '), 0);
  });

  it('counts words correctly', () => {
    assert.equal(countWords('hello world'), 2);
    assert.equal(countWords('one  two  three'), 3);
  });
});

describe('countLines', () => {
  it('returns 0 for null/undefined', () => {
    assert.equal(countLines(null), 0);
    assert.equal(countLines(undefined), 0);
  });

  it('returns 0 for empty string', () => {
    assert.equal(countLines(''), 0);
  });

  it('counts lines correctly', () => {
    assert.equal(countLines('hello'), 1);
    assert.equal(countLines('hello\nworld'), 2);
    assert.equal(countLines('a\nb\nc'), 3);
  });
});
