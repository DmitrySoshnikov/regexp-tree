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
                codePoint: 'd'.codePointAt(0)
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
            codePoint: '-'.codePointAt(0)
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
                codePoint: 'd'.codePointAt(0)
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
            codePoint: '-'.codePointAt(0)
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
                codePoint: 'd'.codePointAt(0)
              },
              quantifier: {
                type: 'Quantifier',
                from: 2,
                greedy: true,
                kind: 'Range',
                to: 2,
              },
            },
          }
        ],
      },
      flags: 'x'
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
            codePoint: ' '.codePointAt(0)
          },
          {
            type: 'Char',
            value: '#',
            symbol: '#',
            kind: 'simple',
            escaped: true,
            codePoint: '#'.codePointAt(0)
          },
        ],
      },
      flags: 'x'
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
            codePoint: ' '.codePointAt(0)
          },
          {
            type: 'Char',
            value: '#',
            symbol: '#',
            kind: 'simple',
            codePoint: '#'.codePointAt(0)
          },
        ],
      },
      flags: 'x'
    });
  });

});