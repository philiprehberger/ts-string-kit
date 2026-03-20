/**
 * @philiprehberger/string-kit
 * String manipulation utilities — truncate, pad, wrap, template
 */

export type TruncatePosition = 'end' | 'middle' | 'start';

export interface TruncateOptions {
  /** Maximum length of the output string including the ellipsis. */
  maxLength: number;
  /** Where to truncate: 'end' (default), 'middle', or 'start'. */
  position?: TruncatePosition;
  /** The ellipsis string to use. Defaults to '...'. */
  ellipsis?: string;
  /** Whether to truncate at word boundaries. Defaults to true. */
  wordBoundary?: boolean;
}

/**
 * Truncate a string to a maximum length, optionally at word boundaries.
 * Supports truncation at the end, middle, or start of the string.
 */
export function truncate(str: string | null | undefined, options: TruncateOptions): string {
  if (str == null) return '';
  const { maxLength, position = 'end', ellipsis = '...', wordBoundary = true } = options;

  if (str.length <= maxLength) return str;
  if (maxLength <= ellipsis.length) return ellipsis.slice(0, maxLength);

  const availableLength = maxLength - ellipsis.length;

  if (position === 'start') {
    let result = str.slice(str.length - availableLength);
    if (wordBoundary) {
      const spaceIndex = result.indexOf(' ');
      if (spaceIndex > 0 && spaceIndex < result.length - 1) {
        result = result.slice(spaceIndex + 1);
      }
    }
    return ellipsis + result;
  }

  if (position === 'middle') {
    const halfLength = Math.floor(availableLength / 2);
    const startPart = str.slice(0, halfLength);
    const endPart = str.slice(str.length - (availableLength - halfLength));
    return startPart + ellipsis + endPart;
  }

  // position === 'end'
  let result = str.slice(0, availableLength);
  if (wordBoundary) {
    const lastSpace = result.lastIndexOf(' ');
    if (lastSpace > 0) {
      result = result.slice(0, lastSpace);
    }
  }
  return result + ellipsis;
}

/**
 * Simple string template interpolation. Replaces `{key}` placeholders
 * with values from the provided data object.
 */
export function template(
  str: string | null | undefined,
  data: Record<string, string | number | boolean | null | undefined>,
): string {
  if (str == null) return '';
  return str.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = data[key];
    return value != null ? String(value) : match;
  });
}

/**
 * Return the singular or plural form of a word based on count.
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string,
): string {
  const pluralForm = plural ?? singular + 's';
  return count === 1 ? singular : pluralForm;
}

export interface WordWrapOptions {
  /** Maximum line width. Defaults to 80. */
  width?: number;
  /** String to use for newlines. Defaults to '\n'. */
  newline?: string;
}

/**
 * Wrap text at word boundaries to fit within a maximum width.
 */
export function wordWrap(
  str: string | null | undefined,
  options: WordWrapOptions = {},
): string {
  if (str == null) return '';
  const { width = 80, newline = '\n' } = options;

  if (str.length === 0) return '';

  const lines = str.split('\n');
  const wrappedLines: string[] = [];

  for (const line of lines) {
    if (line.length <= width) {
      wrappedLines.push(line);
      continue;
    }

    const words = line.split(' ');
    let currentLine = '';

    for (const word of words) {
      if (currentLine.length === 0) {
        currentLine = word;
      } else if (currentLine.length + 1 + word.length <= width) {
        currentLine += ' ' + word;
      } else {
        wrappedLines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine.length > 0) {
      wrappedLines.push(currentLine);
    }
  }

  return wrappedLines.join(newline);
}

export type PadDirection = 'left' | 'right' | 'center';

/**
 * Pad a string to a given length with a fill character.
 */
export function pad(
  str: string | null | undefined,
  length: number,
  direction: PadDirection = 'right',
  fillChar: string = ' ',
): string {
  if (str == null) str = '';
  if (str.length >= length) return str;

  const fill = fillChar[0] || ' ';
  const needed = length - str.length;

  if (direction === 'left') {
    return fill.repeat(needed) + str;
  }

  if (direction === 'center') {
    const leftPad = Math.floor(needed / 2);
    const rightPad = needed - leftPad;
    return fill.repeat(leftPad) + str + fill.repeat(rightPad);
  }

  // direction === 'right'
  return str + fill.repeat(needed);
}

// eslint-disable-next-line no-control-regex
const ANSI_REGEX = /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g;

/**
 * Strip ANSI escape codes from a string.
 */
export function stripAnsi(str: string | null | undefined): string {
  if (str == null) return '';
  return str.replace(ANSI_REGEX, '');
}

const HTML_TAG_REGEX = /<[^>]*>/g;

/**
 * Strip HTML tags from a string.
 */
export function stripHtml(str: string | null | undefined): string {
  if (str == null) return '';
  return str.replace(HTML_TAG_REGEX, '');
}

/**
 * Indent each line of a string by a given number of spaces.
 */
export function indent(
  str: string | null | undefined,
  spaces: number = 2,
  char: string = ' ',
): string {
  if (str == null) return '';
  const prefix = (char[0] || ' ').repeat(spaces);
  return str
    .split('\n')
    .map((line) => prefix + line)
    .join('\n');
}

/**
 * Remove common leading whitespace from all lines.
 */
export function dedent(str: string | null | undefined): string {
  if (str == null) return '';
  const lines = str.split('\n');

  // Find minimum indentation among non-empty lines
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim().length === 0) continue;
    const match = line.match(/^(\s*)/);
    if (match) {
      minIndent = Math.min(minIndent, match[1].length);
    }
  }

  if (minIndent === Infinity || minIndent === 0) return str;

  return lines.map((line) => line.slice(minIndent)).join('\n');
}

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const HTML_UNESCAPE_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

/**
 * Escape special HTML characters in a string.
 */
export function escapeHtml(str: string | null | undefined): string {
  if (str == null) return '';
  return str.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

/**
 * Unescape HTML entities back to their original characters.
 */
export function unescapeHtml(str: string | null | undefined): string {
  if (str == null) return '';
  return str.replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => HTML_UNESCAPE_MAP[entity] || entity);
}

/**
 * Count the number of words in a string.
 */
export function countWords(str: string | null | undefined): number {
  if (str == null) return 0;
  const trimmed = str.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * Count the number of lines in a string.
 */
export function countLines(str: string | null | undefined): number {
  if (str == null) return 0;
  if (str.length === 0) return 0;
  return str.split('\n').length;
}
