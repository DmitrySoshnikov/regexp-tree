/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const generator = require('../generator');
const parser = require('../parser');
const traverse = require('../traverse');

/**
 * Transform result.
 */
class TransformResult {
  constructor(ast) {
    this._ast = ast;
    this._string = null;
    this._regexp = null;
  }

  getAST() {
    return this._ast;
  }

  toRegExp() {
    if (!this._regexp) {
      const body = generator.generate(this._ast.body);
      this._regexp = new RegExp(body, this._ast.flags);
    }
    return this._regexp;
  }

  toString() {
    if (!this._string) {
      this._string = generator.generate(this._ast);
    }
    return this._string;
  }
}

module.exports = {
  /**
   * Expose `TransformResult`.
   */
  TransformResult,

  /**
   * Transforms a regular expression applying a set of
   * transformation handlers.
   *
   * @param string | AST | RegExp:
   *
   *   a regular expression in different representations: a string,
   *   a RegExp object, or an AST.
   *
   * @param Object | Array<Object>:
   *
   *   a handler (or a list of handlers) from `traverse` API.
   *
   * @return TransformResult instance.
   *
   * Example:
   *
   *   transform(/[a-z]/i, {
   *     onChar(path) {
   *       const {node} = path;
   *
   *       if (...) {
   *         path.remove();
   *       }
   *     }
   *   });
   */
  transform(regexp, handlers) {
    let ast = regexp;

    if (regexp instanceof RegExp) {
      regexp = `${regexp}`;
    }

    if (typeof regexp === 'string') {
      ast = parser.parse(regexp, {
        captureLocations: true,
      });
    }

    traverse.traverse(ast, handlers);

    return new TransformResult(ast);
  },
};