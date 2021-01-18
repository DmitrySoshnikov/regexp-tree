/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const NodePath = require('../../traverse/node-path');

const {increaseQuantifierByOne} = require('../../transform/utils');

/**
 * A regexp-tree plugin to combine repeating patterns.
 *
 * /^abcabcabc/ -> /^abc{3}/
 * /^(?:abc){2}abc/ -> /^(?:abc){3}/
 * /^abc(?:abc){2}/ -> /^(?:abc){3}/
 */

module.exports = {
  Alternative(path) {
    const {node} = path;

    // We can skip the first child
    let index = 1;
    while (index < node.expressions.length) {
      let child = path.getChild(index);
      index = Math.max(1, combineRepeatingPatternLeft(path, child, index));

      if (index >= node.expressions.length) {
        break;
      }

      child = path.getChild(index);
      index = Math.max(1, combineWithPreviousRepetition(path, child, index));

      if (index >= node.expressions.length) {
        break;
      }

      child = path.getChild(index);
      index = Math.max(1, combineRepetitionWithPrevious(path, child, index));

      index++;
    }
  },
};

// abcabc -> (?:abc){2}
function combineRepeatingPatternLeft(alternative, child, index) {
  const {node} = alternative;

  const nbPossibleLengths = Math.ceil(index / 2);
  let i = 0;

  while (i < nbPossibleLengths) {
    const startIndex = index - 2 * i - 1;
    let right, left;

    if (i === 0) {
      right = child;
      left = alternative.getChild(startIndex);
    } else {
      right = NodePath.getForNode({
        type: 'Alternative',
        expressions: [...node.expressions.slice(index - i, index), child.node],
      });

      left = NodePath.getForNode({
        type: 'Alternative',
        expressions: [...node.expressions.slice(startIndex, index - i)],
      });
    }

    if (right.hasEqualSource(left)) {
      for (let j = 0; j < 2 * i + 1; j++) {
        alternative.getChild(startIndex).remove();
      }

      child.replace({
        type: 'Repetition',
        expression:
          i === 0 && right.node.type !== 'Repetition'
            ? right.node
            : {
                type: 'Group',
                capturing: false,
                expression: right.node,
              },
        quantifier: {
          type: 'Quantifier',
          kind: 'Range',
          from: 2,
          to: 2,
          greedy: true,
        },
      });
      return startIndex;
    }

    i++;
  }

  return index;
}

// (?:abc){2}abc -> (?:abc){3}
function combineWithPreviousRepetition(alternative, child, index) {
  const {node} = alternative;

  let i = 0;
  while (i < index) {
    let previousChild = alternative.getChild(i);

    if (
      previousChild.node.type === 'Repetition' &&
      previousChild.node.quantifier.greedy
    ) {
      let left = previousChild.getChild();
      let right;

      if (left.node.type === 'Group' && !left.node.capturing) {
        left = left.getChild();
      }

      if (i + 1 === index) {
        right = child;
        if (right.node.type === 'Group' && !right.node.capturing) {
          right = right.getChild();
        }
      } else {
        right = NodePath.getForNode({
          type: 'Alternative',
          expressions: [...node.expressions.slice(i + 1, index + 1)],
        });
      }

      if (left.hasEqualSource(right)) {
        for (let j = i; j < index; j++) {
          alternative.getChild(i + 1).remove();
        }

        increaseQuantifierByOne(previousChild.node.quantifier);

        return i;
      }
    }

    i++;
  }
  return index;
}

// abc(?:abc){2} -> (?:abc){3}
function combineRepetitionWithPrevious(alternative, child, index) {
  const {node} = alternative;

  if (child.node.type === 'Repetition' && child.node.quantifier.greedy) {
    let right = child.getChild();
    let left;

    if (right.node.type === 'Group' && !right.node.capturing) {
      right = right.getChild();
    }

    let rightLength;
    if (right.node.type === 'Alternative') {
      rightLength = right.node.expressions.length;
      left = NodePath.getForNode({
        type: 'Alternative',
        expressions: [...node.expressions.slice(index - rightLength, index)],
      });
    } else {
      rightLength = 1;
      left = alternative.getChild(index - 1);
      if (left.node.type === 'Group' && !left.node.capturing) {
        left = left.getChild();
      }
    }

    if (left.hasEqualSource(right)) {
      for (let j = index - rightLength; j < index; j++) {
        alternative.getChild(index - rightLength).remove();
      }

      increaseQuantifierByOne(child.node.quantifier);

      return index - rightLength;
    }
  }
  return index;
}
