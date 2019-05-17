/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const parser = require('..');

const {
  getCanonicalValue,

  BINARY_PROP_NAMES_TO_ALIASES,
  BINARY_ALIASES_TO_PROP_NAMES,

  GENERAL_CATEGORY_VALUE_TO_ALIASES,
  GENERAL_CATEGORY_VALUE_ALIASES_TO_VALUES,

  SCRIPT_VALUE_TO_ALIASES,
  SCRIPT_VALUE_ALIASES_TO_VALUE,
} = require('../unicode/parser-unicode-properties');

describe('parser-unicode-properties', () => {
  it('general-category', () => {
    expect(parser.parse('/\\p{General_Category=Letter}/u').body).toEqual({
      type: 'UnicodeProperty',
      name: 'General_Category',
      value: 'Letter',
      negative: false,
      shorthand: false,
      binary: false,
      canonicalName: 'General_Category',
      canonicalValue: 'Letter',
    });
  });

  it('shorthand', () => {
    expect(parser.parse('/\\p{Letter}/u').body).toEqual({
      type: 'UnicodeProperty',
      name: 'General_Category',
      value: 'Letter',
      negative: false,
      shorthand: true,
      binary: false,
      canonicalName: 'General_Category',
      canonicalValue: 'Letter',
    });
  });

  it('negative', () => {
    expect(parser.parse('/\\P{Letter}/u').body).toEqual({
      type: 'UnicodeProperty',
      name: 'General_Category',
      value: 'Letter',
      negative: true,
      shorthand: true,
      binary: false,
      canonicalName: 'General_Category',
      canonicalValue: 'Letter',
    });
  });

  it('binary', () => {
    expect(parser.parse('/\\p{Hex_Digit}/u').body).toEqual({
      type: 'UnicodeProperty',
      name: 'Hex_Digit',
      value: 'Hex_Digit',
      negative: false,
      shorthand: false,
      binary: true,
      canonicalName: 'Hex_Digit',
      canonicalValue: 'Hex_Digit',
    });
  });

  it('script', () => {
    expect(parser.parse('/\\p{Script=Cyrillic}/u').body).toEqual({
      type: 'UnicodeProperty',
      name: 'Script',
      value: 'Cyrillic',
      negative: false,
      shorthand: false,
      binary: false,
      canonicalName: 'Script',
      canonicalValue: 'Cyrillic',
    });
  });

  it('script-extensions', () => {
    expect(parser.parse('/\\p{Script_Extensions=Cyrillic}/u').body).toEqual({
      type: 'UnicodeProperty',
      name: 'Script_Extensions',
      value: 'Cyrillic',
      negative: false,
      shorthand: false,
      binary: false,
      canonicalName: 'Script_Extensions',
      canonicalValue: 'Cyrillic',
    });
  });

  it('auto-general-category', () => {
    for (const value in GENERAL_CATEGORY_VALUE_TO_ALIASES) {
      expect(parser.parse(`/\\p{General_Category=${value}}/u`).body).toEqual({
        type: 'UnicodeProperty',
        name: 'General_Category',
        value,
        negative: false,
        shorthand: false,
        binary: false,
        canonicalName: 'General_Category',
        canonicalValue: value,
      });

      expect(parser.parse(`/\\p{gc=${value}}/u`).body).toEqual({
        type: 'UnicodeProperty',
        name: 'gc',
        value,
        negative: false,
        shorthand: false,
        binary: false,
        canonicalName: 'General_Category',
        canonicalValue: value,
      });
    }

    for (const value in GENERAL_CATEGORY_VALUE_ALIASES_TO_VALUES) {
      expect(parser.parse(`/\\p{General_Category=${value}}/u`).body).toEqual({
        type: 'UnicodeProperty',
        name: 'General_Category',
        value,
        negative: false,
        shorthand: false,
        binary: false,
        canonicalName: 'General_Category',
        canonicalValue: getCanonicalValue(value),
      });

      expect(parser.parse(`/\\p{gc=${value}}/u`).body).toEqual({
        type: 'UnicodeProperty',
        name: 'gc',
        value,
        negative: false,
        shorthand: false,
        binary: false,
        canonicalName: 'General_Category',
        canonicalValue: getCanonicalValue(value),
      });
    }
  });

  it('auto-script', () => {
    for (const value in SCRIPT_VALUE_TO_ALIASES) {
      expect(parser.parse(`/\\p{Script=${value}}/u`).body).toEqual({
        type: 'UnicodeProperty',
        name: 'Script',
        value,
        negative: false,
        shorthand: false,
        binary: false,
        canonicalName: 'Script',
        canonicalValue: value,
      });

      expect(parser.parse(`/\\p{sc=${value}}/u`).body).toEqual({
        type: 'UnicodeProperty',
        name: 'sc',
        value,
        negative: false,
        shorthand: false,
        binary: false,
        canonicalName: 'Script',
        canonicalValue: value,
      });
    }

    for (const value in SCRIPT_VALUE_ALIASES_TO_VALUE) {
      expect(parser.parse(`/\\p{Script=${value}}/u`).body).toEqual({
        type: 'UnicodeProperty',
        name: 'Script',
        value,
        negative: false,
        shorthand: false,
        binary: false,
        canonicalName: 'Script',
        canonicalValue: getCanonicalValue(value),
      });

      expect(parser.parse(`/\\p{sc=${value}}/u`).body).toEqual({
        type: 'UnicodeProperty',
        name: 'sc',
        value,
        negative: false,
        shorthand: false,
        binary: false,
        canonicalName: 'Script',
        canonicalValue: getCanonicalValue(value),
      });
    }
  });

  it('auto-script-extensions', () => {
    for (const value in SCRIPT_VALUE_TO_ALIASES) {
      expect(parser.parse(`/\\p{Script_Extensions=${value}}/u`).body).toEqual({
        type: 'UnicodeProperty',
        name: 'Script_Extensions',
        value,
        negative: false,
        shorthand: false,
        binary: false,
        canonicalName: 'Script_Extensions',
        canonicalValue: value,
      });

      expect(parser.parse(`/\\p{scx=${value}}/u`).body).toEqual({
        type: 'UnicodeProperty',
        name: 'scx',
        value,
        negative: false,
        shorthand: false,
        binary: false,
        canonicalName: 'Script_Extensions',
        canonicalValue: value,
      });
    }

    for (const value in SCRIPT_VALUE_ALIASES_TO_VALUE) {
      expect(parser.parse(`/\\p{Script_Extensions=${value}}/u`).body).toEqual({
        type: 'UnicodeProperty',
        name: 'Script_Extensions',
        value,
        negative: false,
        shorthand: false,
        binary: false,
        canonicalName: 'Script_Extensions',
        canonicalValue: getCanonicalValue(value),
      });

      expect(parser.parse(`/\\p{scx=${value}}/u`).body).toEqual({
        type: 'UnicodeProperty',
        name: 'scx',
        value,
        negative: false,
        shorthand: false,
        binary: false,
        canonicalName: 'Script_Extensions',
        canonicalValue: getCanonicalValue(value),
      });
    }
  });

  it('auto-shorthand', () => {
    for (const value in GENERAL_CATEGORY_VALUE_TO_ALIASES) {
      expect(parser.parse(`/\\p{${value}}/u`).body).toEqual({
        type: 'UnicodeProperty',
        name: 'General_Category',
        value,
        negative: false,
        shorthand: true,
        binary: false,
        canonicalName: 'General_Category',
        canonicalValue: value,
      });
    }

    for (const value in GENERAL_CATEGORY_VALUE_ALIASES_TO_VALUES) {
      expect(parser.parse(`/\\p{${value}}/u`).body).toEqual({
        type: 'UnicodeProperty',
        name: 'General_Category',
        value,
        negative: false,
        shorthand: true,
        binary: false,
        canonicalName: 'General_Category',
        canonicalValue: getCanonicalValue(value),
      });
    }
  });

  it('auto-binary', () => {
    for (const value in BINARY_PROP_NAMES_TO_ALIASES) {
      expect(parser.parse(`/\\p{${value}}/u`).body).toEqual({
        type: 'UnicodeProperty',
        name: value,
        value,
        negative: false,
        shorthand: false,
        binary: true,
        canonicalName: value,
        canonicalValue: value,
      });
    }

    for (const value in BINARY_ALIASES_TO_PROP_NAMES) {
      expect(parser.parse(`/\\p{${value}}/u`).body).toEqual({
        type: 'UnicodeProperty',
        name: value,
        value,
        negative: false,
        shorthand: false,
        binary: true,
        canonicalName: getCanonicalValue(value),
        canonicalValue: getCanonicalValue(value),
      });
    }
  });
});
