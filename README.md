# regexp-tree
Regular expressions parser

### Table of Contents

- [Installation](#installation)
- [Development](#development)
- [Usage as a CLI](#usage-as-a-cli)
- [Usage from Node](#usage-from-node)
- [Capturing locations](#capturing-locations)
- [AST nodes specification](#ast-nodes-specification)

### Installation

The parser can be installed as an NPM module:

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

> NOTE: the format of a regexp should be `/Body/Flags`. The flags can be optional.

### AST nodes specification

Below are the AST node types corresponding to different regular expressions sub-patterns:

TODO
