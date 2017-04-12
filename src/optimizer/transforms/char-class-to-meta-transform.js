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

    // [ \t\r\n\f] -> \s
    rewriteWhitespaceRanges(path);
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
  let lowerCasePath = null;
  let upperCasePath = null;
  let underscorePath = null;

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
    }
  });

  // If we found the whole pattern, replace it.
  if (
    numberPath &&
    lowerCasePath &&
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
    lowerCasePath.remove();
    upperCasePath.remove();
    underscorePath.remove();
  }
}

/**
 * Rewrites whitespace ranges: [ \t\r\n\f] -> \s.
 */
function rewriteWhitespaceRanges(path) {
  const {node} = path;

  let spacePath = null;
  let tPath = null;
  let nPath = null;
  let rPath = null;
  let fPath = null;

  node.expressions.forEach((expression, i) => {

    // Space
    if (isChar(expression, ' ')) {
      spacePath = path.getChild(i);
    }

    // \t
    else if (isMetaChar(expression, '\\t')) {
      tPath = path.getChild(i);
    }

    // \n
    else if (isMetaChar(expression, '\\n')) {
      nPath = path.getChild(i);
    }

    // \r
    else if (isMetaChar(expression, '\\r')) {
      rPath = path.getChild(i);
    }

    // \f
    else if (isMetaChar(expression, '\\f')) {
      fPath = path.getChild(i);
    }

  });

  // If we found the whole pattern, replace it.
  // Make \f optional.
  if (
    spacePath &&
    tPath &&
    nPath &&
    rPath
  ) {

    // Put \s in place of \n.
    nPath.node.value = '\\s';

    // Other paths are removed.
    spacePath.remove();
    tPath.remove();
    rPath.remove();

    if (fPath) {
      fPath.remove();
    }
  }
}

function isFullNumberRange(node) {
  return (
    node.type === 'ClassRange' &&
    node.from.value === '0' &&
    node.to.value === '9'
  );
}

function isChar(node, value, kind = 'simple') {
  return (
    node.type === 'Char' &&
    node.value === value &&
    node.kind === kind
  );
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
  return (
    node.type === 'Char' &&
    node.value === '_' &&
    node.kind === 'simple'
  );
}

