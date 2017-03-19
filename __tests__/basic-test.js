/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const regexpTree = require('../index');

function re(regexp) {
  return regexpTree.parse(regexp.toString());
}

describe('basic', () => {

  it('char', () => {
    expect(re(/a/)).toEqual({
      type: 'RegExp',
      body: {
        type: 'Char',
        value: 'a',
        kind: 'simple'
      },
      flags: []
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
          kind: 'simple',
        },
        right: {
          type: 'Char',
          value: 'b',
          kind: 'simple',
        }
      },
      flags: [],
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
            kind: 'simple',
          },
          {
            type: 'Char',
            value: 'b',
            kind: 'simple',
          }
        ],
      },
      flags: [],
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
              kind: 'simple'
            },
            to: {
              type: 'Char',
              value: 'z',
              kind: 'simple'
            }
          },
          {
            type: 'Char',
            value: '\\d',
            kind: 'meta'
          }
        ]
      },
      flags: [
        'i'
      ]
    });
  });

});