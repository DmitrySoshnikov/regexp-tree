/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const parser = require('./src/parser');
const transform = require('./src/transform');
const traverse = require('./src/traverse');
const generator = require('./src/generator');

/**
 * An API object for RegExp processing (parsing/transform/generation).
 */
const regexpTree = {
  /**
   * Parser module exposed.
   */
  parser,

  /**
   * `TransformResult` exposed.
   */
  TransformResult: transform.TransformResult,

  /**
   * Parses a regexp string, producing an AST.
   *
   * @param string regexp
   * @return Object AST
   */
  parse(regexp) {
    return parser.parse(`${regexp}`);
  },

  /**
   * Traverses a RegExp AST.
   *
   * @param Object ast
   * @param Object | Array<Object> handlers
   *
   * A `handler` is an object containing handler function for needed
   * node types. Example:
   *
   *   regexpTree.traverse(ast, {
   *     onChar(node) {
   *       ...
   *     },
   *   });
   */
  traverse(ast, handlers) {
    return traverse.traverse(ast, handlers);
  },

  /**
   * Transforms a regular expression.
   *
   * A regexp can be passed in different formats (string, regexp or AST),
   * applying a set of transformations. It is a convenient wrapper
   * on top of "parse-traverse-generate" tool chain.
   *
   * @param string | AST | RegExp regexp - a regular expression;
   * @param Object | Array<Object> handlers - a list of handlers.
   *
   * @return TransformResult - a transformation result.
   */
  transform(regexp, handlers) {
    return transform.transform(regexp, handlers);
  },

  /**
   * Generates a RegExp string from an AST.
   *
   * @param Object ast
   *
   * Invariant:
   *
   *   regexpTree.generate(regexpTree.parse('/[a-z]+/i')); // '/[a-z]+/i'
   */
  generate(ast) {
    return generator.generate(ast);
  },

  /**
   * Creates a RegExp object from a regexp string.
   *
   * @param string regexp
   */
  toRegExp(regexp) {
    const ast = this.parse(regexp);
    const body = this.generate(ast.body);
    return new RegExp(body, ast.flags);
  },

  /**
   * Optimizes a regular expression by replacing some
   * sub-expressions with their idiomatic patterns.
   *
   * @param string regexp
   */
  optimize(regexp) {
    // TODO (https://github.com/DmitrySoshnikov/regexp-tree/issues/21)
    throw new Error('`regexpTree.optimize` is not implemented yet.');
  },
};

module.exports = regexpTree;