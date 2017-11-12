/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

/**
 * A regexp-tree plugin to remove unnecessary groups.
 *
 * /(?:a)/ -> /a/
 */

module.exports = {
  Group(path) {
    const {node, parent} = path;
    const childPath = path.getChild();

    if (node.capturing) {
      return;
    }

    if (
      childPath &&
      childPath.node.type === 'Disjunction' &&
      parent.type !== 'RegExp'
    ) {
      return;
    }

    if (
      parent.type === 'Repetition' &&
      childPath.node.type !== 'Char' &&
      childPath.node.type !== 'CharacterClass'
    ) {
      return;
    }

    path.replace(childPath.node);
  }
};