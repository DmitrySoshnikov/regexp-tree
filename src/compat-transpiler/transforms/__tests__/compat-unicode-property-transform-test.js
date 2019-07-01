'use strict';

const {transform} = require('../../../transform');
const compatUnicodePropertyTransform = require('../compat-unicode-property-transform');

describe('compat-unicode-property-transform', () => {
  it('should support binary property: \\p{ASCII_Hex_Digit}', () => {
    const re = transform('/\\p{ASCII_Hex_Digit}/u', [
      compatUnicodePropertyTransform,
    ]);
    expect(re.toString()).toBe(
      '/[\\u0030-\\u0039\\u0041-\\u0046\\u0061-\\u0066]/u'
    );
  });

  it('should support binary property negation: \\P{ASCII_Hex_Digit}', () => {
    const re = transform('/\\P{ASCII_Hex_Digit}/u', [
      compatUnicodePropertyTransform,
    ]);
    expect(re.toString()).toBe(
      '/[\\u0000-\\u002F\\u003A-\\u0040\\u0047-\\u0060\\u0067-\\u{10FFFF}]/u'
    );
  });

  it('should support script property', () => {
    const re = transform('/\\p{Script=Devanagari}/u', [
      compatUnicodePropertyTransform,
    ]);
    expect(re.toString()).toBe(
      '/[\\u0900-\\u0950\\u0955-\\u0963\\u0966-\\u097F\\uA8E0-\\uA8FF]/u'
    );
  });

  it('should support single property in character class', () => {
    const re = transform('/[\\p{ASCII_Hex_Digit}]/u', [
      compatUnicodePropertyTransform,
    ]);
    expect(re.toString()).toBe(
      '/[\\u0030-\\u0039\\u0041-\\u0046\\u0061-\\u0066]/u'
    );
  });

  it('should support multiple property in character class', () => {
    const re = transform('/[\\p{ASCII}\\p{ASCII_Hex_Digit}]/u', [
      compatUnicodePropertyTransform,
    ]);
    expect(re.toString()).toBe(
      '/[\\u0000-\\u007F\\u0030-\\u0039\\u0041-\\u0046\\u0061-\\u0066]/u'
    );
  });

  it('should not run when no "u" flag is inposed', () => {
    const re = transform('/\\p{ASCII_Hex_Digit}/', [
      compatUnicodePropertyTransform,
    ]);
    expect(re.toString()).toBe('/\\p{ASCII_Hex_Digit}/');
  });
});
