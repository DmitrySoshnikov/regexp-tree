/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

/**
 * A regexp-tree plugin to replace single char character classes with
 * just that character.
 *
 * [\d] -> \d, [^\w] -> \W
 */
module.exports = {
  CharacterClass(path) {
    const {node} = path;

    if (
      node.expressions.length !== 1 ||
      node.expressions[0].type !== 'Char'
    ) {
      return;
    }

    let {value, kind, escaped} = node.expressions[0];

    if (node.negative) {
      // For negative can extract only meta chars like [^\w] -> \W
      // cannot do for [^a] -> a (wrong).
      if (!isMeta(value)) {
        return;
      }

      value = getInverseMeta(value);
    }

    path.replace({
      type: 'Char',
      value,
      kind,
      escaped: escaped || shouldEscape(value),
      loc: {
        source: value,
        start: node.loc.start,
        end: node.loc.start + value.length,
      },
    })
  }
};

function isMeta(value) {
  return /^\\[dwsDWS$]/.test(value);
}

function getInverseMeta(value) {
  return /[dws$]/.test(value)
    ? value.toUpperCase()
    : value.toLowerCase();
}

function shouldEscape(value) {
  return /[*\[()+?]/.test(value);
}
