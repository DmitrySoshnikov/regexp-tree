/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const charClassToMeta = require('../char-class-to-meta-transform');

describe('char-class-to-meta', () => {

  it('replaces number ranges', () => {
    const re = transform(/[0-9$]/, [
      charClassToMeta,
    ]);
    expect(re.toString()).toBe('/[\\d$]/');
  });

  it('replaces word ranges', () => {
    const re = transform(/[0-9a-zA-Z_$]/, [
      charClassToMeta,
    ]);
    expect(re.toString()).toBe('/[\\w$]/');
  });

  it('whitespace ranges', () => {
    const re = transform(/[ \t\r\n\f]/, [
      charClassToMeta,
    ]);
    expect(re.toString()).toBe('/[\\s]/');
  });

});