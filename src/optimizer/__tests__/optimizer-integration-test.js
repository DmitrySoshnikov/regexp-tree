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

  it('preserve escape', () => {
    const original = /^[\^\*\$\(\)]\^\*\$\(\)$/;
    const optimized = /^[^*$()]\^\*\$\(\)$/;

    expect(optimizer.optimize(original).toString())
      .toBe(optimized.toString());
  });

  it('whitespace', () => {
    const original = /[ \n\r\t\f]+/;
    const optimized = /\s+/;

    expect(optimizer.optimize(original).toString())
      .toBe(optimized.toString());
  });

  it('quantifier {1,}', () => {
    const original = /[a-z0-9A-Za-z_]{1,}/;
    const optimized = /\w+/;

    expect(optimizer.optimize(original).toString())
      .toBe(optimized.toString());
  });

  it('quantifier {1}', () => {
    const original = /[a-z0-9A-Za-z_]{1}/;
    const optimized = /\w/;

    expect(optimizer.optimize(original).toString())
      .toBe(optimized.toString());
  });

  it('quantifier {3,3}', () => {
    const original = /[a-z0-9A-Za-z_]{3,3}/;
    const optimized = /\w{3}/;

    expect(optimizer.optimize(original).toString())
      .toBe(optimized.toString());
  });

  it('quantifier other', () => {
    const original = /[a-z0-9A-Za-z_]{1,3}/;
    const optimized = /\w{1,3}/;

    expect(optimizer.optimize(original).toString())
      .toBe(optimized.toString());
  });

});