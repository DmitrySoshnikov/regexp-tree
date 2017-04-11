/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

/**
 * A regexp-tree plugin to replace standard character classes with
 * their meta symbols equivalents.
 */
module.exports = {
  CharacterClass(path) {
    const {node} = path;
    const sources = {};

    for (let i = 0; i < node.expressions.length; i++) {
      const childPath = path.getChild(i);
      const source = childPath.jsonEncode();

      if (sources.hasOwnProperty(source)) {
        childPath.remove();

         // Since we remove the current node.
         // TODO: make it simpler for users with a method.
        i--;
      }

      sources[source] = true;
    }
  }
};
