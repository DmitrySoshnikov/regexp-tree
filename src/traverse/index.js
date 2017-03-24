/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const astTraverse = require('ast-traverse');

module.exports = {
  /**
   * Traverses an AST.
   *
   * @param Object ast - an AST node
   * @param Object handler - an object containing handler function per node.
   */
  traverse(ast, handler) {
    astTraverse(ast, {

      /**
       * Handler on node enter.
       */
      pre(node, parent, prop, index) {
        const handlerName = `on${node.type}`;
        if (typeof handler[handlerName] === 'function') {
          handler[handlerName](node, parent, prop, index);
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