/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const parser = require('..');

function re(regexp) {
  return parser.parse(regexp.toString());
}

describe('basic', () => {
  it('char', () => {
    expect(re(/a/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Char',
        value: 'a',
        symbol: 'a',
        kind: 'simple',
        codePoint: 'a'.codePointAt(0),
      },
      flags: '',
    });
  });

  it('parens char', () => {
    expect(re(/\(\)/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Alternative',
        expressions: [
          {
            type: 'Char',
            value: '(',
            symbol: '(',
            kind: 'simple',
            escaped: true,
            codePoint: '('.codePointAt(0),
          },
          {
            type: 'Char',
            value: ')',
            symbol: ')',
            kind: 'simple',
            escaped: true,
            codePoint: ')'.codePointAt(0),
          },
        ],
      },
      flags: '',
    });
  });

  it('disjunction', () => {
    expect(re(/a|b/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Disjunction',
        left: {
          type: 'Char',
          value: 'a',
          symbol: 'a',
          kind: 'simple',
          codePoint: 'a'.codePointAt(0),
        },
        right: {
          type: 'Char',
          value: 'b',
          symbol: 'b',
          kind: 'simple',
          codePoint: 'b'.codePointAt(0),
        },
      },
      flags: '',
    });
  });

  it('alternative', () => {
    expect(re(/ab/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Alternative',
        expressions: [
          {
            type: 'Char',
            value: 'a',
            symbol: 'a',
            kind: 'simple',
            codePoint: 'a'.codePointAt(0),
          },
          {
            type: 'Char',
            value: 'b',
            symbol: 'b',
            kind: 'simple',
            codePoint: 'b'.codePointAt(0),
          },
        ],
      },
      flags: '',
    });
  });

  it('character class', () => {
    expect(re(/[a-z\d]/i)).toEqual({
      type: 'RegExp',
      body: {
        type: 'CharacterClass',
        expressions: [
          {
            type: 'ClassRange',
            from: {
              type: 'Char',
              value: 'a',
              symbol: 'a',
              kind: 'simple',
              codePoint: 'a'.codePointAt(0),
            },
            to: {
              type: 'Char',
              value: 'z',
              symbol: 'z',
              kind: 'simple',
              codePoint: 'z'.codePointAt(0),
            },
          },
          {
            type: 'Char',
            value: '\\d',
            kind: 'meta',
            codePoint: NaN,
          },
        ],
      },
      flags: 'i',
    });

    expect(re(/[a\-z]/u)).toEqual({
      type: 'RegExp',
      body: {
        type: 'CharacterClass',
        expressions: [
          {
            type: 'Char',
            value: 'a',
            symbol: 'a',
            kind: 'simple',
            codePoint: 'a'.codePointAt(0),
          },
          {
            type: 'Char',
            value: '-',
            symbol: '-',
            kind: 'simple',
            escaped: true,
            codePoint: '-'.codePointAt(0),
          },
          {
            type: 'Char',
            value: 'z',
            symbol: 'z',
            kind: 'simple',
            codePoint: 'z'.codePointAt(0),
          },
        ],
      },
      flags: 'u',
    });
  });

  it('empty class', () => {
    /*eslint no-empty-character-class:0*/
    expect(re(/[]/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'CharacterClass',
        expressions: [],
      },
      flags: '',
    });

    expect(re(/[^]/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'CharacterClass',
        negative: true,
        expressions: [],
      },
      flags: '',
    });
  });

  it('character class with punctuation symbols', () => {
    expect(re('/[!"#$%&\'()*+,./:;<=>?@^_`{|}~-]/')).toEqual({
      type: 'RegExp',
      body: {
        type: 'CharacterClass',
        expressions: [
          {
            type: 'Char',
            kind: 'simple',
            value: '!',
            symbol: '!',
            codePoint: '!'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '"',
            symbol: '"',
            codePoint: '"'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '#',
            symbol: '#',
            codePoint: '#'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '$',
            symbol: '$',
            codePoint: '$'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '%',
            symbol: '%',
            codePoint: '%'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '&',
            symbol: '&',
            codePoint: '&'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            // prettier-ignore
            value: '\'',
            // prettier-ignore
            symbol: '\'',
            // prettier-ignore
            codePoint: '\''.codePointAt(0)
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '(',
            symbol: '(',
            codePoint: '('.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: ')',
            symbol: ')',
            codePoint: ')'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '*',
            symbol: '*',
            codePoint: '*'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '+',
            symbol: '+',
            codePoint: '+'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: ',',
            symbol: ',',
            codePoint: ','.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '.',
            symbol: '.',
            codePoint: '.'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '/',
            symbol: '/',
            codePoint: '/'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: ':',
            symbol: ':',
            codePoint: ':'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: ';',
            symbol: ';',
            codePoint: ';'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '<',
            symbol: '<',
            codePoint: '<'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '=',
            symbol: '=',
            codePoint: '='.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '>',
            symbol: '>',
            codePoint: '>'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '?',
            symbol: '?',
            codePoint: '?'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '@',
            symbol: '@',
            codePoint: '@'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '^',
            symbol: '^',
            codePoint: '^'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '_',
            symbol: '_',
            codePoint: '_'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '`',
            symbol: '`',
            codePoint: '`'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '{',
            symbol: '{',
            codePoint: '{'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '|',
            symbol: '|',
            codePoint: '|'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '}',
            symbol: '}',
            codePoint: '}'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '~',
            symbol: '~',
            codePoint: '~'.codePointAt(0),
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '-',
            symbol: '-',
            codePoint: '-'.codePointAt(0),
          },
        ],
      },
      flags: '',
    });
  });

  it('named capturing group duplicate', () => {
    expect(() => parser.parse('/(?<foo>)(?<foo>)/')).toThrowError(
      new SyntaxError(`Duplicate of the named group "foo".`)
    );
  });

  it('allow named capturing group duplicate', () => {
    expect(() =>
      parser.parse('/(?<foo>)(?<foo>)/', {allowGroupNameDuplicates: true})
    ).not.toThrow();
  });

  it('named unicode name', () => {
    expect(() => parser.parse('/(?<\\u{41}\\u0042>)/')).toThrowError(
      new SyntaxError(
        `invalid group Unicode name "\\u{41}\\u0042", use \`u\` flag.`
      )
    );

    expect(() => parser.parse('/(?<A>)\\k<\\u{41}>/')).toThrowError(
      new SyntaxError(`invalid group Unicode name "\\u{41}", use \`u\` flag.`)
    );

    expect(() => parser.parse('/(?<\\u{41}>)/u')).not.toThrow();
    expect(() => parser.parse('/(?<A>)\\k<\\u{41}>/u')).not.toThrow();
  });

  it('capturing group numbers', () => {
    expect(re('/(?:)(a)(?:)(?<name>b)/')).toEqual({
      type: 'RegExp',
      body: {
        type: 'Alternative',
        expressions: [
          {
            type: 'Group',
            capturing: false,
            expression: null,
          },
          {
            type: 'Group',
            capturing: true,
            number: 1,
            expression: {
              type: 'Char',
              value: 'a',
              symbol: 'a',
              kind: 'simple',
              codePoint: 'a'.codePointAt(0),
            },
          },
          {
            type: 'Group',
            capturing: false,
            expression: null,
          },
          {
            type: 'Group',
            capturing: true,
            name: 'name',
            nameRaw: 'name',
            number: 2,
            expression: {
              type: 'Char',
              value: 'b',
              symbol: 'b',
              kind: 'simple',
              codePoint: 'b'.codePointAt(0),
            },
          },
        ],
      },
      flags: '',
    });
  });

  it('empty group', () => {
    expect(re(/()/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Group',
        capturing: true,
        number: 1,
        expression: null,
      },
      flags: '',
    });

    // Not using `re` helper here because named groups are not yet implemented.
    expect(parser.parse('/(?<foo>)/')).toEqual({
      type: 'RegExp',
      body: {
        type: 'Group',
        capturing: true,
        name: 'foo',
        nameRaw: 'foo',
        number: 1,
        expression: null,
      },
      flags: '',
    });

    expect(re(/(?:)/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Group',
        capturing: false,
        expression: null,
      },
      flags: '',
    });
  });

  it('non-empty group', () => {
    expect(re(/(a)/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Group',
        capturing: true,
        number: 1,
        expression: {
          type: 'Char',
          value: 'a',
          symbol: 'a',
          kind: 'simple',
          codePoint: 'a'.codePointAt(0),
        },
      },
      flags: '',
    });

    // Not using `re` helper here because named groups are not yet implemented.
    expect(parser.parse('/(?<foo>a)/')).toEqual({
      type: 'RegExp',
      body: {
        type: 'Group',
        name: 'foo',
        nameRaw: 'foo',
        capturing: true,
        number: 1,
        expression: {
          type: 'Char',
          value: 'a',
          symbol: 'a',
          kind: 'simple',
          codePoint: 'a'.codePointAt(0),
        },
      },
      flags: '',
    });

    expect(re(/(?:a)/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Group',
        capturing: false,
        expression: {
          type: 'Char',
          value: 'a',
          symbol: 'a',
          kind: 'simple',
          codePoint: 'a'.codePointAt(0),
        },
      },
      flags: '',
    });
  });

  it('empty LA assertion', () => {
    expect(re(/(?=)/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Assertion',
        kind: 'Lookahead',
        assertion: null,
      },
      flags: '',
    });

    expect(re(/(?!)/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Assertion',
        kind: 'Lookahead',
        negative: true,
        assertion: null,
      },
      flags: '',
    });
  });

  it('non-empty LA assertion', () => {
    expect(re(/(?=a)/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Assertion',
        kind: 'Lookahead',
        assertion: {
          type: 'Char',
          value: 'a',
          symbol: 'a',
          kind: 'simple',
          codePoint: 'a'.codePointAt(0),
        },
      },
      flags: '',
    });

    expect(re(/(?!a)/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Assertion',
        kind: 'Lookahead',
        negative: true,
        assertion: {
          type: 'Char',
          value: 'a',
          symbol: 'a',
          kind: 'simple',
          codePoint: 'a'.codePointAt(0),
        },
      },
      flags: '',
    });
  });

  it('empty LB assertion', () => {
    // Not using `re` helper here because lookbehind
    // assertions are not yet implemented in JS.
    expect(parser.parse('/(?<=)/')).toEqual({
      type: 'RegExp',
      body: {
        type: 'Assertion',
        kind: 'Lookbehind',
        assertion: null,
      },
      flags: '',
    });

    expect(parser.parse('/(?<!)/')).toEqual({
      type: 'RegExp',
      body: {
        type: 'Assertion',
        kind: 'Lookbehind',
        negative: true,
        assertion: null,
      },
      flags: '',
    });
  });

  it('non-empty LB assertion', () => {
    // Not using `re` helper here because lookbehind
    // assertions are not yet implemented in JS.
    expect(re('/(?<=a)/')).toEqual({
      type: 'RegExp',
      body: {
        type: 'Assertion',
        kind: 'Lookbehind',
        assertion: {
          type: 'Char',
          value: 'a',
          symbol: 'a',
          kind: 'simple',
          codePoint: 'a'.codePointAt(0),
        },
      },
      flags: '',
    });

    expect(parser.parse('/(?<!a)/')).toEqual({
      type: 'RegExp',
      body: {
        type: 'Assertion',
        kind: 'Lookbehind',
        negative: true,
        assertion: {
          type: 'Char',
          value: 'a',
          symbol: 'a',
          kind: 'simple',
          codePoint: 'a'.codePointAt(0),
        },
      },
      flags: '',
    });
  });

  it('numeric backreference', () => {
    expect(re(/(a)\1\2/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Alternative',
        expressions: [
          {
            type: 'Group',
            capturing: true,
            number: 1,
            expression: {
              type: 'Char',
              value: 'a',
              symbol: 'a',
              kind: 'simple',
              codePoint: 'a'.codePointAt(0),
            },
          },
          {
            type: 'Backreference',
            kind: 'number',
            number: 1,
            reference: 1,
          },
          {
            type: 'Char',
            value: '\\2',
            kind: 'decimal',
            symbol: String.fromCodePoint(2),
            codePoint: 2,
          },
        ],
      },
      flags: '',
    });
  });

  it('named backreference', () => {
    // Not using `re` helper here because named groups are not yet implemented
    expect(parser.parse('/(?<x>y)\\k<x>\\k<z>/')).toEqual({
      type: 'RegExp',
      body: {
        type: 'Alternative',
        expressions: [
          {
            type: 'Group',
            capturing: true,
            number: 1,
            name: 'x',
            nameRaw: 'x',
            expression: {
              type: 'Char',
              value: 'y',
              symbol: 'y',
              kind: 'simple',
              codePoint: 'y'.codePointAt(0),
            },
          },
          {
            type: 'Backreference',
            kind: 'name',
            number: 1,
            reference: 'x',
            referenceRaw: 'x',
          },
          {
            type: 'Char',
            value: 'k',
            symbol: 'k',
            kind: 'simple',
            escaped: true,
            codePoint: 'k'.codePointAt(0),
          },
          {
            type: 'Char',
            value: '<',
            symbol: '<',
            kind: 'simple',
            codePoint: '<'.codePointAt(0),
          },
          {
            type: 'Char',
            value: 'z',
            symbol: 'z',
            kind: 'simple',
            codePoint: 'z'.codePointAt(0),
          },
          {
            type: 'Char',
            value: '>',
            symbol: '>',
            kind: 'simple',
            codePoint: '>'.codePointAt(0),
          },
        ],
      },
      flags: '',
    });
  });

  it('non-backreferences', () => {
    expect(re(/(?:a)\1\k<z>/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Alternative',
        expressions: [
          {
            type: 'Group',
            capturing: false,
            expression: {
              type: 'Char',
              value: 'a',
              symbol: 'a',
              kind: 'simple',
              codePoint: 'a'.codePointAt(0),
            },
          },
          {
            type: 'Char',
            value: '\\1',
            symbol: String.fromCodePoint(1),
            kind: 'decimal',
            codePoint: 1,
          },
          {
            type: 'Char',
            value: 'k',
            symbol: 'k',
            kind: 'simple',
            escaped: true,
            codePoint: 'k'.codePointAt(0),
          },
          {
            type: 'Char',
            value: '<',
            symbol: '<',
            kind: 'simple',
            codePoint: '<'.codePointAt(0),
          },
          {
            type: 'Char',
            value: 'z',
            symbol: 'z',
            kind: 'simple',
            codePoint: 'z'.codePointAt(0),
          },
          {
            type: 'Char',
            value: '>',
            symbol: '>',
            kind: 'simple',
            codePoint: '>'.codePointAt(0),
          },
        ],
      },
      flags: '',
    });
  });

  it('meta chars', () => {
    function LettersRange(start, stop) {
      const range = [];

      for (
        let idx = start.charCodeAt(0), end = stop.charCodeAt(0);
        idx <= end;
        ++idx
      ) {
        range.push(String.fromCodePoint(idx));
      }

      return range;
    }

    const metaChars = new Set([
      't',
      'n',
      'r',
      'd',
      'D',
      's',
      'S',
      'w',
      'W',
      'v',
      'f',
    ]);

    const azAZRange = LettersRange('a', 'z').concat(LettersRange('A', 'Z'));

    for (const letter of azAZRange) {
      const parsedChar = parser.parse(`/\\${letter}/`).body;
      if (metaChars.has(letter)) {
        expect(parsedChar.kind).toBe('meta');
      } else {
        expect(parsedChar.kind).not.toBe('meta');
      }
    }

    // Special case for [\b] - Backspace
    const backspace = parser.parse('/[\\b]/').body.expressions[0];
    expect(backspace.kind).toBe('meta');
  });

  it('unicode', () => {
    expect(re(/\u003B/).body).toEqual({
      type: 'Char',
      value: '\\u003B',
      symbol: String.fromCodePoint(0x003b),
      kind: 'unicode',
      codePoint: 0x003b,
    });

    // Using `u` flag, 1 digit.
    expect(re(/\u{9}/u).body).toEqual({
      type: 'Char',
      value: '\\u{9}',
      symbol: String.fromCodePoint(9),
      kind: 'unicode',
      codePoint: 9,
    });

    // Using `u` flag, 6 digits, 10FFFF is max.
    expect(re(/\u{10FFFF}/u).body).toEqual({
      type: 'Char',
      value: '\\u{10FFFF}',
      symbol: String.fromCodePoint(0x10ffff),
      kind: 'unicode',
      codePoint: 0x10ffff,
    });

    // Using `u` flag, leading zeros.
    expect(re(/\u{000001D306}/u).body).toEqual({
      type: 'Char',
      value: '\\u{000001D306}',
      symbol: String.fromCodePoint(0x000001d306),
      kind: 'unicode',
      codePoint: 0x000001d306,
    });

    // Not using `u` flag, not parsed as a unicode code point,
    // but as an (escaped) `u` character repeated 1234 times.
    expect(re(/\u{1234}/).body).toEqual({
      type: 'Repetition',
      expression: {
        type: 'Char',
        value: 'u',
        symbol: 'u',
        kind: 'simple',
        escaped: true,
        codePoint: 'u'.codePointAt(0),
      },
      quantifier: {
        type: 'Quantifier',
        kind: 'Range',
        from: 1234,
        to: 1234,
        greedy: true,
      },
    });

    // Using `u` flag, surrogate pairs.
    expect(re(/\ud83d\ude80/u).body).toEqual({
      type: 'Char',
      value: '\\ud83d\\ude80',
      kind: 'unicode',
      symbol: String.fromCodePoint(0x1f680),
      codePoint: 0x1f680,
      isSurrogatePair: true,
    });

    // Using `u` flag, surrogate pairs in character class.
    expect(re(/[\ud83d\ude80]/u).body).toEqual({
      type: 'CharacterClass',
      expressions: [
        {
          type: 'Char',
          value: '\\ud83d\\ude80',
          kind: 'unicode',
          symbol: String.fromCodePoint(0x1f680),
          codePoint: 0x1f680,
          isSurrogatePair: true,
        },
      ],
    });

    // Not using `u` flag, surrogate pairs are treated as two characters
    expect(re(/\ud83d\ude80/).body).toEqual({
      type: 'Alternative',
      expressions: [
        {
          type: 'Char',
          value: '\\ud83d',
          kind: 'unicode',
          symbol: String.fromCodePoint(0xd83d),
          codePoint: 0xd83d,
        },
        {
          type: 'Char',
          value: '\\ude80',
          kind: 'unicode',
          symbol: String.fromCodePoint(0xde80),
          codePoint: 0xde80,
        },
      ],
    });
  });

  it('valid sorted flags', () => {
    expect(re(/a/gimuy)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Char',
        value: 'a',
        symbol: 'a',
        kind: 'simple',
        codePoint: 'a'.codePointAt(0),
      },
      flags: 'gimuy',
    });
  });

  it('valid not sorted flags', () => {
    // Not using `re` helper here because `RegExp.prototype.toString` sorts flags
    expect(parser.parse('/a/mgyiu')).toEqual({
      type: 'RegExp',
      body: {
        type: 'Char',
        value: 'a',
        symbol: 'a',
        kind: 'simple',
        codePoint: 'a'.codePointAt(0),
      },
      flags: 'gimuy',
    });
  });

  it('hex escape', () => {
    expect(re(/\x33/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Char',
        value: '\\x33',
        kind: 'hex',
        symbol: String.fromCodePoint(0x33),
        codePoint: 0x33,
      },
      flags: '',
    });
  });

  it('decimal escape', () => {
    expect(re(/\99/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Char',
        value: '\\99',
        kind: 'decimal',
        symbol: String.fromCodePoint(99),
        codePoint: 99,
      },
      flags: '',
    });
  });

  it('dotAll (/s) flag', () => {
    // Not using `re` helper here because /s flag is not yet implemented
    expect(parser.parse('/a/s')).toEqual({
      type: 'RegExp',
      body: {
        type: 'Char',
        value: 'a',
        symbol: 'a',
        kind: 'simple',
        codePoint: 'a'.codePointAt(0),
      },
      flags: 's',
    });
  });

  it('throws error on invalid Unicode escape', () => {
    expect(() => parser.parse('/\\p/u')).toThrowError(SyntaxError);
    expect(() => parser.parse('/\\e/u')).toThrowError(SyntaxError);
    expect(() => parser.parse('/\\g/u')).toThrowError(SyntaxError);
    expect(() => parser.parse('/\\-/u')).toThrowError(SyntaxError);
  });

  it('should not throw when identity escape is a syntax character', () => {
    expect(() => parser.parse('/\\./u')).not.toThrowError();
  });
});
