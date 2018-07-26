/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const parser = require('../../../parser');

const {alt, char, or, rep, plusRep, questionRep} = require('./builders');

/**
 * Helper `gen` function calls node type handler.
 */
function gen(node) {
  if (node && !generator[node.type]) {
    throw new Error(`${node.type} is not supported in NFA/DFA interpreter.`);
  }

  return node ? generator[node.type](node) : '';
}

/**
 * AST handler.
 */
const generator = {
  RegExp(node) {
    if (node.flags !== '') {
      throw new Error(`NFA/DFA: Flags are not supported yet.`);
    }

    return gen(node.body);
  },

  Alternative(node) {
    const fragments = (node.expressions || []).map(gen);
    return alt(...fragments);
  },

  Disjunction(node) {
    return or(gen(node.left), gen(node.right));
  },

  Repetition(node) {
    switch (node.quantifier.kind) {
      case '*':
        return rep(gen(node.expression));
      case '+':
        return plusRep(gen(node.expression));
      case '?':
        return questionRep(gen(node.expression));
      default:
        throw new Error(`Unknown repeatition: ${node.quantifier.kind}.`);
    }
  },

  Char(node) {
    if (node.kind !== 'simple') {
      throw new Error(`NFA/DFA: Only simple chars are supported yet.`);
    }

    return char(node.value);
  },

  Group(node) {
    return gen(node.expression);
  },
};

module.exports = {
  /**
   * Builds an NFA from the passed regexp.
   */
  build(regexp) {
    let ast = regexp;

    if (regexp instanceof RegExp) {
      regexp = `${regexp}`;
    }

    if (typeof regexp === 'string') {
      ast = parser.parse(regexp, {
        captureLocations: true,
      });
    }

    return gen(ast);
  },
};
