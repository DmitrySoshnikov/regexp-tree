/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

/**
 * NodePath class encapsulates a traversing node,
 * its parent node, property name in the parent node, and
 * an index (in case if a node is part of a collection).
 * It also provides set of methods for AST manipulation.
 */
module.exports = class NodePath {
  /**
   * NodePath constructor.
   *
   * @param Object node - an AST node
   * @param NodePath parentPath - a nullable parent path
   * @param string property - property name of the node in the parent
   * @param number index - index of the node in a collection.
   */
  constructor(
    node,
    parentPath = null,
    property = null,
    index = null
  ) {
    this.node = node;
    this.parentPath = parentPath;
    this.parent = parentPath ? parentPath.node : null;
    this.property = property;
    this.index = index;
  }

  /**
   * Removes a node.
   */
  removeNode() {
    this.node = null;

    if (!this.parent) {
      return;
    }

    // A node is in a collection.
    if (this.index != null) {
      this.parent[this.property].splice(this.index, 1);
      return;
    }

    // A simple node.
    delete this.parent[this.property];
  }

  /**
   * Replaces a node with the passed one.
   */
  replaceNode(newNode) {
    this.node = newNode;

    if (this.parent) {
      this.parent[this.property] = newNode;
    }
  }
}
