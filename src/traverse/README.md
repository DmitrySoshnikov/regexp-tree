# regexp-tree: Traverse module

Provides traversal API with _vistor_ pattern for regexp ASTs. See [the specification](https://github.com/DmitrySoshnikov/regexp-tree#ast-nodes-specification) for AST nodes format.

Once a regular expression is parsed, it is possible to handle needed nodes by using traversal API. Handlers receive an instance of `NodePath` class, which encapsulates `node` itself, and other convenient properties, and methods.

```js
const regexpTree = require('regexp-tree');

// Get AST.
const ast = regexpTree.parse('/[a-z]{1,}/');

// Handle nodes.
regexpTree.traverse(ast, {

  // Handle "Quantifier" node type,
  // transforming `{1,}` quantifier to `+`.
  Quantifier({node}) {
    // {1,} -> +
    if (
      node.kind === 'Range' &&
      node.from === 1 &&
      !node.to
    ) {
      node.kind = '+';
      delete node.from;
    }
  },
});

// Generate the regexp.
const re = regexpTree.generate(ast);

console.log(re); // '/[a-z]+/'
```
### NodePath class

A instance of the `NodePath` class is a convenient _wrapper_ on top an AST `node` itself, its `parent` node, and `parentPath`, the `property` name of the node used in parent, and also an `index` of the node in case if the node is a part of a collection. It also provides a list of useful method for AST manipulation.

Properties of the `NodePath`:

* `node` - an actual AST node;
* `parent` - an immediate parent AST node;
* `parentPath` - a parent `NodePath`. Parent paths are chained: `parentPath.parentPath. ...` gives you an access to a needed parent level;
* `property` - the property name of the node used in the parent node;
* `index` - the index of the node, in case if the node is a part of a collection.

Methods of the `NodePath`:

* `remove()` - removes a node;
* `replace(node: Object)` - replaces a node with the passed one;
* `update(nodeProps: Object)` - updates a node inline;
* `getPreviousSibling()` - returns previous sibling path;
* `getNextSibling()` - returns next sibling path;
* `getChild(n: Number = 0)` - return `n`th child path;
* `getParent()` - return parent path, for consistency, returns parentPath;
