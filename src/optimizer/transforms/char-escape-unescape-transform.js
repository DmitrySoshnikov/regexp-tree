/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

/**
 * A regexp-tree plugin to remove unnecessary escape.
 *
 * \e -> e
 *
 * [\(] -> [(]
 */
module.exports = {
  Char(path) {
    const {node} = path;

    if (!node.escaped) {
      return;
    }

    if (shouldUnescape(path)) {
      delete node.escaped;
    }
  }
};

function shouldUnescape(path) {
  const {node: {value}, parent} = path;

  // In char class (, etc are allowed.
  if (parent.type !== 'CharacterClass') {
    return !preservesEscape(value);
  }

  return !preservesInCharClass(value);
}

/**
 * \], \\, \-
 *
 * Note: \- always preserved to avoid `[a\-z]` turning into `[a-z]`.
 * TODO: more sophisticated analisys.
 */
function preservesInCharClass(value) {
  return /[\]\\\\-]/.test(value);
}

// Note: \{ and \} are always preserved to avoid `a\{2\}` turning
// into `a{2}`. TODO: more sophisticated analisys.

function preservesEscape(value) {
  return /[*\[\]()+?^$.\/\\\{\}\|]/.test(value);
}