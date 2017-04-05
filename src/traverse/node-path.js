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
  remove() {
    this.node = null;

    if (!this.parent) {
      return;
    }

    // A node is in a collection.
    if (this.index !== null) {
      this.parent[this.property].splice(this.index, 1);
      return;
    }

    // A simple node.
    delete this.parent[this.property];
  }

  /**
   * Replaces a node with the passed one.
   */
  replace(newNode) {
    this.node = newNode;

    if (!this.parent) {
      return;
    }

    // A node is in a collection.
    if (this.index !== null) {
      this.parent[this.property][this.index] = newNode;
      return;
    }

    // A simple node.
    this.parent[this.property] = newNode;
  }

  /**
   * Updates a node inline.
   */
  update(nodeProps) {
    Object.assign(this.node, nodeProps);
  }

  /**
   * Returns previous sibling (only for nodes which are part of a collection).
   */
  getPreviousSiblingNode() {
    if (!this.parent || this.index == null) {
      return null;
    }
    return this.parent[this.property][this.index - 1] || null;
  }

  /**
   * Returns previous sibling (only for nodes which are part of a collection).
   */
  getNextSiblingNode() {
    if (!this.parent || this.index == null) {
      return null;
    }
    return this.parent[this.property][this.index + 1] || null;
  }
}
