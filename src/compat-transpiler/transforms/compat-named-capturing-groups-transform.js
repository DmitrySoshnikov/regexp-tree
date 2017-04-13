/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

/**
 * A regexp-tree plugin to translate `/(?<name>a)\k<name>/` to `/(a)\1/`.
 */
module.exports = {

  // To track the names of the groups, and return them
  // in the transform result state.
  //
  // A map from name to number: {foo: 2, bar: 4}
  _groupNames: {},

  Group(path) {
    const {node} = path;

    if (!node.name) {
      return;
    }

    // TODO (get number from group: https://github.com/DmitrySoshnikov/regexp-tree/issues/57)

    delete node.name;
  },

  Backreference(path) {
    // TODO
  }
};