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
    //rewriteWordRanges(path);
  }
};

/**
 * Rewrites number ranges: [0-9] -> \d
 */
function rewriteNumberRanges(path) {
  const {node} = path;

  node.expressions.forEach(expression => {
    console.log({expression});
    if (
      expression.type === 'ClassRange' &&
      expression.from.value === '0' &&
      expression.to.value === '9'
    ) {
      path.replace({
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

}
