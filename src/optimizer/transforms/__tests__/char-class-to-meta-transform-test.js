/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const charClassToMeta = require('../char-class-to-meta-transform');

describe('char-class-to-meta', () => {
  it('replaces number ranges', () => {
    const re = transform(/[0-9$]/, [charClassToMeta]);
    expect(re.toString()).toBe('/[\\d$]/');
  });

  it('replaces word ranges', () => {
    const re = transform(/[0-9a-zA-Z_$]/, [charClassToMeta]);
    expect(re.toString()).toBe('/[\\w$]/');
  });

  it('replaces word ranges when regexp has i flag', () => {
    const re = transform(/[0-9a-z_$]/i, [charClassToMeta]);
    expect(re.toString()).toBe('/[\\w$]/i');
  });

  it('replaces word ranges when regexp has i and u flags', () => {
    const re = transform('/[\\da-zA-Z_\\u017F\\u212A$]/iu', [charClassToMeta]);
    expect(re.toString()).toBe('/[\\w$]/iu');
  });

  it('whitespace ranges', () => {
    const re = transform(
      /[ \f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/,
      [charClassToMeta]
    );
    expect(re.toString()).toBe('/[\\s]/');
  });

  it('whitespace ranges order do not matters', () => {
    const re = transform(
      /[\f \n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/,
      [charClassToMeta]
    );
    expect(re.toString()).toBe('/[\\s]/');
  });

  it('whitespace ranges duplicated chars', () => {
    const re = transform(
      /[ \f\n\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/,
      [charClassToMeta]
    );
    expect(re.toString()).toBe('/[\\s]/');
  });

  it('whitespace ranges missing chars', () => {
    const re = transform(
      /[ \n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/,
      [charClassToMeta]
    );
    expect(re.toString()).toBe(
      '/[ \\n\\r\\t\\v\\u00a0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff]/'
    );
  });
});
