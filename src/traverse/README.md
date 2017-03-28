# regexp-tree: Traverse module

Provides a _vistor_ pattern traversal API for a regexp AST. See [the specification](https://github.com/DmitrySoshnikov/regexp-tree#ast-nodes-specification) for AST nodes format.

Once a regular expression is parsed, it is possible to handle needed nodes by using traversal API. E.g. the [generator](https://github.com/DmitrySoshnikov/regexp-tree/tree/master/src/generator) module uses traversal API to generate a regexp string from an AST.

Example:

```js
const regexpTree = require('regexp-tree');

// Get AST.
const ast = regexpTree.parse('/[a-z]{1,}/');

// Handle nodes.
regexpTree.traverse(ast, {

  // Handle "Repetition" node type,
  // transforming `{1,}` quantifier to `+`.
  onRepetition(node) {
    const {quantifier} = node;

    // {1,} -> +
    if (
      quantifier.type === 'Range' &&
      quantifier.from === 1 &&
      !quantifier.to
    ) {
      node.quantifier = {
        type: '+',
        greedy: quantifier.greedy,
      };
    }
  },
});

// Generate the regexp.
const re = regexpTree.generate(ast);

console.log(re); // '/[a-z]+/'
```