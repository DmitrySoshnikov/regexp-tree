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

    if (node.capturing || !childPath) {
      return;
    }

    // Don't optimize /a(?:b|c)/ to /ab|c/
    // but /(?:b|c)/ to /b|c/ is ok
    if (
      childPath.node.type === 'Disjunction' &&
      parent.type !== 'RegExp'
    ) {
      return;
    }

    // Don't optimize /(?:ab)+/ to /ab+/
    // but /(?:a)+/ to /a+/ is ok
    // and /(?:[a-d])+/ to /[a-d]+/ is ok too
    if (
      parent.type === 'Repetition' &&
      childPath.node.type !== 'Char' &&
      childPath.node.type !== 'CharacterClass'
    ) {
      return;
    }

    if (childPath.node.type === 'Alternative') {
      const parentPath = path.getParent();
      if (parentPath.node.type === 'Alternative') {

        // /abc(?:def)ghi/ When (?:def) is ungrouped its content must be merged with parent alternative

        parentPath.replace({
          type: 'Alternative',
          expressions: [
            ...parent.expressions.slice(0, path.index),
            ...childPath.node.expressions,
            ...parent.expressions.slice(path.index + 1)
          ]
        });
      }

    } else {
      path.replace(childPath.node);
    }
  }
};