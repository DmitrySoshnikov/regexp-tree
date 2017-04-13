# regexp-tree: Transform module

Transform module is a convenient wrapper on top of the _"parse-traverse-generate"_ tool chain. It accepts a regular expression in different formats (a string, an actual RegExp, or an AST), applies a set of tranformations, and returns a `TransformResult` object.

Example:

```js
const regexpTree = require('regexp-tree');

const re = regexpTree.transform('/[a-z]{1,}/', {

  /**
   * Handle "Quantifier" node type,
   * transforming `{1,}` quantifier to `+`.
   */
  Quantifier(path) {
    const {node} = path;

    // {1,} -> +
    if (
      node.type === 'Range' &&
      node.from === 1 &&
      !node.to
    ) {
      path.replace({
        type: 'Quantifier',
        kind: '+',
        greedy: node.greedy,
        loc: node.loc
          ? {start: node.loc.start, end: node.loc.start + 1}
          : null,
      });
    }
  },
});

console.log(re.toRegExp()); // /[a-z]+/
```

### API

The module has the following interface:

```js
type AST = Object;
type Handler = Object;

type RegExpIn = string | AST | RegExp;

type Handlers = Array<Handler> | Handler;

transform(regexp: RegExpIn, handlers: Handlers): TransformResult;
```

### TransformResult

An object of `TransformResult` has the following methods:

* `getAST` - returns the (transformed) AST component;
* `getBodyString` - returns body of a regexp as a string (can be passed to `RegExp` constructor);
* `getFlags` - returns flags of a regexp as a string (can be passed to `RegExp` constructor);
* `toRegExp` - returns a regular expression as a RegExp instance;
* `toString` - returns a regular expression as a string;
