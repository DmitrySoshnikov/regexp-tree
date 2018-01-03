/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var parser = require('../../../parser');

var transform = require('../../../transform');
var desugaringTransforms = require('../transforms');

var _require = require('./builders'),
    alt = _require.alt,
    char = _require.char,
    or = _require.or,
    rep = _require.rep;

/**
 * Helper `gen` function calls node type handler.
 */


function gen(node) {
  if (node && !generator[node.type]) {
    throw new Error(node.type + ' is not supported in NFA/DFA interpreter.');
  }

  return node ? generator[node.type](node) : '';
}

/**
 * AST handler.
 */
var generator = {
  RegExp: function RegExp(node) {
    if (node.flags !== '') {
      throw new Error('NFA/DFA: Flags are not supported yet.');
    }

    return gen(node.body);
  },
  Alternative: function Alternative(node) {
    var fragments = (node.expressions || []).map(gen);
    return alt.apply(undefined, _toConsumableArray(fragments));
  },
  Disjunction: function Disjunction(node) {
    return or(gen(node.left), gen(node.right));
  },
  Repetition: function Repetition(node) {
    // Desugaring transforms should already convert
    // `a+` to `aa*`, so handle only `*` here.
    if (node.quantifier.kind !== '*') {
      throw new Error('NFA/DFA: Only * quantifier is supported yet.');
    }

    return rep(gen(node.expression));
  },
  Char: function Char(node) {
    if (node.kind !== 'simple') {
      throw new Error('NFA/DFA: Only simple chars are supported yet.');
    }

    return char(node.value);
  },
  Group: function Group(node) {
    return gen(node.expression);
  }
};

function desugar(ast) {
  var result = void 0;
  desugaringTransforms.forEach(function (transformer) {
    result = transform.transform(ast, transformer);
    ast = result.getAST();
  });
  return ast;
}

module.exports = {
  /**
   * Builds an NFA from the passed regexp.
   */
  build: function build(regexp) {
    var ast = regexp;

    if (regexp instanceof RegExp) {
      regexp = '' + regexp;
    }

    if (typeof regexp === 'string') {
      ast = parser.parse(regexp, {
        captureLocations: true
      });
    }

    return gen(desugar(ast));
  }
};