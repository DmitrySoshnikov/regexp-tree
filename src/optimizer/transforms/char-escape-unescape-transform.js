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
  const {node, node: {value}, parent} = path;

  // In char class (, etc are allowed.
  if (parent.type !== 'CharacterClass') {
    return !preservesEscape(value);
  }

  // In char class should escape \]
  return value !== ']';
}

function preservesEscape(value) {
  return /[*\[()+?^$]/.test(value);
}