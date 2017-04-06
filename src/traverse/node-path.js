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
class NodePath {
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

      // We should rebuild index of further node paths.
      // Note: because of this, `remove` might be an expensive operation
      // on long sequences.
      const parentPath = NodePath.getForNode(this.parent);

      for (let i = 0; i < this.parent[this.property].length; i++) {
        const path = NodePath.getForNode(
          this.parent[this.property][i],
          parentPath,
          this.property,
          i
        );
        path.index = i;
      }

      this.index = null;
      this.property = null;

      return;
    }

    // A simple node.
    delete this.parent[this.property];
    this.property = null;
  }

  /**
   * Whether the path was removed.
   */
  isRemoved() {
    return this.node === null;
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
   * Returns previous sibling.
   */
  getPreviousSibling() {
    if (!this.parent || this.index == null) {
      return null;
    }
    return NodePath.getForNode(
      this.parent[this.property][this.index - 1],
      NodePath.getForNode(this.parent),
      this.property,
      this.index - 1
    );
  }

  /**
   * Returns next sibling.
   */
  getNextSibling() {
    if (!this.parent || this.index == null) {
      return null;
    }
    return NodePath.getForNode(
      this.parent[this.property][this.index + 1],
      NodePath.getForNode(this.parent),
      this.property,
      this.index + 1
    );
  }

  /**
   * Returns a NodePath instance for a node.
   *
   * The same NodePath can be reused in several places, e.g.
   * a parent node passed for all its children.
   */
  static getForNode(node, parentPath = null, prop = null, index = null) {
    if (!node) {
      return null;
    }

    if (!NodePath.registry.has(node)) {
      NodePath.registry.set(
        node,
        new NodePath(node, parentPath, prop, index)
      );
    }

    return NodePath.registry.get(node);
  }

  /**
   * Initializes the NodePath registry. The registry is a map from
   * a node to its NodePath instance.
   */
  static initRegistry() {
    if (!NodePath.registry) {
      NodePath.registry = new Map();
    }
    NodePath.registry.clear();
  }
}

NodePath.initRegistry();

module.exports = NodePath;
