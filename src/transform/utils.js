/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

/**
 * Flattens a nested disjunction node to a list.
 *
 * /a|b|c|d/
 *
 * {{{a, b}, c}, d} -> [a, b, c, d]
 */
function disjunctionToList(node) {
  if (node.type !== 'Disjunction') {
    throw new TypeError(`Expected "Disjunction" node, got "${node.type}"`);
  }

  const list = [];

  if (node.left.type === 'Disjunction') {
    list.push(...disjunctionToList(node.left), node.right);
  } else {
    list.push(node.left, node.right);
  }

  return list;
}

/**
 * Builds a nested disjunction node from a list.
 *
 * /a|b|c|d/
 *
 * [a, b, c, d] -> {{{a, b}, c}, d}
 */
function listToDisjunction(list) {
  return list.reduce((left, right) => {
    return {
      type: 'Disjunction',
      left,
      right,
    };
  });
}

module.exports = {
  disjunctionToList,
  listToDisjunction,
};