/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const charStarToPlus = require('../char-star-to-plus-transform');

describe('aa* -> a+', () => {

  it('replaces simple chars', () => {
    const re = transform(/aa*/, [
      charStarToPlus,
    ]);
    expect(re.toString()).toBe('/a+/');
  });

  it('replaces complex patterns', () => {
    const re = transform(/[a-zA-Z_0-9][a-zA-Z_0-9]*/, [
      charStarToPlus,
    ]);
    expect(re.toString()).toBe('/[a-zA-Z_0-9]+/');
  });

});