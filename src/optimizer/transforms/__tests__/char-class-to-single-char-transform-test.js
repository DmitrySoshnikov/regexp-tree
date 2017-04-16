/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const charClassToSingleChar = require('../char-class-to-single-char-transform');

describe('char-class-to-single-char', () => {

  it('simple char', () => {
    const re = transform('/[a]/', [
      charClassToSingleChar,
    ]);
    expect(re.toString()).toBe('/a/');
  });

  it('only one char', () => {
    const re = transform('/[ab]/', [
      charClassToSingleChar,
    ]);
    expect(re.toString()).toBe('/[ab]/');
  });

  it('escaped char', () => {
    const re = transform('/[\\a]/', [
      charClassToSingleChar,
    ]);
    expect(re.toString()).toBe('/\\a/');
  });

  it('should escape', () => {
    const re = transform('/[(]/', [
      charClassToSingleChar,
    ]);
    expect(re.toString()).toBe('/\\(/');
  });

  it('meta', () => {
    let re = transform('/[\\n]/', [
      charClassToSingleChar,
    ]);
    expect(re.toString()).toBe('/\\n/');

    re = transform('/[\\d]/', [
      charClassToSingleChar,
    ]);
    expect(re.toString()).toBe('/\\d/');
  });

  it('backspace', () => {
    const re = transform('/[\\b]/', [
      charClassToSingleChar,
    ]);

    // Stays the same, since \b would have different semantics.
    expect(re.toString()).toBe('/[\\b]/');
  });

  it('inverse meta', () => {
    let re = transform('/[^\\d]/', [
      charClassToSingleChar,
    ]);
    expect(re.toString()).toBe('/\\D/');

    re = transform('/[^\\w]/', [
      charClassToSingleChar,
    ]);
    expect(re.toString()).toBe('/\\W/');

    re = transform('/[^\\W]/', [
      charClassToSingleChar,
    ]);
    expect(re.toString()).toBe('/\\w/');
  });

  it('do not extract simple negative', () => {
    const re = transform('/[^a]/', [
      charClassToSingleChar,
    ]);
    expect(re.toString()).toBe('/[^a]/');
  });

});