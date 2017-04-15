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
  /**
   * Initializes a transform result for an AST.
   *
   * @param Object ast - an AST node
   * @param mixed extra - any extra data a transform may return
   */
  constructor(ast, extra = null) {
    this._ast = ast;
    this._source = null;
    this._string = null;
    this._regexp = null;
    this._extra = extra;
  }

  getAST() {
    return this._ast;
  }

  setExtra(extra) {
    this._extra = extra;
  }

  getExtra() {
    return this._extra;
  }

  toRegExp() {
    if (!this._regexp) {
      this._regexp = new RegExp(this.getSource(), this._ast.flags);
    }
    return this._regexp;
  }

  getSource() {
    if (!this._source) {
      this._source = generator.generate(this._ast.body);
    }
    return this._source;
  }

  getFlags() {
    return this._ast.flags;
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