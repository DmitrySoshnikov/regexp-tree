/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const compatTransforms = require('./transforms');
const transform = require('../transform');

module.exports = {
  /**
   * Translates a regexp in new syntax to equivalent regexp in old syntax.
   *
   * @param string|RegExp|AST - regexp
   * @param Array transformsWhitelist - names of the transforms to apply
   */
  transform(regexp, transformsWhitelist = []) {
    const transformToApply = transformsWhitelist.length > 0
      ? transformsWhitelist
      : Object.keys(compatTransforms);

    let result;

    // Collect extra data per transform.
    const extra = {};

    transformToApply.forEach(transformName => {

      if (!compatTransforms.hasOwnProperty(transformName)) {
        throw new Error(
          `Unknown compat-transform: ${transformName}. ` +
          `Available transforms are: ` +
          Object.keys(compatTransforms).join(', ')
        );
      }

      const handler = compatTransforms[transformName];

      result = transform.transform(regexp, handler);
      regexp = result.getAST();

      // Collect `extra` transform result.
      if (typeof handler.getExtra === 'function') {
        extra[transformName] = handler.getExtra();
      }
    });

    // Set the final extras for all transforms.
    result.setExtra(extra);

    return result;
  },
};
