/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

/**
 * The `RegExpTree` class provides runtime support for `compat-transpiler`
 * module from `regexp-tree`.
 *
 * E.g. it tracks names of the capturing groups, in order to access the
 * names on the matched result.
 *
 * It's a thin-wrapper on top of original regexp.
 */
class RegExpTree {
  /**
   * Initializes a `RegExpTree` instance.
   *
   * @param RegExp - a regular expression
   *
   * @param Object state:
   *
   *   An extra state which may store any related to transformation
   *   data, for example, names of the groups.
   *
   *   - flags - original flags
   *   - groups - names of the groups, and their indices
   *   - source - original source
   */
  constructor(re, {
    flags,
    groups,
    source,
  }) {
    this._re = re;
    this._groups = groups;

    // Original props.
    this.flags = flags;
    this.source = source || re.source;
    this.dotAll = flags.includes('s');

    // Inherited directly from `re`.
    this.global = re.global;
    this.ignoreCase = re.ignoreCase;
    this.multiline = re.multiline;
    this.sticky = re.sticky;
    this.unicode = re.unicode;
  }

  /**
   * Facade wrapper for RegExp `test` method.
   */
  test(string) {
    return this._re.test(string);
  }

  /**
   * Facade wrapper for RegExp `compile` method.
   */
  compile(string) {
    return this._re.compile(string);
  }

  /**
   * Facade wrapper for RegExp `toString` method.
   */
  toString(string) {
    if (!this._toStringResult) {
      this._toStringResult = `/${this.source}/${this.flags}`;
    }
    return this._toStringResult;
  }

  /**
   * Facade wrapper for RegExp `exec` method.
   */
  exec(string) {
    const result = this._re.exec(string);

    if (!this._groups) {
      return result;
    }

    result.groups = {};

    for (const group in this._groups) {
      const groupNumber = this._groups[group];
      result.groups[group] = result[groupNumber];
    }

    return result;
  }
}

module.exports = {
  RegExpTree,
};