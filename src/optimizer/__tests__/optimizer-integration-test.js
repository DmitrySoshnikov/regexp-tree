/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const optimizer = require('..');

describe('optimizer-integration-test', () => {

  it('optimizes a regexp', () => {
    const original = /[0-9$][0-9$]*/;
    const optimized = /[\d$]+/;

    expect(optimizer.optimize(original).toString())
      .toBe(optimized.toString());
  });

});