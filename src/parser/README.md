# regexp-tree: Parser module

Parses a regexp string into an AST. See [the specification](https://github.com/DmitrySoshnikov/regexp-tree#ast-nodes-specification) for AST nodes format.

Example:

```js
console.log(regexpTreeParser.parse('/[a-z]+/'));
```

Result:

```js
{
  type: 'RegExp',
  body: {
    type: 'Repetition',
    expression: {
      type: 'CharacterClass',
      expressions: [
        {
          type: 'ClassRange',
          from: {
            type: 'Char',
            value: 'a',
            kind: 'simple'
          },
          to: {
            type: 'Char',
            value: 'z',
            kind: 'simple'
          }
        }
      ]
    },
    quantifier: {
      type: 'Quantifier',
      kind: '+',
      greedy: true
    }
  },
  flags: 'i',
}
```