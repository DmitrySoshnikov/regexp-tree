/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const charCaseInsensitiveLowercase = require('../char-case-insensitive-lowercase-transform');

describe('char-case-insensitive-lowercase', () => {

  it('lowercases chars when i flag is set', () => {
    let re = transform(/aA[bB]Ï/i, [
      charCaseInsensitiveLowercase,
    ]);
    expect(re.toString()).toBe('/aa[bb]ï/i');

    re = transform(/\65/i, [
      charCaseInsensitiveLowercase,
    ]);
    expect(re.toString()).toBe('/\\97/i');

    re = transform(/\x41/i, [
      charCaseInsensitiveLowercase,
    ]);
    expect(re.toString()).toBe('/\\x61/i');

    re = transform(/\u0041/i, [
      charCaseInsensitiveLowercase,
    ]);
    expect(re.toString()).toBe('/\\u0061/i');

    re = transform(/\u{41}/iu, [
      charCaseInsensitiveLowercase,
    ]);
    expect(re.toString()).toBe('/\\u{61}/iu');
  });

  it('lowercases char >= \\u1000 when u flag is set', () => {
    const re = transform(/\u10a0/iu, [
      charCaseInsensitiveLowercase,
    ]);
    expect(re.toString()).toBe('/\\u2d00/iu');
  });

  it('does not lowercase char >= \\u1000 without u flag set', () => {
    const re = transform(/\u10a0/i, [
      charCaseInsensitiveLowercase,
    ]);
    expect(re.toString()).toBe('/\\u10a0/i');
  });

  it('lowercases chars in A-Z class ranges when i flag is set', () => {
    let re = transform(/[A-ZB-H]/i, [
      charCaseInsensitiveLowercase,
    ]);
    expect(re.toString()).toBe('/[a-zb-h]/i');

    re = transform(/[\65-\90\66-\72]/i, [
      charCaseInsensitiveLowercase,
    ]);
    expect(re.toString()).toBe('/[\\97-\\122\\98-\\104]/i');

    re = transform(/[\x41-\x5a\x42-\x48]/i, [
      charCaseInsensitiveLowercase,
    ]);
    expect(re.toString()).toBe('/[\\x61-\\x7a\\x62-\\x68]/i');

    re = transform(/[\u0041-\u005a\u0042-\u0048]/i, [
      charCaseInsensitiveLowercase,
    ]);
    expect(re.toString()).toBe('/[\\u0061-\\u007a\\u0062-\\u0068]/i');

    re = transform(/[\u{41}-\u{5a}\u{42}-\u{48}]/iu, [
      charCaseInsensitiveLowercase,
    ]);
    expect(re.toString()).toBe('/[\\u{61}-\\u{7a}\\u{62}-\\u{68}]/iu');
  });

  it('does not run when i flag is absent', () => {
    const re = transform(/aA[bB]Ï/, [
      charCaseInsensitiveLowercase,
    ]);
    expect(re.toString()).toBe('/aA[bB]Ï/');
  });

  it('ignores class ranges outside A-Z', () => {
    const re = transform(/[0-BA-z]/i, [
      charCaseInsensitiveLowercase,
    ]);
    expect(re.toString()).toBe('/[0-BA-z]/i');
  });
});