/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const NodePath = require('./node-path');

/**
 * Does an actual AST traversal, using visitor pattern,
 * and calling set of callbacks.
 *
 * Based on https://github.com/olov/ast-traverse
 *
 * Expects AST in Mozilla Parser API: nodes which are supposed to be
 * handled should have `type` property.
 *
 * @param Object root - a root node to start traversal from.
 *
 * @param Object options - an object with set of callbacks:
 *
 *   - `pre(node, parent, prop, index)` - a hook called on node enter
 *   - `post`(node, parent, prop, index) - a hook called on node exit
 *   - `skipProperty(prop)` - a predicated whether a property should be skipped
 */
function astTraverse(root, options = {}) {
  const pre = options.pre;
  const post = options.post;
  const skipProperty = options.skipProperty;

  function visit(node, parent, prop, idx) {
    if (!node || typeof node.type !== 'string') {
      return;
    }

    let res = undefined;
    if (pre) {
      res = pre(node, parent, prop, idx);
    }

    if (res !== false) {

      // A node can be replaced during traversal, so we have to
      // recalculate it from the parent, to avoid traversing "dead" nodes.
      if (parent && parent[prop]) {
        if (!isNaN(idx)) {
          node = parent[prop][idx];
        } else {
          node = parent[prop];
        }
      }

      for (let prop in node) if (node.hasOwnProperty(prop)) {
        if (skipProperty ? skipProperty(prop, node) : prop[0] === '$') {
          continue;
        }

        const child = node[prop];

        // Collection node.
        //
        // NOTE: a node (or several nodes) can be removed or inserted
        // during traversal.
        //
        // Current traversing index is stored on top of the
        // `NodePath.traversingIndexStack`. The stack is used to support
        // recursive nature of the traversal.
        //
        // In this case `NodePath.traversingIndex` (which we use here) is
        // updated in the NodePath remove/insert methods.
        //
        if (Array.isArray(child)) {
          let index = 0;
          NodePath.traversingIndexStack.push(index);
          while (index < child.length) {
            visit(
              child[index],
              node,
              prop,
              index
            );
            index = NodePath.updateTraversingIndex(+1);
          }
          NodePath.traversingIndexStack.pop();
        }

        // Simple node.
        else {
          visit(child, node, prop);
        }
      }
    }

    if (post) {
      post(node, parent, prop, idx);
    }
  }

  visit(root, null);
}

module.exports = {
  /**
   * Traverses an AST.
   *
   * @param Object ast - an AST node
   *
   * @param Object | Array<Object> handlers:
   *
   *   an object (or an array of objects)
   *
   *   Each such object contains a handler function per node.
   *   In case of an array of handlers, they are applied in order.
   *   A handler may return a transformed node (or a different type).
   *
   *   The per-node function may instead be an object with functions pre and post.
   *   pre is called before visiting the node, post after.
   *   If a handler is a function, it is treated as the pre function, with an empty post.
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

    // Filter out handlers by result of `shouldRun`, if the method is present.
    handlers = handlers.filter(handler => {
      if (typeof handler.shouldRun !== 'function') {
        return true;
      }
      return handler.shouldRun(ast);
    });

    NodePath.initRegistry();

    // Allow handlers to initializer themselves.
    handlers.forEach(handler => {
      if (typeof handler.init === 'function') {
        handler.init(ast);
      }
    });

    function getPathFor(node, parent, prop, index) {
      const parentPath = NodePath.getForNode(parent);
      const nodePath = NodePath.getForNode(
        node,
        parentPath,
        prop,
        index
      );

      return nodePath;
    }

    // Handle actual nodes.
    astTraverse(ast, {
      /**
       * Handler on node enter.
       */
      pre(node, parent, prop, index) {
        let nodePath;
        if (!options.asNodes) {
          nodePath = getPathFor(node, parent, prop, index);
        }

        for (const handler of handlers) {
          // "Catch-all" `*` handler.
          if (typeof handler['*'] === 'function') {
            if (nodePath) {
              // A path/node can be removed by some previous handler.
              if (!nodePath.isRemoved()) {
                const handlerResult = handler['*'](nodePath);
                // Explicitly stop traversal.
                if (handlerResult === false) {
                  return false;
                }
              }
            } else {
              handler['*'](node, parent, prop, index);
            }
          }

          // Per-node handler.
          let handlerFuncPre;
          if (typeof handler[node.type] === 'function') {
            handlerFuncPre = handler[node.type];
          } else if (
            typeof handler[node.type] === 'object' &&
            typeof handler[node.type].pre === 'function'
          ) {
            handlerFuncPre = handler[node.type].pre;
          }

          if (handlerFuncPre) {
            if (nodePath) {
              // A path/node can be removed by some previous handler.
              if (!nodePath.isRemoved()) {
                const handlerResult = handlerFuncPre.call(handler, nodePath);
                // Explicitly stop traversal.
                if (handlerResult === false) {
                  return false;
                }
              }
            } else {
              handlerFuncPre.call(handler, node, parent, prop, index);
            }
          }
        } // Loop over handlers

      }, // pre func

      /**
       * Handler on node exit.
       */
      post(node, parent, prop, index) {
        if (!node) {
          return;
        }

        let nodePath;
        if (!options.asNodes) {
          nodePath = getPathFor(node, parent, prop, index);
        }

        for (const handler of handlers) {
          // Per-node handler.
          let handlerFuncPost;
          if (
            typeof handler[node.type] === 'object' &&
            typeof handler[node.type].post === 'function'
          ) {
            handlerFuncPost = handler[node.type].post;
          }

          if (handlerFuncPost) {
            if (nodePath) {
              // A path/node can be removed by some previous handler.
              if (!nodePath.isRemoved()) {
                const handlerResult = handlerFuncPost.call(handler, nodePath);
                // Explicitly stop traversal.
                if (handlerResult === false) {
                  return false;
                }
              }
            } else {
              handlerFuncPost.call(handler, node, parent, prop, index);
            }
          }
        } // Loop over handlers
      }, // post func

      /**
       * Skip locations by default.
       */
      skipProperty(prop) {
        return prop === 'loc';
      },
    });
  },
};
