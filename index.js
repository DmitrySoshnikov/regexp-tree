/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const parser = require('./src/parser');
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
   * @param Object handler
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
  traverse(ast, handler) {
    return traverse.traverse(ast, handler);
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
    const flags = ast.flags.join('');
    return new RegExp(body, flags);
  },
};

module.exports = regexpTree;