/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const NFAState = require('./nfa-state');

const parser = require('../../../parser');

const transform = require('../../../transform');
const desugaringTransforms = require('../transforms');

const {
  alt,
  char,
  e,
  or,
  rep,
} = require('./builders');

const {
  EPSILON,
  EPSILON_CLOSURE,
} = require('../special-symbols');

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
    // Desugaring transforms should already convert
    // `a+` to `aa*`, so handle only `*` here.
    if (node.quantifier.kind !== '*') {
      throw new Error(`NFA/DFA: Only * quantifier is supported yet.`);
    }

    return rep(gen(node.expression));
  },

  Char(node) {
    const value = node.value;

    if (node.kind !== 'simple') {
      throw new Error(`NFA/DFA: Only simple chars are supported yet.`);
    }

    return char(node.value);
  },
};

function desugar(ast) {
  let result;
  desugaringTransforms.forEach(transformer => {
    result = transform.transform(ast, transformer);
    ast = result.getAST();
  });
  return ast;
}

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

    return gen(desugar(ast));
  }
};