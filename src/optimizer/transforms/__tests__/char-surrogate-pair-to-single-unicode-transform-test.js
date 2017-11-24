/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const charSurrogatePairToSingleUnicode = require('../char-surrogate-pair-to-single-unicode-transform');

describe('\\ud83d\\ude80 -> \\u{1f680}', () => {

  it('\\ud83d\\ude80 -> \\u{1f680}', () => {
    const re = transform(/\ud83d\ude80/u, [
      charSurrogatePairToSingleUnicode
    ]);
    expect(re.toString()).toBe('/\\u{1f680}/u');
  });

  it('does not run when unicode flag is absent', () => {
    const re = transform(/\ud83d\ude80/, [
      charSurrogatePairToSingleUnicode
    ]);
    expect(re.toString()).toBe('/\\ud83d\\ude80/');
  });

});