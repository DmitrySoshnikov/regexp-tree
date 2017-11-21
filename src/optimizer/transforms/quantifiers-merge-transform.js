/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {increaseQuantifierByOne} = require('../../transform/utils');

/**
 * A regexp-tree plugin to merge quantifiers
 *
 * a+a+ -> a{2,}
 * a{2}a{3} -> a{5}
 * a{1,2}a{2,3} -> a{3,5}
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

      let {
        from: previousSiblingFrom,
        to: previousSiblingTo
      } = extractFromTo(previousSibling.node.quantifier);

      let {
        from: nodeFrom,
        to: nodeTo
      } = extractFromTo(node.quantifier);

      // It's does not seem reliable to merge quantifiers with different greediness
      // when none of both is a greedy open range
      if (
        previousSibling.node.quantifier.greedy !== node.quantifier.greedy &&
        !isGreedyOpenRange(previousSibling.node.quantifier) &&
        !isGreedyOpenRange(node.quantifier)
      ) {
        return;
      }

      // a*a* -> a*
      // a*a+ -> a+
      // a+a+ -> a{2,}
      // a{2}a{4} -> a{6}
      // a{1,2}a{2,3} -> a{3,5}
      // a{1,}a{2,} -> a{3,}
      // a+a{2,} -> a{3,}

      // a??a{2,} -> a{2,}
      // a*?a{2,} -> a{2,}
      // a+?a{2,} -> a{3,}

      node.quantifier.kind = 'Range';
      node.quantifier.from = previousSiblingFrom + nodeFrom;
      if (previousSiblingTo && nodeTo) {
        node.quantifier.to = previousSiblingTo + nodeTo;
      } else {
        delete node.quantifier.to;
      }
      if (
        isGreedyOpenRange(previousSibling.node.quantifier) ||
        isGreedyOpenRange(node.quantifier)
      ) {
        node.quantifier.greedy = true;
      }

      previousSibling.remove();

    } else {
      if (!previousSibling.hasEqualSource(path.getChild())) {
        return;
      }

      increaseQuantifierByOne(node.quantifier);
      previousSibling.remove();
    }
  }
};

function isGreedyOpenRange(quantifier) {
  return quantifier.greedy &&
    (
      quantifier.kind === '+' ||
      quantifier.kind === '*' ||
      (quantifier.kind === 'Range' && !quantifier.to)
    );
}

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