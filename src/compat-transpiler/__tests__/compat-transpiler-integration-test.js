/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const compatTranspiler = require('..');

describe('compat-transpiler-integration-test', () => {

  it('applies all transforms', () => {
    const original = '/a.b/s';
    const compat = /a[\0-\uFFFF]b/;

    expect(compatTranspiler.transform(original).toString())
      .toBe(compat.toString());
  });

  it('applies whitelist only', () => {
    const original = '/a.b/s';
    const compat = /a[\0-\uFFFF]b/;

    expect(compatTranspiler.transform(original, ['dotAll']).toString())
      .toBe(compat.toString());
  });
});