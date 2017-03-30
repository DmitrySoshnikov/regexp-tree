/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const regexpTree = require('..');

regexpTree.setOptions({captureLocations: true});

function re(regexp) {
  return regexpTree.parse(regexp.toString());
}

describe('locations', () => {

  it('char class', () => {
    const ast = re(/[a-z]/);

    // RegExp.
    expect(ast.loc).toEqual({start: 0, end: 7});

    // CharacterClass.
    expect(ast.body.loc).toEqual({start: 1, end: 6});

    // ClassRange.
    const classRange = ast.body.expressions[0];
    expect(classRange.loc).toEqual({start: 2, end: 5});
    expect(classRange.from.loc).toEqual({start: 2, end: 3});
    expect(classRange.to.loc).toEqual({start: 4, end: 5});
  });

});
