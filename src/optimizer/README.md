# regexp-tree: Optimizer module

Optimizer transforms your regexp into an _optimized_ version, replacing some sub-expressions with their idiomatic patterns. This might be good for different kinds of minifiers, as well as for regexp machines.

Example:

```js
/[a-zA-Z_0-9][a-zA-Z_0-9]*\e{1,}/
```

Is transformed into:

```js
/\w+e+/
```