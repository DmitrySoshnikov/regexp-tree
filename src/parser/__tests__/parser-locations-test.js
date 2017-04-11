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
      start: 0,
      end: 7,
    });

    // CharacterClass.
    expect(ast.body.loc).toEqual({
      source: '[a-z]',
      start: 1,
      end: 6,
    });

    // ClassRange.
    const classRange = ast.body.expressions[0];

    expect(classRange.loc).toEqual({
      source: 'a-z',
      start: 2,
      end: 5,
    });

    expect(classRange.from.loc).toEqual({
      source: 'a',
      start: 2,
      end: 3,
    });

    expect(classRange.to.loc).toEqual({
      source: 'z',
      start: 4,
      end: 5,
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

});
