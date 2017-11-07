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
            symbol: 'a',
            kind: 'simple',
            codePoint: 97
          },
          to: {
            type: 'Char',
            value: 'z',
            symbol: 'z',
            kind: 'simple',
            codePoint: 122
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