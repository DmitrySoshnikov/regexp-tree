/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

// TODO (https://github.com/DmitrySoshnikov/regexp-tree/issues/7)

const parser = require('../parser');
const traverse = require('../traverse');

/**
 * Transform result.
 */
class TransformResult {
  //
}

module.exports = {
  /**
   * Transforms a regular expression applying a set of
   * transformation handlers.
   *
   * @param mixed regexp:
   *
   *   a regular expression in different representations: a string,
   *   a RegExp object, or an AST.
   *
   * @param Object|Array<Object>:
   *
   *   a handler (or a list of handlers). Can be a simple plain handler object,
   *   or a "plugin" to which different API methods are accessible. A "plugin"
   *   is a function which receives as a parameter `TransformApi` object, and
   *   which should return a plain handler.
   *
   * @return TransformResult instance.
   *
   * Example:
   *
   *   transform(/[a-z]/i, [
   *     api => {
   *       onChar(node) {
   *         if (...) {
   *           api.removeNode(node);
   *         }
   *       }
   *     },
   *   ]);
   */
  transform(regexp, handlers) {
    //
  },
};