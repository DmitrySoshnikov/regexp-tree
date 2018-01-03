/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

var transform = require('../transform');
var optimizationTransforms = require('./transforms');

module.exports = {
  /**
   * Optimizer transforms a regular expression into an optimized version,
   * replacing some sub-expressions with their idiomatic patterns.
   *
   * @param string | RegExp | AST - a regexp to optimize.
   *
   * @return TransformResult - an optimized regexp.
   *
   * Example:
   *
   *   /[a-zA-Z_0-9][a-zA-Z_0-9]*\e{1,}/
   *
   * Optimized to:
   *
   *   /\w+e+/
   */
  optimize: function optimize(regexp) {
    var transformsWhitelist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var transformToApply = transformsWhitelist.length > 0 ? transformsWhitelist : Object.keys(optimizationTransforms);

    var prevResult = void 0;
    var result = void 0;
    do {
      if (result) {
        prevResult = result.toString();
        regexp = prevResult;
      }
      transformToApply.forEach(function (transformName) {

        if (!optimizationTransforms.hasOwnProperty(transformName)) {
          throw new Error('Unknown optimization-transform: ' + transformName + '. ' + 'Available transforms are: ' + Object.keys(optimizationTransforms).join(', '));
        }

        var transformer = optimizationTransforms[transformName];

        result = transform.transform(regexp, transformer);
        regexp = result.getAST();
      });
    } while (result.toString() !== prevResult);

    return result;
  }
};