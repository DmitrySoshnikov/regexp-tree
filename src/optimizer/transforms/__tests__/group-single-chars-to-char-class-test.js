/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const singleCharsGroupToCharClass = require('../group-single-chars-to-char-class');

describe('(a|b|c) -> ([abc])', () => {
  it('replaces single chars disjunction to char class', () => {
    const re = transform(/a|b|c/, [singleCharsGroupToCharClass]);
    expect(re.toString()).toBe('/[abc]/');
  });

  it('merges single chars disjunction with character class', () => {
    const re = transform(/[43]|a|b|[53]|c|[9]/, [singleCharsGroupToCharClass]);
    expect(re.toString()).toBe('/[3459abc]/');
  });

  it('replaces single chars group to char class', () => {
    const re = transform(/(a|b|c)/, [singleCharsGroupToCharClass]);
    expect(re.toString()).toBe('/([abc])/');
  });

  it('works with metachars too', () => {
    const re = transform(/(\d|\n)/, [singleCharsGroupToCharClass]);
    expect(re.toString()).toBe(/([\d\n])/.toString());
  });

  it('merges duplicates in group', () => {
    const re = transform(/(a|b|a|b)/, [singleCharsGroupToCharClass]);
    expect(re.toString()).toBe('/([ab])/');
  });

  it('removes non-capturing group', () => {
    const re = transform(/(?:a|b|c)/, [singleCharsGroupToCharClass]);
    expect(re.toString()).toBe('/[abc]/');
  });

  it('have no effect on multichar values', () => {
    const re = transform(/(a|b|no)/, [singleCharsGroupToCharClass]);
    expect(re.toString()).toBe('/(a|b|no)/');
  });

  it('has no effet on empty values', () => {
    const re = transform(/(a|b|)/, [singleCharsGroupToCharClass]);
    expect(re.toString()).toBe('/(a|b|)/');
  });

  it('does not merge in negative class', () => {
    const re = transform(/(_|[^\s\w])/g, [singleCharsGroupToCharClass]);
    expect(re.toString()).toBe('/(_|[^\\s\\w])/g');
  });
});
