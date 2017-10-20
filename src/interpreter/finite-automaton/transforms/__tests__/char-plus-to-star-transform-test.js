/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../../transform');
const charPlusToStar = require('../char-plus-to-star-transform');

describe('a+ -> aa+', () => {

  it('replaces simple chars', () => {
    const re = transform(/a+/, [
      charPlusToStar,
    ]);
    expect(re.toString()).toBe('/aa*/');
  });

  it('replaces complex patterns', () => {
    const re = transform(/[a-zA-Z_0-9]+/, [
      charPlusToStar,
    ]);
    expect(re.toString()).toBe('/[a-zA-Z_0-9][a-zA-Z_0-9]*/');
  });

  it('replaces in alternative', () => {
    const re = transform(/axa+/, [
      charPlusToStar,
    ]);
    expect(re.toString()).toBe('/axaa*/');
  });

  it('replaces in non-alternative', () => {
    const re = transform(/x|a+/, [
      charPlusToStar,
    ]);
    expect(re.toString()).toBe('/x|aa*/');
  });

});