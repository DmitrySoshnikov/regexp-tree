/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const quantifierRangeToSymbol = require('../quantifier-range-to-symbol-transform');

describe('quantifier range to symbol', () => {

  it('a{1,} -> a+', () => {
    const re = transform(/[a-z]{1,}/, [
      quantifierRangeToSymbol,
    ]);
    expect(re.toString()).toBe('/[a-z]+/');
  });

  it('a{1} -> a', () => {
    const re = transform('/[a-z]{1}/', [
      quantifierRangeToSymbol,
    ]);
    expect(re.toString()).toBe('/[a-z]/');
  });

  it('a{1,1} -> a', () => {
    const re = transform('/[a-z]{1,1}/', [
      quantifierRangeToSymbol,
    ]);
    expect(re.toString()).toBe('/[a-z]/');
  });

  it('a{3,3} -> a{3}', () => {
    const re = transform('/[a-z]{3,3}/', [
      quantifierRangeToSymbol,
    ]);
    expect(re.toString()).toBe('/[a-z]{3}/');
  });

});