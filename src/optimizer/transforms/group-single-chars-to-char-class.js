/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

/**
 * A regexp-tree plugin to replace single char group disjunction to char group
 *
 * (a|b|c) -> ([abc])
 * (?:a|b|c) -> [abc]
 */
module.exports = {
  Group(path) {
    const {node} = path;

    const charset = new Map();

    if (
      !shouldProcessExpressionCharset(node.expression, charset) ||
      !charset.size
    ) {
      return;
    }

    const characterClass = {
      type: 'CharacterClass',
      expressions: Array.from(charset.values())
    };

    if (node.capturing) {
      node.expression = characterClass;
    } else {
      path.replace(characterClass);
    }
  }
}

function shouldProcessExpressionCharset(expression, charset) {
  const {type} = expression;

  if (type === 'Disjunction') {
    const {left, right} = expression;

    return shouldProcessExpressionCharset(left, charset)
      && shouldProcessExpressionCharset(right, charset);
  } else if (type === 'Char') {
    const {value} = expression;

    charset.set(value, expression);

    return true;
  }

  return false;
}