/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

/**
 * A regexp-tree plugin to merge quantifiers
 *
 * a{2}a+ -> a{3,}
 * a{2}a{3} -> a{5}
 * a{1,2}a{0,3} -> a{1,5}
 */
module.exports = {

  Repetition(path) {
    const {node, parent} = path;

    if (
      parent.type !== 'Alternative' ||
      !path.index
    ) {
      return;
    }

    const previousSibling = path.getPreviousSibling();

    if (!previousSibling) {
      return;
    }

    if (previousSibling.node.type === 'Repetition') {
      if (!previousSibling.getChild().hasEqualSource(path.getChild())) {
        return;
      }

      const quant = node.quantifier;
      const prevQuant = previousSibling.node.quantifier;

      if (isForward(path)) {
        // r{n1}r{n2,m2} -> r{n1+n2,n1+m2}
        // r{n1}r{n2,m2}? -> r{n1+n2,n1+m2}?
        // r{n1}?r{n2,m2} -> r{n1+n2,n1+m2}
        // r{n1}?r{n2,m2}? -> r{n1+n2,n1+m2}?
        if (isForced(prevQuant)) {
          mergeQuantifiers(node, previousSibling, quant.greedy);
          return;
        }
        // r{n1,m1}r{0,m2} -> r{n1,m1+m2}
        if (prevQuant.greedy && quant.greedy && isFromZero(quant)) {
          mergeQuantifiers(node, previousSibling, true);
          return;
        }
      } else {
        // r{n1,m1}r{n2} -> r{n1+n2,m1+n2}
        // r{n1,m1}?r{n2} -> r{n1+n2,m1+n2}?
        // r{n1,m1}r{n2}? -> r{n1+n2,m1+n2}
        // r{n1,m1}?r{n2}? -> r{n1+n2,m1+n2}?
        if (isForced(quant)) {
          mergeQuantifiers(node, previousSibling, prevQuant.greedy);
          return;
        }
        // r{0,m1}r{n2,m2} -> r{n2,m1+m2}
        if (prevQuant.greedy && quant.greedy && isFromZero(prevQuant)) {
          mergeQuantifiers(node, previousSibling, true);
          return;
        }
      };
    }  
  }
};

/**
 * Extracts the from and to values of a quantifier.
 */
function extractFromTo(quantifier) {
  let from, to;
  if (quantifier.kind === '*') {
    from = 0;
  } else if (quantifier.kind === '+') {
    from = 1;
  } else if (quantifier.kind === '?') {
    from = 0;
    to = 1;
  } else {
    from = quantifier.from;
    if (quantifier.to) {
      to = quantifier.to;
    }
  }
  return {from, to};
}

/**
 * A quantifier is forced if its minimum number of iterations
 * is equal to its maximum (e.g. a{3}).
 */
function isForced(quantifier) {
  let {from,to} = extractFromTo(quantifier);
  return (from == to);
}

/**
 * A quantifier is FromZero if it has no
 * minimum iterations.
 */
function isFromZero(quantifier) {
  let {from,to} = extractFromTo(quantifier);
  return (from == 0);
}

/**
 * Merges two quantifier nodes.
 * Adds the from and to values into the current node, 
 * and deletes the previous node.
 */
function mergeQuantifiers(node, previous, greedy) {
  let {
    from: prevFrom,
    to: prevTo
  } = extractFromTo(previous.node.quantifier);
  let {
    from: nodeFrom,
    to: nodeTo
  } = extractFromTo(node.quantifier);

  node.quantifier.kind = 'Range';
  if (prevTo && nodeTo) {
        node.quantifier.to = prevTo + nodeTo;
  } else {
    delete node.quantifier.to;
  }
  node.quantifier.from = prevFrom + nodeFrom;
  node.quantifier.greedy = greedy;
  previous.remove();
  return;
}

/**
   * Indicates if the matching direction of a path is forward.
   *
   * This means that the deepest lookaround of the path is not a
   * lookbehind. This ensures that the current node will be
   * matched in the forward direction.
   */
function isForward(path) {
    let parent = path.parentPath;

    if (!parent || parent.node.kind == 'Lookahead') {
      return true;
    }

    return (parent.node.kind !== 'Lookbehind' && isForward(parent));
}