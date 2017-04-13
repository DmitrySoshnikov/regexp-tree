# regexp-tree: Compatibility transpiler

The _compat-transpiler_ module translates your regexp in new format or in new syntax, into an equivalent regexp in a legacy representation, so it can be used in engines which don't yet implement the new syntax.

Example, "dotAll" `s` flag:


```js
/./s
```

Is translated into:

```js
/[\0-\uFFFF]/
```

Or named capturing groups:

```js
/(?<value>a)\k<value>\1/
```

Becomes:

```js
/(a)\1\1/
```

Thus, the information about processed group names is stored on the transform result, and can be further analyzed in other modules.