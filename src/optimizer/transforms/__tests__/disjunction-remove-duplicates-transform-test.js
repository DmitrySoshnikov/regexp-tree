/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const disjunctionRemoveDuplicates = require('../disjunction-remove-duplicates-transform');

describe('(ab|bc|ab) -> (ab|bc)', () => {

  it('removes duplicates from disjunction', () => {
    const re = transform(/ab|bc|ab/, [
      disjunctionRemoveDuplicates
    ]);
    expect(re.toString()).toBe('/ab|bc/');
  });

  it('preserves order', () => {
    const re = transform(/bc|bc|ab/, [
      disjunctionRemoveDuplicates
    ]);
    expect(re.toString()).toBe('/bc|ab/');
  });

  it('replaces disjunction containing only one part', () => {
    const re = transform(/ab|ab/, [
      disjunctionRemoveDuplicates
    ]);
    expect(re.toString()).toBe('/ab/');
  });

  it('does not merge capturing groups', () => {
    const re = transform(/(ab)|(ab)/, [
      disjunctionRemoveDuplicates
    ]);
    expect(re.toString()).toBe('/(ab)|(ab)/');
  });

  it('handles recursion', () => {
    const re = transform(/(ab|bc|ab)|(bc|cd|bc)/, [
      disjunctionRemoveDuplicates
    ]);
    expect(re.toString()).toBe('/(ab|bc)|(bc|cd)/');

    const re2 = transform(/(?:ab|bc|ab)|(?:ab|bc|ab)/, [
      disjunctionRemoveDuplicates
    ]);
    expect(re2.toString()).toBe('/(?:ab|bc)/');
  });

  it('handles empty parts', () => {
    const re = transform(/a|b|||/, [
      disjunctionRemoveDuplicates
    ]);
    expect(re.toString()).toBe('/a|b|/');
  });

});