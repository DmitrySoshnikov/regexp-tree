# regexp-tree: Code generator module

Generates a regexp string from an AST. See [the specification](https://github.com/DmitrySoshnikov/regexp-tree#ast-nodes-specification) for AST nodes format.

Example:

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