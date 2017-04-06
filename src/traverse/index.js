/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const astTraverse = require('ast-traverse');
const NodePath = require('./node-path');

module.exports = {
  /**
   * Traverses an AST.
   *
   * @param Object ast - an AST node
   *
   * @param Array<Object>|Object handlers:
   *
   *   an object (or an array of objects)
   *   containing handler function per node. In case of an array of
   *   handlers, they are applied in order. A handler may return a
   *   transformed node (or a different type).
   *
   * @param Object options:
   *
   *   a config object, specifying traversal options:
   *
   *   `asNodes`: boolean - whether handlers should receives raw AST nodes
   *   (false by default), instead of a `NodePath` wrapper. Note, by default
   *   `NodePath` wrapper provides a set of convenient method to manipulate
   *   a traversing AST, and also has access to all parents list. A raw
   *   nodes traversal should be used in rare cases, when no `NodePath`
   *   features are needed.
   *
   * Special hooks:
   *
   *   - `shouldRun(ast)` - a predicate determining whether the handler
   *                        should be applied.
   *
   * NOTE: Multiple handlers are used as an optimization of applying all of
   * them in one AST traversal pass.
   */
  traverse(ast, handlers, options = {asNodes: false}) {
    if (!Array.isArray(handlers)) {
      handlers = [handlers];
    }

    // Filter out handlers by result of `shouldRun`, if the method presents.
    handlers = handlers.filter(handler => {
      if (typeof handler.shouldRun !== 'function') {
        return true;
      }
      return handler.shouldRun(ast);
    });

    NodePath.initRegistry();

    // Handle actual nodes.
    astTraverse(ast, {

      /**
       * Handler on node enter.
       */
      pre(node, parent, prop, index) {
        let parentPath;
        let nodePath;

        if (!options.asNodes) {
          parentPath = NodePath.getForNode(parent);

          nodePath = NodePath.getForNode(
            node,
            parentPath,
            prop,
            index
          );
        }

        for (const handler of handlers) {
          // "Catch-all" `*` handler.
          if (typeof handler['*'] === 'function') {
            if (options.asNodes) {
              handler['*'](node, parent, prop, index);
            } else {
              // A path/node can be removed by some previous handler.
              if (!nodePath.isRemoved()) {
                handler['*'](nodePath);
              }
            }
          }

          // Per-node handler.
          if (typeof handler[node.type] === 'function') {
            if (options.asNodes) {
              handler[node.type](node, parent, prop, index);
            } else {
              // A path/node can be removed by some previous handler.
              if (!nodePath.isRemoved()) {
                handler[node.type](nodePath);
              }
            }
          }
        }
      },

      /**
       * Skip locations by default.
       */
      skipProperty(prop) {
        return prop === 'loc';
      },
    });
  },
};