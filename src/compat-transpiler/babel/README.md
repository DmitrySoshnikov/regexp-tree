# regexp-tree: babel-plugin-transform-modern-regexp

TODO

Applies [regexp-tree](https://www.npmjs.com/package/regexp-tree) compatibility transformations on JavaScript regular expressions.

## Examples

The "dotAll" `s` flag:


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

## Usage

### Via `.babelrc`

`.babelrc`

```json
{
  "plugins": ["transform-modern-regexp"]
}
```

### Via CLI

```sh
$ babel --plugins transform-modern-regexp script.js
```

### Via Node.js API

```js
require('babel-core').transform(code, {
  'plugins': ['transform-modern-regexp']
});
```