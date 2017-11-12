/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const parser = require('..');
const traverse = require('../../traverse');

parser.setOptions({captureLocations: true});

function re(regexp) {
  return parser.parse(regexp.toString());
}

describe('locations', () => {

  it('char class', () => {
    const ast = re(/[a-z]/);

    // RegExp.
    expect(ast.loc).toEqual({
      source: '/[a-z]/',
      start: {
        line: 1,
        column: 0,
        offset: 0,
      },
      end: {
        line: 1,
        column: 7,
        offset: 7,
      },
    });

    // CharacterClass.
    expect(ast.body.loc).toEqual({
      source: '[a-z]',
      start: {
        line: 1,
        column: 1,
        offset: 1,
      },
      end: {
        line: 1,
        column: 6,
        offset: 6,
      },
    });

    // ClassRange.
    const classRange = ast.body.expressions[0];

    expect(classRange.loc).toEqual({
      source: 'a-z',
      start: {
        line: 1,
        column: 2,
        offset: 2,
      },
      end: {
        line: 1,
        column: 5,
        offset: 5,
      },
    });

    expect(classRange.from.loc).toEqual({
      source: 'a',
      start: {
        line: 1,
        column: 2,
        offset: 2,
      },
      end: {
        line: 1,
        column: 3,
        offset: 3,
      },
    });

    expect(classRange.to.loc).toEqual({
      source: 'z',
      start: {
        line: 1,
        column: 4,
        offset: 4,
      },
      end: {
        line: 1,
        column: 5,
        offset: 5,
      },
    });
  });

  it('location source', () => {
    const ast = parser.parse('/([a-z]+?)|abc/i');
    const sources = [];

    traverse.traverse(ast, {
      '*': ({node}) => {
        sources.push(node.loc.source);
      },
    });

    expect(sources).toEqual([
      '/([a-z]+?)|abc/i',
      '([a-z]+?)|abc',
      '([a-z]+?)',
      '[a-z]+?',
      '[a-z]',
      'a-z',
      'a',
      'z',
      '+',
      'abc',
      'a',
      'b',
      'c',
    ]);
  });

  it('empty disjunction', () => {
    const ast = parser.parse('/|/');

    expect(ast).toEqual({
      type: 'RegExp',
      body: {
        type: 'Disjunction',
        left: null,
        right: null,
        loc: {
          source: '|',
          start: {
            line: 1,
            column: 1,
            offset: 1,
          },
          end: {
            line: 1,
            column: 2,
            offset: 2,
          },
        }
      },
      flags: '',
      loc: {
        source: '/|/',
        start: {
          line: 1,
          column: 0,
          offset: 0,
        },
        end: {
          line: 1,
          column: 3,
          offset: 3,
        },
      }
    });
  });

});
