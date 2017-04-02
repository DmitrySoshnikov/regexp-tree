# regexp-tree: Transform module

Transform module is a convenient wrapper on top of the _"parse-traverse-generate"_ tool chain. In addition to traversal, it provides useful API methods for manipulating, and actual transformation of the AST nodes.

TODO

Example:

```js
const regexpTree = require('regexp-tree');

const re = regexpTree.transform('/[a-z]{1,}/',
  api => ({
    // Handle "Quantifier" node type,
    // transforming `{1,}` quantifier to `+`.
    onQuantifier(node) {
      // {1,} -> +
      if (
        node.type === 'Range' &&
        node.from === 1 &&
        !node.to
      ) {
        api.replaceNode(node, {
          type: 'Quantifier',
          kind: '+',
          loc: {
            start: node.loc.start,
            end: node.loc.start + 1,
          },
        });
      }
    },
  }),
});

console.log(re.toRegExp()); // /[a-z]+/
```