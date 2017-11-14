/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const NodePath = require('../../traverse/node-path');

const {
  disjunctionToList,
  listToDisjunction,
} = require('../../transform/utils');

/**
 * Removes duplicates from a disjunction sequence:
 *
 * /(ab|bc|ab)+(xy|xy)+/ -> /(ab|bc)+(xy)+/
 */
module.exports = {
  Disjunction(path) {
    const {node} = path;

    // Make unique nodes.
    const uniqueNodesMap = {};

    const parts = disjunctionToList(node).filter(part => {
      const encoded = part ? NodePath.getForNode(part).jsonEncode() : 'null';

      // Already recorded this part, filter out.
      if (uniqueNodesMap.hasOwnProperty(encoded)) {
        return false;
      }

      uniqueNodesMap[encoded] = part;
      return true;
    });

    // Replace with the optimized disjunction.
    path.replace(listToDisjunction(parts));

  }
};