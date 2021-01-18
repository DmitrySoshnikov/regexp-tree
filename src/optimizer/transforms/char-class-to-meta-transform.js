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
  _hasIFlag: false,
  _hasUFlag: false,
  init(ast) {
    this._hasIFlag = ast.flags.includes('i');
    this._hasUFlag = ast.flags.includes('u');
  },
  CharacterClass(path) {
    // [0-9] -> \d
    rewriteNumberRanges(path);

    // [a-zA-Z_0-9] -> \w
    rewriteWordRanges(path, this._hasIFlag, this._hasUFlag);

    // [ \f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff] -> \s
    rewriteWhitespaceRanges(path);
  },
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
      });
    }
  });
}

/**
 * Rewrites word ranges: [a-zA-Z_0-9] -> \w
 * Thus, the ranges may go in any order, and other symbols/ranges
 * are kept untouched, e.g. [a-z_\dA-Z$] -> [\w$]
 */
function rewriteWordRanges(path, hasIFlag, hasUFlag) {
  const {node} = path;

  let numberPath = null;
  let lowerCasePath = null;
  let upperCasePath = null;
  let underscorePath = null;
  let u017fPath = null;
  let u212aPath = null;

  node.expressions.forEach((expression, i) => {
    // \d
    if (isMetaChar(expression, '\\d')) {
      numberPath = path.getChild(i);
    }

    // a-z
    else if (isLowerCaseRange(expression)) {
      lowerCasePath = path.getChild(i);
    }

    // A-Z
    else if (isUpperCaseRange(expression)) {
      upperCasePath = path.getChild(i);
    }

    // _
    else if (isUnderscore(expression)) {
      underscorePath = path.getChild(i);
    } else if (hasIFlag && hasUFlag && isCodePoint(expression, 0x017f)) {
      u017fPath = path.getChild(i);
    } else if (hasIFlag && hasUFlag && isCodePoint(expression, 0x212a)) {
      u212aPath = path.getChild(i);
    }
  });

  // If we found the whole pattern, replace it.
  if (
    numberPath &&
    ((lowerCasePath && upperCasePath) ||
      (hasIFlag && (lowerCasePath || upperCasePath))) &&
    underscorePath &&
    (!hasUFlag || !hasIFlag || (u017fPath && u212aPath))
  ) {
    // Put \w in place of \d.
    numberPath.replace({
      type: 'Char',
      value: '\\w',
      kind: 'meta',
    });

    // Other paths are removed.
    if (lowerCasePath) {
      lowerCasePath.remove();
    }
    if (upperCasePath) {
      upperCasePath.remove();
    }
    underscorePath.remove();
    if (u017fPath) {
      u017fPath.remove();
    }
    if (u212aPath) {
      u212aPath.remove();
    }
  }
}

/**
 * Rewrites whitespace ranges: [ \f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff] -> \s.
 */
const whitespaceRangeTests = [
  node => isChar(node, ' '),
  ...['\\f', '\\n', '\\r', '\\t', '\\v'].map(char => node =>
    isMetaChar(node, char)
  ),
  ...[
    0x00a0,
    0x1680,
    0x2028,
    0x2029,
    0x202f,
    0x205f,
    0x3000,
    0xfeff,
  ].map(codePoint => node => isCodePoint(node, codePoint)),
  node =>
    node.type === 'ClassRange' &&
    isCodePoint(node.from, 0x2000) &&
    isCodePoint(node.to, 0x200a),
];

function rewriteWhitespaceRanges(path) {
  const {node} = path;

  if (
    node.expressions.length < whitespaceRangeTests.length ||
    !whitespaceRangeTests.every(test =>
      node.expressions.some(expression => test(expression))
    )
  ) {
    return;
  }

  // If we found the whole pattern, replace it.

  // Put \s in place of \n.
  const nNode = node.expressions.find(expression =>
    isMetaChar(expression, '\\n')
  );
  nNode.value = '\\s';
  nNode.symbol = undefined;
  nNode.codePoint = NaN;

  // Other paths are removed.
  node.expressions
    .map((expression, i) =>
      whitespaceRangeTests.some(test => test(expression))
        ? path.getChild(i)
        : undefined
    )
    .filter(Boolean)
    .forEach(path => path.remove());
}

function isFullNumberRange(node) {
  return (
    node.type === 'ClassRange' &&
    node.from.value === '0' &&
    node.to.value === '9'
  );
}

function isChar(node, value, kind = 'simple') {
  return node.type === 'Char' && node.value === value && node.kind === kind;
}

function isMetaChar(node, value) {
  return isChar(node, value, 'meta');
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
  return node.type === 'Char' && node.value === '_' && node.kind === 'simple';
}

function isCodePoint(node, codePoint) {
  return (
    node.type === 'Char' &&
    node.kind === 'unicode' &&
    node.codePoint === codePoint
  );
}
