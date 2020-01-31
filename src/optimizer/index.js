/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const clone = require('../utils/clone');
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
  optimize(regexp, {whitelist = [], blacklist = []} = {}) {
    const transformsRaw =
      whitelist.length > 0
        ? whitelist
        : Array.from(optimizationTransforms.keys());

    const transformToApply = transformsRaw.filter(
      transform => !blacklist.includes(transform)
    );

    let ast = regexp;
    if (regexp instanceof RegExp) {
      regexp = `${regexp}`;
    }

    if (typeof regexp === 'string') {
      ast = parser.parse(regexp);
    }

    let result = new transform.TransformResult(ast);
    let prevResultString;

    do {
      // Get a copy of the current state here so
      // we can compare it with the state at the
      // end of the loop.
      prevResultString = result.toString();
      ast = clone(result.getAST());

      transformToApply.forEach(transformName => {
        if (!optimizationTransforms.has(transformName)) {
          throw new Error(
            `Unknown optimization-transform: ${transformName}. ` +
              `Available transforms are: ` +
              Array.from(optimizationTransforms.keys()).join(', ')
          );
        }

        const transformer = optimizationTransforms.get(transformName);

        // Don't override result just yet since we
        // might want to rollback the transform
        let newResult = transform.transform(ast, transformer);

        if (newResult.toString() !== result.toString()) {
          if (newResult.toString().length <= result.toString().length) {
            result = newResult;
          } else {
            // Result has changed but is not shorter:
            // restore ast to its previous state.

            ast = clone(result.getAST());
          }
        }
      });

      // Keep running the optimizer until it stops
      // making any change to the regexp.
    } while (result.toString() !== prevResultString);

    return result;
  },
};
