# regexp-tree: Traverse module

Provides traversal API with _vistor_ pattern for regexp ASTs. See [the specification](https://github.com/DmitrySoshnikov/regexp-tree#ast-nodes-specification) for AST nodes format.

Once a regular expression is parsed, it is possible to handle needed nodes by using traversal API:

```js
const regexpTree = require('regexp-tree');

// Get AST.
const ast = regexpTree.parse('/[a-z]{1,}/');

// Handle nodes.
regexpTree.traverse(ast, {

  // Handle "Quantifier" node type,
  // transforming `{1,}` quantifier to `+`.
  onQuantifier(node) {
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