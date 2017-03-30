/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';
const traverse = require('../traverse');

/**
 * Helper `gen` function calls node type handler.
 */
function gen(node) {
  return generator[node.type](node);
}

/**
 * AST handler.
 */
const generator = {
  RegExp(node) {
    return `/${gen(node.body)}/${node.flags.join('')}`;
  },

  Alternative(node) {
    return node.expressions
      .map(node => gen(node))
      .join('');
  },

  Disjunction(node) {
    return `${gen(node.left)}|${gen(node.right)}`;
  },

  Group(node) {
    const expression = gen(node.expression);

    if (node.capturing) {
      return `(${expression})`;
    }

    return `(?:${expression})`;
  },

  Assertion(node) {
    switch (node.kind) {
      case '^': return '^';
      case '$': return '$';
      case '\\b': return '\\b';
      case '\\B': return '\\B';

      case 'Lookahead': {
        const assertion = gen(node.assertion);

        if (node.negative) {
          return `(?!${assertion})`;
        }

        return `(?=${assertion})`;
      }

      default:
        throw new TypeError('Unknown Assertion kind: ' + node.kind);
    }
  },

  CharacterClass(node) {
    const expressions = node
      .expressions
      .map(node => gen(node))
      .join('');

    if (node.negative) {
      return `[^${expressions}]`;
    }

    return `[${expressions}]`;
  },

  ClassRange(node) {
    return `${gen(node.from)}-${gen(node.to)}`;
  },

  Repetition(node) {
    return `${gen(node.expression)}${gen(node.quantifier)}`;
  },

  Quantifier(node) {
    let quantifier;
    const greedy = node.greedy ? '' : '?';

    switch (node.kind) {
      case '+':
        quantifier = `+`;
        break;
      case '?':
        quantifier = `?`;
        break;
      case '*':
        quantifier = `*`;
        break;
      case 'Range':
        // Exact: {1}
        if (node.from === node.to) {
          quantifier = `{${node.from}}`;
        }
        // Open: {1,}
        else if (!node.to) {
          quantifier = `{${node.from},}`;
        }
        // Closed: {1,3}
        else {
          quantifier = `{${node.from},${node.to}}`;
        }
        break;
      default:
        throw new TypeError('Unknown Quantifier kind: ' + node.kind);
    }

    return `${quantifier}${greedy}`;
  },

  Char(node) {
    const value = node.value;

    switch (node.kind) {
      case 'simple': {
        if (node.escaped) {
          return `\\${value}`;
        }
        return value;
      }

      case 'hex':
      case 'unicode':
      case 'oct':
      case 'decimal':
      case 'control':
      case 'meta':
        return value;

      default:
        throw new TypeError('Unknown Char kind: ' + node.kind);
    }
  },
};

module.exports = {
  /**
   * Generates a regexp string from an AST.
   *
   * @param Object ast - an AST node
   */
  generate: gen,
};