/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const charCodeToSimpleChar = require('../char-code-to-simple-char-transform');

describe('char-code-to-simple-char', () => {

  it('converts coded chars to simple chars', () => {
    let re = transform(/\u0041\u0020\u007e[\u0042-\u004c\u006d-\u0072]/, [
      charCodeToSimpleChar,
    ]);
    expect(re.toString()).toBe('/A ~[B-Lm-r]/');

    re = transform('/\\u{41}\\u{20}\\u{7e}[\\u{42}-\\u{4c}\\u{6d}-\\u{72}]/u', [
      charCodeToSimpleChar,
    ]);
    expect(re.toString()).toBe('/A ~[B-Lm-r]/u');

    re = transform(/\x41\x20\x7e[\x42-\x4c\x6d-\x72]/, [
      charCodeToSimpleChar,
    ]);
    expect(re.toString()).toBe('/A ~[B-Lm-r]/');

    re = transform(/\040\071[\061-\065]/, [
      charCodeToSimpleChar,
    ]);
    expect(re.toString()).toBe('/ 9[1-5]/');

    re = transform(/\65\32\126[\66-\76\109-\114]/, [
      charCodeToSimpleChar,
    ]);
    expect(re.toString()).toBe('/A ~[B-Lm-r]/');
  });

  it('does not convert coded chars outside of ASCII printable range', () => {
    let re = transform(/\u0016\u00a9/, [
      charCodeToSimpleChar,
    ]);
    expect(re.toString()).toBe('/\\u0016\\u00a9/');

    re = transform('/\\u{16}\\u{a9}/u', [
      charCodeToSimpleChar,
    ]);
    expect(re.toString()).toBe('/\\u{16}\\u{a9}/u');

    re = transform(/\x16\xa9/, [
      charCodeToSimpleChar,
    ]);
    expect(re.toString()).toBe('/\\x16\\xa9/');

    re = transform(/\026/, [
      charCodeToSimpleChar,
    ]);
    expect(re.toString()).toBe('/\\026/');

    re = transform(/\22\169/, [
      charCodeToSimpleChar,
    ]);
    expect(re.toString()).toBe('/\\22\\169/');
  });

  it('does not convert class ranges other than included in 0-9, a-z or A-Z', () => {
    let re = transform(/[\u005a-\u0061]/, [
      charCodeToSimpleChar,
    ]);
    expect(re.toString()).toBe('/[\\u005a-\\u0061]/');

    re = transform('/[\\u{5a}-\\u{61}]/u', [
      charCodeToSimpleChar,
    ]);
    expect(re.toString()).toBe('/[\\u{5a}-\\u{61}]/u');

    re = transform(/[\x5a-\x61]/, [
      charCodeToSimpleChar,
    ]);
    expect(re.toString()).toBe('/[\\x5a-\\x61]/');

    re = transform(/[\054-\061]/, [
      charCodeToSimpleChar,
    ]);
    expect(re.toString()).toBe('/[\\054-\\061]/');

    re = transform(/[\90-\97]/, [
      charCodeToSimpleChar,
    ]);
    expect(re.toString()).toBe('/[\\90-\\97]/');
  });

  it('escapes converted chars when needed', () => {
    let re = transform(/[\055]/, [
      charCodeToSimpleChar,
    ]);
    expect(re.toString()).toBe('/[\\-]/');

    re = transform('/[\\u005d\\u{5c}\\x5e]/u', [
      charCodeToSimpleChar,
    ]);
    expect(re.toString()).toBe('/[\\]\\\\\\^]/u');

    re = transform(/\052\43\077\47\125/, [
      charCodeToSimpleChar,
    ]);
    expect(re.toString()).toBe('/\\*\\+\\?\\/\\}/');

    re = transform(
      '/\\u005b\\u{28}\\x29\\u005e\\u{24}\\x2e\\u005c\\u{7c}\\x7b/u',
      [
        charCodeToSimpleChar,
      ]
    );
    expect(re.toString()).toBe('/\\[\\(\\)\\^\\$\\.\\\\\\|\\{/u');
  });

});