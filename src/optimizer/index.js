/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const clone = require('clone');
const parser = require('../parser');
const transform = require('../transform');
const optimizationTransforms = require('./transforms');

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
  optimize(regexp, transformsWhitelist = []) {
    const transformToApply = transformsWhitelist.length > 0
      ? transformsWhitelist
      : Object.keys(optimizationTransforms);

    let result = new transform.TransformResult(parser.parse(regexp));
    let prevResult;
    let ast;

    do {
      prevResult = result.toString();
      ast = clone(result.getAST());

      transformToApply.forEach(transformName => {

        if (!optimizationTransforms.hasOwnProperty(transformName)) {
          throw new Error(
            `Unknown optimization-transform: ${transformName}. ` +
            `Available transforms are: ` +
            Object.keys(optimizationTransforms).join(', ')
          );
        }

        const transformer = optimizationTransforms[transformName];

        let newResult = transform.transform(ast, transformer);
        if (newResult.toString().length <= result.toString().length) {
          result = newResult;
        }
        ast = clone(result.getAST());
      });

    } while (result.toString() !== prevResult);

    return result;
  },
};