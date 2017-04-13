/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const compatDotAllSTransform = require('../compat-dotall-s-transform');

describe('compat-dotall-s-transform', () => {

  it('simple', () => {
    const re = transform('/a.b/s', [
      compatDotAllSTransform,
    ]);
    expect(re.toString()).toBe(/a[\0-\uFFFF]b/.toString());
  });

  it('with u flag', () => {
    const re = transform('/a.b/su', [
      compatDotAllSTransform,
    ]);
    expect(re.toString()).toBe(/a[\0-\u{10FFFF}]b/u.toString());
  });

  it('no s', () => {
    const re = transform(/a.b/u, [
      compatDotAllSTransform,
    ]);
    expect(re.toString()).toBe(/a.b/u.toString());
  });

});