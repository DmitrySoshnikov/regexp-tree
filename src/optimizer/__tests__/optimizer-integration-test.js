/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const optimizer = require('..');

describe('optimizer-integration-test', () => {

  it('optimizes a regexp', () => {
    const original = /[0-90-9a-zA-Z_$][0-9a-zA-Za-z_$]*/;
    const optimized = /[\w$]+/;

    expect(optimizer.optimize(original).toString())
      .toBe(optimized.toString());
  });

  it('to single char', () => {
    const original = /[0-90-9a-zA-Z_][0-9a-zA-Za-z_]*/;
    const optimized = /\w+/;

    expect(optimizer.optimize(original).toString())
      .toBe(optimized.toString());
  });

});