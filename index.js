/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const compatTranspiler = require('./src/compat-transpiler');
const generator = require('./src/generator');
const optimizer = require('./src/optimizer');
const parser = require('./src/parser');
const transform = require('./src/transform');
const traverse = require('./src/traverse');

const {RegExpTree} = require('./src/compat-transpiler/runtime');

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
   *
   *   a regular expression in different formats: string, AST, RegExp.
   *
   * @param Object options
   *
   *   parsing options for this parse call. Default are:
   *
   *     - captureLocations: boolean
   *     - any other custom options
   *
   * @return Object AST
   */
  parse(regexp, options) {
    return parser.parse(`${regexp}`, options);
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
   *
   * @return TransformResult object
   */
  optimize(regexp) {
    return optimizer.optimize(regexp);
  },

  /**
   * Translates a regular expression in new syntax or in new format
   * into equivalent expressions in old syntax.
   *
   * @param string regexp
   *
   * @return TransformResult object
   */
  compatTranspile(regexp, whitelist) {
    return compatTranspiler.transform(regexp, whitelist);
  },

  /**
   * Executes a regular expression on a string.
   *
   * @param RegExp|string re - a regular expression.
   * @param string string - a testing string.
   */
  exec(re, string) {
    if (typeof re === 'string') {
      const compat = this.compatTranspile(re);
      const extra = compat.getExtra();

      if (extra.namedCapturingGroups) {
        re = new RegExpTree(compat.toRegExp(), {
          flags: compat.getFlags(),
          source: compat.getSource(),
          groups: extra.namedCapturingGroups,
        });
      } else {
        re = compat.toRegExp();
      }
    }

    return re.exec(string);
  },
};

module.exports = regexpTree;