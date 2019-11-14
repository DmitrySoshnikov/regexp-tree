/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

/**
 * A regexp-tree plugin to replace single char group disjunction to char group
 *
 * a|b|c -> [abc]
 * [12]|3|4 -> [1234]
 * (a|b|c) -> ([abc])
 * (?:a|b|c) -> [abc]
 */
module.exports = {
  Disjunction(path) {
    const {node, parent} = path;

    if (!handlers[parent.type]) {
      return;
    }

    const charset = new Map();

    if (!shouldProcess(node, charset) || !charset.size) {
      return;
    }

    const characterClass = {
      type: 'CharacterClass',
      expressions: Array.from(charset.keys())
        .sort()
        .map(key => charset.get(key)),
    };

    handlers[parent.type](path.getParent(), characterClass);
  },
};

const handlers = {
  RegExp(path, characterClass) {
    const {node} = path;

    node.body = characterClass;
  },

  Group(path, characterClass) {
    const {node} = path;

    if (node.capturing) {
      node.expression = characterClass;
    } else {
      path.replace(characterClass);
    }
  },
};

function shouldProcess(expression, charset) {
  if (!expression) {
    // Abort on empty disjunction part
    return false;
  }

  const {type} = expression;

  if (type === 'Disjunction') {
    const {left, right} = expression;

    return shouldProcess(left, charset) && shouldProcess(right, charset);
  } else if (type === 'Char') {
    const {value} = expression;

    charset.set(value, expression);

    return true;
  } else if (type === 'CharacterClass' && !expression.negative) {
    return expression.expressions.every(expression =>
      shouldProcess(expression, charset)
    );
  }

  return false;
}
