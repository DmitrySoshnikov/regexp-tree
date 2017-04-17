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

## API

* `compatTranspiler.transform(regexp [, whitelist])` - transforms a regular expressions applying compatibility transforms (can be passed as `whitelist` parameter).

```js
compatTranspiler.transform('/./s', ['dotAll']);
```

If whitelist is not passed, all transforms are applied.

Available transforms are:

* `dotAll` - translates `/./s` into `/[\0-\uFFFF]/`
* `namedCapturingGroups` - transforms `/(?<name>a)\k<name>/` into `/(a)\1/`

## Babel plugin

The _compat-transpiler_ module is also available as a _Babel plugin_, which can be installed at: [babel-plugin-transform-modern-regexp](https://www.npmjs.com/package/babel-plugin-transform-modern-regexp).

Note, the plugin also includes [extended regexp](https://github.com/dmitrysoshnikov/regexp-tree#regexp-extensions) features.