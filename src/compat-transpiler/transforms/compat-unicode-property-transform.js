/**
 * The MIT License (MIT)
 * Copyright (c) 2019-present Junliang Huang <jlhwung@gmail.com>
 */

'use strict';

/**
 * A regexp-tree plugin to translate `/\p{ASCII_Hex_Digit}/u` to `/[0-9A-Fa-f]/`.
 *
 */

module.exports = {
  shouldRun(ast) {
    return ast.flags.includes('u');
  },
  CharacterClass() {
    //todo: check unicode property inside character class, replace subarray of CharacterClass expression
  },
  UnicodeProperty() {
    //todo: replace UnicodeProperty by CharacterClass
  },
};
