/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const NFA = require('./nfa/nfa');
const DFA = require('./dfa/dfa');

module.exports = {

  /**
   * Export NFA and DFA classes.
   */
  NFA,
  DFA,

  /**
   * Builds an NFA for the passed regexp.
   *
   * @param string | AST | RegExp:
   *
   *   a regular expression in different representations: a string,
   *   a RegExp object, or an AST.
   */
  toNFA(regexp) {
    throw new Error('Not implemented yet.');
  },

  /**
   * Builds DFA for the passed regexp.
   *
   * @param string | AST | RegExp:
   *
   *   a regular expression in different representations: a string,
   *   a RegExp object, or an AST.
   */
  toDFA(regexp) {
    throw new Error('Not implemented yet.');
  },

  /**
   * Returns true if regexp accepts the string.
   */
  test(regexp, string) {
    throw new Error('Not implemented yet.');
  },
};