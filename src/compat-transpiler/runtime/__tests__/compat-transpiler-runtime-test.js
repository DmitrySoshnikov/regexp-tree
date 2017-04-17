/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {RegExpTree} = require('..');

describe('compat-transpiler-runtime', () => {

  it('named capturing groups', () => {
    const originalSource = '(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})';
    const originalFlags = 'gsu';

    const originalRe = `/${originalSource}/${originalFlags}`;

    // This is what regexp-tree produces.
    const compat = /(\d{4})-(\d{2})-(\d{2})/gu;

    const re = new RegExpTree(compat, {
      flags: originalFlags,
      source: originalSource,
      groups: {
        year: 1,
        month: 2,
        day: 3,
      },
    });

    expect(re.flags).toBe(originalFlags);
    expect(re.source).toBe(originalSource);

    expect(re.toString()).toBe(originalRe);

    // Flag properties.
    expect(re.dotAll).toBe(true);
    expect(re.global).toBe(true);
    expect(re.ignoreCase).toBe(false);
    expect(re.multiline).toBe(false);
    expect(re.sticky).toBe(false);
    expect(re.unicode).toBe(true);

    // Testing runtime.
    const string = '2017-04-14';
    let result = re.exec(string);

    expect(result).not.toBe(null);
    expect(result[0]).toBe(string);

    expect(result[1]).toBe('2017');
    expect(result[2]).toBe('04');
    expect(result[3]).toBe('14');

    // Named groups.
    expect(result.groups).not.toBe(undefined);

    expect(result.groups.year).toBe(result[1]);
    expect(result.groups.month).toBe(result[2]);
    expect(result.groups.day).toBe(result[3]);

    // null result
    result = re.exec('foo-bar');
    expect(result).toBe(null);
  });

});