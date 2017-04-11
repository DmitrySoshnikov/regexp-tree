/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

/**
 * A regexp-tree plugin to replace standard character classes with
 * their meta symbols equivalents.
 */
module.exports = {
  CharacterClass(path) {

    // [0-9] -> \d
    rewriteNumberRanges(path);

    // [a-zA-Z_0-9] -> \w
    rewriteWordRanges(path);
  }
};

/**
 * Rewrites number ranges: [0-9] -> \d
 */
function rewriteNumberRanges(path) {
  const {node} = path;

  node.expressions.forEach((expression, i) => {
    if (isFullNumberRange(expression)) {
      path.getChild(i).replace({
        type: 'Char',
        value: '\\d',
        kind: 'meta',
        loc: {
          source: '\\d',
          start: expression.loc.start,
          end: expression.loc.start + 2,
        },
      });
    }
  });
}

/**
 * Rewrites word ranges: [a-zA-Z_0-9] -> \w
 * Thus, the ranges may go in any order, and other symbols/ranges
 * are kept untouched, e.g. [a-z_\dA-Z$] -> [\w$]
 */
function rewriteWordRanges(path) {
  const {node} = path;

  let numberPath = null;
  let lowerCacePath = null;
  let upperCasePath = null;
  let underscorePath = null;

  node.expressions.forEach((expression, i) => {

    // \d
    if (isMetaNumber(expression)) {
      numberPath = path.getChild(i);
    }

    // a-z
    else if (isLowerCaseRange(expression)) {
      lowerCacePath = path.getChild(i);
    }

    // A-Z
    else if (isUpperCaseRange(expression)) {
      upperCasePath = path.getChild(i);
    }

    // _
    else if (isUnderscore(expression)) {
      underscorePath = path.getChild(i);
    }
  });

  // If we found the whole pattern, replace it.
  if (
    numberPath &&
    lowerCacePath &&
    upperCasePath &&
    underscorePath
  ) {

    // Put \w in place of \d.
    numberPath.replace({
      type: 'Char',
      value: '\\w',
      kind: 'meta',
      loc: {
        source: '\\w',
        start: numberPath.node.loc.start,
        end: numberPath.node.loc.start + 2,
      },
    });

    // Other paths are removed.
    lowerCacePath.remove();
    upperCasePath.remove();
    underscorePath.remove();
  }
}

function isFullNumberRange(node) {
  return (
    node.type === 'ClassRange' &&
    node.from.value === '0' &&
    node.to.value === '9'
  );
}

function isMetaNumber(node) {
  return (
    node.type === 'Char' &&
    node.value === '\\d' &&
    node.kind === 'meta'
  );
}

function isLowerCaseRange(node) {
  return (
    node.type === 'ClassRange' &&
    node.from.value === 'a' &&
    node.to.value === 'z'
  );
}

function isUpperCaseRange(node) {
  return (
    node.type === 'ClassRange' &&
    node.from.value === 'A' &&
    node.to.value === 'Z'
  );
}

function isUnderscore(node) {
  return (
    node.type === 'Char' &&
    node.value === '_' &&
    node.kind === 'simple'
  );
}

