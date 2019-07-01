/**
 * The MIT License (MIT)
 * Copyright (c) 2019-present Junliang Huang <jlhwung@gmail.com>
 */

'use strict';

/**
 * A regexp-tree plugin to translate `/\p{ASCII_Hex_Digit}/u` to `/[0-9A-Fa-f]/`.
 *
 */

function getRegenerateSets(node) {
  return [
    'regenerate-unicode-properties',
    node.binary ? 'Binary_Property' : node.canonicalName,
    node.binary ? node.canonicalName : node.canonicalValue,
  ].join('/');
}

function negateCodepoints(codepoints) {
  return [0, ...codepoints, 0x110000];
}

function printCodepoint(codepoint) {
  if (codepoint < 65536) {
    return `\\u${codepoint
      .toString(16)
      .toUpperCase()
      .padStart(4, '0')}`;
  }
  return `\\u{${codepoint.toString(16).toUpperCase()}}`;
}

function toCharLiteral(codepoint) {
  return {
    type: 'Char',
    codePoint: codepoint,
    kind: 'unicode',
    value: printCodepoint(codepoint),
    symbol: printCodepoint(codepoint),
  };
}

function constructCharacterRange(node) {
  //fixme: `regenerate.prototype.data` is private API.
  let codepoints = require(getRegenerateSets(node)).data;
  if (node.negative) {
    codepoints = negateCodepoints(codepoints);
  }
  const CharacterRange = new Array(codepoints.length / 2);
  for (let i = 0; i < codepoints.length; i += 2) {
    if (codepoints[i + 1] - 1 === codepoints[i]) {
      CharacterRange[i / 2] = toCharLiteral(codepoints[i]);
    } else {
      CharacterRange[i / 2] = {
        type: 'ClassRange',
        from: toCharLiteral(codepoints[i]),
        to: toCharLiteral(codepoints[i + 1] - 1),
      };
    }
  }

  return CharacterRange;
}

module.exports = {
  shouldRun(ast) {
    return ast.flags.includes('u');
  },
  CharacterClass(path) {
    const {node} = path;
    let newExpressions = [];
    let lastUnicodePropertyIndex = 0;
    for (let i = 0; i < node.expressions.length; i++) {
      if (node.expressions[i].type === 'UnicodeProperty') {
        newExpressions = newExpressions.concat(
          node.expressions.slice(lastUnicodePropertyIndex + 1, i),
          constructCharacterRange(node.expressions[i])
        );
        lastUnicodePropertyIndex = i;
      }
    }
    if (newExpressions.length === 0) {
      return;
    }
    newExpressions = newExpressions.concat(
      node.expressions.slice(
        lastUnicodePropertyIndex + 1,
        node.expressions.length
      )
    );

    path.replace({
      type: 'CharacterClass',
      expressions: newExpressions,
    });
  },
  UnicodeProperty(path) {
    const {node} = path;
    path.replace({
      type: 'CharacterClass',
      expressions: constructCharacterRange(node),
    });
  },
};
