/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const singleCharsGroupToCharClass = require('../group-single-chars-to-char-class');

describe('(a|b|c) -> ([abc])', () => {

  it('replaces single chars group to char class', () => {
    const re = transform(/(a|b|c)/, [
      singleCharsGroupToCharClass,
    ]);
    expect(re.toString()).toBe('/([abc])/');
  });

  it('works with metachars too', () => {
    const re = transform(/(\d|\n)/, [
      singleCharsGroupToCharClass,
    ]);
    expect(re.toString()).toBe(/([\d\n])/.toString());
  });

  it('merges duplicates in group', () => {
    const re = transform(/(a|b|a|b)/, [
      singleCharsGroupToCharClass,
    ]);
    expect(re.toString()).toBe('/([ab])/');
  });

  it('removes non-capturing group', () => {
    const re = transform(/(?:a|b|c)/, [
      singleCharsGroupToCharClass,
    ]);
    expect(re.toString()).toBe('/[abc]/');
  });

  it('have no effect on multichar values', () => {
    const re = transform(/(a|b|no)/, [
      singleCharsGroupToCharClass,
    ]);
    expect(re.toString()).toBe('/(a|b|no)/');
  });

});