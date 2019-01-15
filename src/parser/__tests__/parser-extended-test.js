/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const parser = require('..');

describe('extended', () => {
  it('x flag', () => {
    const re = `/

      # A regular expression for date.

      (?<year>\d{4})-    # year part of a date
      (?<month>\d{2})-   # month part of a date
      (?<day>\d{2})      # day part of a date

    /x`;

    expect(parser.parse(re)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Alternative',
        expressions: [
          {
            type: 'Group',
            name: 'year',
            number: 1,
            capturing: true,
            expression: {
              type: 'Repetition',
              expression: {
                type: 'Char',
                kind: 'simple',
                value: 'd',
                symbol: 'd',
                codePoint: 'd'.codePointAt(0),
              },
              quantifier: {
                type: 'Quantifier',
                from: 4,
                greedy: true,
                kind: 'Range',
                to: 4,
              },
            },
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '-',
            symbol: '-',
            codePoint: '-'.codePointAt(0),
          },
          {
            type: 'Group',
            name: 'month',
            number: 2,
            capturing: true,
            expression: {
              type: 'Repetition',
              expression: {
                type: 'Char',
                kind: 'simple',
                value: 'd',
                symbol: 'd',
                codePoint: 'd'.codePointAt(0),
              },
              quantifier: {
                type: 'Quantifier',
                from: 2,
                greedy: true,
                kind: 'Range',
                to: 2,
              },
            },
          },
          {
            type: 'Char',
            kind: 'simple',
            value: '-',
            symbol: '-',
            codePoint: '-'.codePointAt(0),
          },
          {
            type: 'Group',
            name: 'day',
            number: 3,
            capturing: true,
            expression: {
              type: 'Repetition',
              expression: {
                kind: 'simple',
                type: 'Char',
                value: 'd',
                symbol: 'd',
                codePoint: 'd'.codePointAt(0),
              },
              quantifier: {
                type: 'Quantifier',
                from: 2,
                greedy: true,
                kind: 'Range',
                to: 2,
              },
            },
          },
        ],
      },
      flags: 'x',
    });
  });

  it('escaped space and # with x flag', () => {
    const re = '/\\ \\#/x';

    expect(parser.parse(re)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Alternative',
        expressions: [
          {
            type: 'Char',
            value: ' ',
            symbol: ' ',
            kind: 'simple',
            escaped: true,
            codePoint: ' '.codePointAt(0),
          },
          {
            type: 'Char',
            value: '#',
            symbol: '#',
            kind: 'simple',
            escaped: true,
            codePoint: '#'.codePointAt(0),
          },
        ],
      },
      flags: 'x',
    });
  });

  it('non-escaped space and # in class with x flag', () => {
    const re = '/[ #]/x';

    expect(parser.parse(re)).toEqual({
      type: 'RegExp',
      body: {
        type: 'CharacterClass',
        expressions: [
          {
            type: 'Char',
            value: ' ',
            symbol: ' ',
            kind: 'simple',
            codePoint: ' '.codePointAt(0),
          },
          {
            type: 'Char',
            value: '#',
            symbol: '#',
            kind: 'simple',
            codePoint: '#'.codePointAt(0),
          },
        ],
      },
      flags: 'x',
    });
  });

  it('group numbers', () => {
    const re = /(((a)b)c)(d)(e)/;
    expect(parser.parse(re)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Alternative',
        expressions: [
          {
            type: 'Group',
            capturing: true,
            number: 1,
            expression: {
              type: 'Alternative',
              expressions: [
                {
                  type: 'Group',
                  capturing: true,
                  number: 2,
                  expression: {
                    type: 'Alternative',
                    expressions: [
                      {
                        type: 'Group',
                        capturing: true,
                        number: 3,
                        expression: {
                          type: 'Char',
                          value: 'a',
                          kind: 'simple',
                          symbol: 'a',
                          codePoint: 97,
                        },
                      },
                      {
                        type: 'Char',
                        value: 'b',
                        kind: 'simple',
                        symbol: 'b',
                        codePoint: 98,
                      },
                    ],
                  },
                },
                {
                  type: 'Char',
                  value: 'c',
                  kind: 'simple',
                  symbol: 'c',
                  codePoint: 99,
                },
              ],
            },
          },
          {
            type: 'Group',
            capturing: true,
            number: 4,
            expression: {
              type: 'Char',
              value: 'd',
              kind: 'simple',
              symbol: 'd',
              codePoint: 100,
            },
          },
          {
            type: 'Group',
            capturing: true,
            number: 5,
            expression: {
              type: 'Char',
              value: 'e',
              kind: 'simple',
              symbol: 'e',
              codePoint: 101,
            },
          },
        ],
      },
      flags: '',
    });
  });

  it('group numbers', () => {
    const re = '/(?<c>(?<b>(?<a>a)b)c)(?<d>d)(?<e>e)/';
    expect(parser.parse(re)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Alternative',
        expressions: [
          {
            type: 'Group',
            capturing: true,
            name: 'c',
            number: 1,
            expression: {
              type: 'Alternative',
              expressions: [
                {
                  type: 'Group',
                  capturing: true,
                  name: 'b',
                  number: 2,
                  expression: {
                    type: 'Alternative',
                    expressions: [
                      {
                        type: 'Group',
                        capturing: true,
                        name: 'a',
                        number: 3,
                        expression: {
                          type: 'Char',
                          value: 'a',
                          kind: 'simple',
                          symbol: 'a',
                          codePoint: 97,
                        },
                      },
                      {
                        type: 'Char',
                        value: 'b',
                        kind: 'simple',
                        symbol: 'b',
                        codePoint: 98,
                      },
                    ],
                  },
                },
                {
                  type: 'Char',
                  value: 'c',
                  kind: 'simple',
                  symbol: 'c',
                  codePoint: 99,
                },
              ],
            },
          },
          {
            type: 'Group',
            capturing: true,
            name: 'd',
            number: 4,
            expression: {
              type: 'Char',
              value: 'd',
              kind: 'simple',
              symbol: 'd',
              codePoint: 100,
            },
          },
          {
            type: 'Group',
            capturing: true,
            name: 'e',
            number: 5,
            expression: {
              type: 'Char',
              value: 'e',
              kind: 'simple',
              symbol: 'e',
              codePoint: 101,
            },
          },
        ],
      },
      flags: '',
    });
  });
});
