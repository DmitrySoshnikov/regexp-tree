/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const compatTranspiler = require('..');

describe('compat-transpiler-integration-test', () => {

  it('applies all transforms', () => {
    const original = '/a.b(?<name>x)/s';
    const compat = /a[\0-\uFFFF]b(x)/;

    const result = compatTranspiler.transform(original);

    expect(result.toString())
      .toBe(compat.toString());

    expect(result.getExtra()).toEqual({
      // This transform collected group names, and their indices.
      namedCapturingGroups: {
        name: 1,
      },
    })
  });

  it('applies whitelist only', () => {
    const original = '/a.b(?<name>x)/s';
    const compat = '/a[\\0-\\uFFFF]b(?<name>x)/';

    expect(compatTranspiler.transform(original, ['dotAll']).toString())
      .toBe(compat);
  });
});