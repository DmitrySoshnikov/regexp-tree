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

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());
  });

  it('preserves dash and caret', () => {
    let original = '/[^a-zа-яё -]+gi/';
    let optimized = '/[^ a-zа-яё-]+gi/';

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());

    original = '/[0-9\\-a-z]/';
    optimized = '/[\\da-z\\-]/';

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());

    original = /^[a-z][a-z0-9\-]{5,29}$/;
    optimized = /^[a-z][\da-z\-]{5,29}$/;

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());

    original = /[-\da-z]/;
    optimized = /[\da-z-]/;

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());

    original = /[-0^]/;
    optimized = /[0^-]/;

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());

    original = /[0-^]/;
    optimized = /[0-^]/;

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());

    original = /[0^-]/;
    optimized = /[0^-]/;

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());

    original = /[^-]/;
    optimized = /[^-]/;

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());

    // TODO: Fix this
    original = /[-^]/;
    optimized = /[^-]/;

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());
  });

  it('handles a named capturing group', () => {
    const original = '/(?<any>.*)/';
    const optimized = '/(?<any>.*)/';

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());
  });

  it('to single char', () => {
    const original = /[0-90-9a-zA-Z_][0-9a-zA-Za-z_]*/;
    const optimized = /\w+/;

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());
  });

  it('preserve escape', () => {
    const original = /^[\^\*\$\(\)]\^\*\$\(\)\.\[\/\\$/;
    const optimized = /^[$()*^]\^\*\$\(\)\.\[\/\\$/;

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());
  });

  it('whitespace', () => {
    const original = /[ \f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/;
    const optimized = /\s+/;

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());
  });

  it('whitespace group', () => {
    const original = /[ \f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff\]]/g;
    const optimized = /[\s\]]/g;

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());
  });

  it('quantifier {1,}', () => {
    const original = /[a-z0-9A-Za-z_]{1,}/;
    const optimized = /\w+/;

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());
  });

  it('quantifier {1}', () => {
    const original = /[a-z0-9A-Za-z_]{1}/;
    const optimized = /\w/;

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());
  });

  it('quantifier {3,3}', () => {
    const original = /[a-z0-9A-Za-z_]{3,3}/;
    const optimized = /\w{3}/;

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());
  });

  it('quantifier other', () => {
    const original = /[a-z0-9A-Za-z_]{1,3}/;
    const optimized = /\w{1,3}/;

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());
  });

  it('finds the best optimization', () => {
    const original = /a|a/;
    const optimized = /a/;

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());
  });

  it('applies whitelist only', () => {
    const original = '/(?:[a])/';
    const optimized = '/[a]/';

    expect(
      optimizer.optimize(original, {whitelist: ['ungroup']}).toString()
    ).toBe(optimized.toString());
  });

  it('sorts characters', () => {
    const original = /[åä]/;
    const optimized = /[äå]/;

    expect(optimizer.optimize(original).toString()).toBe(optimized.toString());
  });

  it('preserves character order when blacklisted charClassClassrangesMerge', () => {
    const original = /[åä]/;
    const optimized = /[åä]/;

    expect(
      optimizer
        .optimize(original, {blacklist: ['charClassClassrangesMerge']})
        .toString()
    ).toBe(optimized.toString());
  });
});
