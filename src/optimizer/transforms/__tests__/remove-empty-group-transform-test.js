/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const removeEmptyGroup = require('../remove-empty-group-transform');

describe('remove empty groups', () => {

  it('removes empty groups', () => {
    const re = transform(/a(?:)b/, [
      removeEmptyGroup
    ]);
    expect(re.toString()).toBe('/ab/');

    const re2 = transform(/((?:))/, [
      removeEmptyGroup
    ]);
    expect(re2.toString()).toBe('/()/');
  });

  it('does not remove empty regexp', () => {
    const re = transform(/(?:)/, [
      removeEmptyGroup
    ]);
    expect(re.toString()).toBe('/(?:)/');
  });

  it('removes empty group quantifier', () => {
    const re = transform(/(?:)+/, [
      removeEmptyGroup
    ]);
    expect(re.toString()).toBe('/(?:)/');
  });

});