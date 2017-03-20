# regexp-tree [![Build Status](https://travis-ci.org/DmitrySoshnikov/regexp-tree.svg?branch=master)](https://travis-ci.org/DmitrySoshnikov/regexp-tree) [![npm version](https://badge.fury.io/js/regexp-tree.svg)](https://badge.fury.io/js/regexp-tree)

Regular expressions parser

### Table of Contents

- [Installation](#installation)
- [Development](#development)
- [Usage as a CLI](#usage-as-a-cli)
- [Usage from Node](#usage-from-node)
- [Capturing locations](#capturing-locations)
- [AST nodes specification](#ast-nodes-specification)
  - [Char](#char)
    - [Simple char](#simple-char)
    - [Escaped char](#escaped-char)
    - [Meta char](#meta-char)
    - [Control char](#control-char)
    - [Hex char-code](#hex-char-code)
    - [Decimal char-code](#decimal-char-code)
    - [Octal char-code](#octal-char-code)
    - [Unicode](#unicode)
  - [Quantifiers](#quantifiers)
    - [? zero-or-one](#-zero-or-one)
    - [* zero-or-more](#-zero-or-more)
    - [+ one-or-more](#-one-or-more)
    - [Non-greedy](#non-greedy)

### Installation

The parser can be installed as an [npm module](https://www.npmjs.com/package/regexp-tree):

```
npm install -g regexp-tree

regexp-tree --help
```

### Development

1. Fork https://github.com/DmitrySoshnikov/regexp-tree repo
2. Make your changes
3. Make sure `npm test` still passes (add new tests if needed)
4. Submit a PR

The _regexp-tree_ parser is implemented as an automatic LR parser using [Syntax](https://www.npmjs.com/package/syntax-cli) tool. The parser module is generated from the [regexp grammar](https://github.com/DmitrySoshnikov/regexp-tree/blob/master/regexp.bnf), which is based on the regular expressions grammar used in ECMAScript.

For development from the github repository, run `build` command to generate the parser module:

```
git clone https://github.com/<your-github-account>/regexp-tree.git
cd regexp-tree
npm install
npm run build

./bin/regexp-tree --help
```

> NOTE: You need to run `build` command every time you change the grammar file.

### Usage as a CLI

Check the options available from CLI:

```
regexp-tree --help
```

```
Usage: regexp-tree [options]

Options:
   -e, --expression   A regular expression to be parsed
   -l, --loc          Whether to capture AST node locations
```

To parse a regular expression, pass `-e` option:

```
regexp-tree -e '/a|b/i'
```

Which produces an AST node corresponding to this regular expression:

```js
{
  "type": "RegExp",
  "body": {
    "type": "Disjunction",
    "left": {
      "type": "Char",
      "value": "a",
      "kind": "simple"
    },
    "right": {
      "type": "Char",
      "value": "b",
      "kind": "simple"
    }
  },
  "flags": [
    "i"
  ]
}
```

> NOTE: the format of a regexp is `/ Body / OptionalFlags`.

### Usage from Node

The parser can also be used as a Node module:

```js
const regexpTree = require('regexp-tree');

const regexpString = (/a|b/i).toString();

console.log(regexpTree.parse(regexpString)); // RegExp AST
```

### Capturing locations

For source code transformation tools it might be useful also to capture _locations_ of the AST nodes. From the command line it's controlled via the '-l' option:

```
regexp-tree -e '/ab/' -l
```

This attaches `loc` object to each AST node:

```js
{
  "type": "RegExp",
  "body": {
    "type": "Alternative",
    "expressions": [
      {
        "type": "Char",
        "value": "a",
        "kind": "simple",
        "loc": {
          "start": 1,
          "end": 2
        }
      },
      {
        "type": "Char",
        "value": "b",
        "kind": "simple",
        "loc": {
          "start": 2,
          "end": 3
        }
      }
    ],
    "loc": {
      "start": 1,
      "end": 3
    }
  },
  "flags": [],
  "loc": {
    "start": 0,
    "end": 4
  }
}
```

From Node it's controlled via `setOptions` method exposed on the parser:

```js
const regexpTree = require('regexp-tree');

const parsed = regexpTree
  .setOptions({captureLocations: true})
  .parse('/a|b/');
```

### AST nodes specification

Below are the AST node types corresponding to different regular expressions sub-patterns:

#### Char

A basic building block, single character. Can be _escaped_, and be of different _kinds_.

##### Simple char

Basic _non-escaped_ char in a regexp:

```
z
```

Node:

```js
{
  type: 'Char',
  value: 'z',
  kind: 'simple'
}
```

> NOTE: to test this from CLI, the char should be in an actual regexp -- `/z/`.

##### Escaped char

```
\z
```

The same value, `escaped` flag is added:

```js
{
  type: 'Char',
  value: 'z',
  kind: 'simple',
  escaped: true
}
```

Escaping is mostly used with meta symbols:

```
// Syntax error
*
```

```
\*
```

OK, node:

```js
{
  type: 'Char',
  value: '*',
  kind: 'simple',
  escaped: true
}
```

##### Meta char

A _meta character_ should not be confused with an [escaped char](#escaped-char).

Example:

```
\n
```

Node:

```js
{
  type: 'Char',
  value: '\\n',
  kind: 'meta',
}
```

Among other meta character are: `\f`, `\r`, `\n`, `\t`, `\v`, `\0`, `[\b]` (backspace char), `\s`, `\S`, `\w`, `\W`, `\d`, `\D`.

> NOTE: `\b` and `\B` are parsed as `Assertion` node type, not `Char`.

##### Control char

A char preceded with `\c`, e.g. `\cx`, which stands for `CTRL+x`:

```
\cx
```

Node:

```js
{
  type: 'Char',
  value: '\\cx',
  kind: 'control',
}
```

##### HEX char-code

A char preceded with `\x`, followed by a HEX-code, e.g. `\x3B` (symbol `;`):

```
\x3B
```

Node:

```js
{
  type: 'Char',
  value: '\\x3B',
  kind: 'hex',
}
```

##### Decimal char-code

Char-code:

```
\42
```

Node:

```js
{
  type: 'Char',
  value: '\\42',
  kind: 'decimal',
}
```

##### Octal char-code

Char-code started with `\0`, followed by an octal number:

```
\073
```

Node:

```js
{
  type: 'Char',
  value: '\\073',
  kind: 'oct',
}
```

##### Unicode

Unicode char started with `\u`, followed by an hex number:

```
\u003B
\{u003B}
```

Node:

```js
{
  type: 'Char',
  value: '\\u003B',
  kind: 'unicode',
}
```

#### Quantifiers

Quantifiers specify _repetition_ if regular expression (or its part). Below are the quantifiers which wrap a parsed expression into a `Repetition` node.

##### ? zero-or-one

The `?` quantifier is short for `{0,1}`.

```
a?
```

Node:

```js
{
  type: 'Repetition',
  expression: {
    type: 'Char',
    value: 'a',
    kind: 'simple'
  },
  quantifier: {
    type: "?",
    greedy: true
  }
}
```

##### * zero-or-more

The `*` quantifier is short for `{0,}`.

```
a*
```

Node:

```js
{
  type: 'Repetition',
  expression: {
    type: 'Char',
    value: 'a',
    kind: 'simple'
  },
  quantifier: {
    type: "*",
    greedy: true
  }
}
```

##### + one-or-more

The `+` quantifier is short for `{1,}`.

```
// Same as `aa*`, or `a{1,}`
a+
```

Node:

```js
{
  type: 'Repetition',
  expression: {
    type: 'Char',
    value: 'a',
    kind: 'simple'
  },
  quantifier: {
    type: "+",
    greedy: true
  }
}
```

##### Non-greedy

If any quantifier is followed by the `?`, it turns the quantifier into a _non-greedy_ one. Examples: `a??`, `a+?`, `a*?`, `a{1,}?`, etc.

```
a+?
```

Node:

```js
{
  type: 'Repetition',
  expression: {
    type: 'Char',
    value: 'a',
    kind: 'simple'
  },
  quantifier: {
    type: "+",
    greedy: false
  }
}
```