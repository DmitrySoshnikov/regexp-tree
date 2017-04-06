/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

/**
 * A regexp-tree plugin to replace `aa*` to `a+`.
 */
module.exports = {

  Repetition(path) {
    const {node, parent} = path;

    if (
      node.quantifier.kind !== '*' ||
      parent.type !== 'Alternative' ||
      !path.index
    ) {
      return;
    }

    const previousSibling = path.getPreviousSibling();

    if (!previousSibling) {
      return;
    }

    const previousNode = previousSibling.node;

    // TODO: expose source text of nodes instead of ugly `JSON.stringify` here
    // https://github.com/DmitrySoshnikov/regexp-tree/issues/36
    const previousNodeString = JSON.stringify(previousNode);
    const expressionString = JSON.stringify(node.expression);

    if (previousNodeString !== expressionString) {
      return;
    }

    // Remove previous symbol. TODO, operate on NodePath for previous siblings.
    previousSibling.remove();

    // Change quantifier.
    node.quantifier.kind = '+';
  }
};