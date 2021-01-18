# regexp-tree: Optimizer module

## Overview

Optimizer transforms your regexp into an _optimized_ version, replacing some sub-expressions with their idiomatic patterns.

Advantages:
- Optimized regexps are smaller -- good for minification.
- Optimized regexps may be easier to read.
- Some optimizations will reduce your risk of REDOS.

Example:

```js
/[a-zA-Z_0-9][A-Z_\da-z]*\e{1,}/
```

becomes:

```js
/\w+e+/
```

## API

`optimize(regexp, {whitelist: [transformsWhitelist], blacklist: [transformsWhitelist]})`: Optimize the regexp. Optionally request specific transforms.

Note that this API of the optimizer differs from the API of `regexp-tree`'s `optimize`
method which instead expects its first argument to be an array (the `whitelist`) and
its second argument as an object with `blacklist` as a property.

Transforms will be applied until no further optimization progress is made.

If you wish to specify a whitelist, give an array of transform names from the table below.

```js
const optimizer = require('./index.js');
const inefficient = /[0-9]/;

const optimized1 = optimizer.optimize(inefficient);
const optimized2 = optimizer.optimize(inefficient, {
  whitelist: [
    'charClassToMeta',       // [0-9] -> [\d]
    'charClassToSingleChar', // [\d] -> \d
  ]
});

console.log(`${inefficient} -> ${optimized1} === ${optimized2}`);
```

You can also add a `blacklist`, e.g., to disable the defaults (which are all enabled if no whitelist is provided):

```js
const optimizer = require('./index.js');

const original = /[åä]/;
const optimized = /[åä]/;


const optimized1 = optimizer.optimize(original); // [åä] -> [äå]
const optimized2 = optimizer.optimize(original, { // [åä] (does not change)
  blacklist: [
    'charClassClassrangesMerge'
  ]
});
```

### Transforms

Here is the list of transforms supported by the Optimizer module.

|  Transform name                                       | Description                                                    | Example                       |
|-------------------------------------------------------|----------------------------------------------------------------|-------------------------------|
| charSurrogatePairToSingleUnicode                      | Unicode pairs to single Unicode char                           | `\ud83d\ud380` -> `\u{1f680}` |
| charCodeToSimpleChar                                  | Don't use fancy char codes unless we have to                   | `\u0061` -> `a`               |
| charCaseInsensitiveLowerCaseTransform                 | If regex is case insensitive, use lower-case everywhere        |  `/Aa/i` -> `/aa/i`           |
| charClassRemoveDuplicates                             | Remove duplicates from char classes                            |  `[\d\d]` -> `[\d]`           |
| quantifiersMerge                                      | Merge quantifiers where possible                               |  `a{1,2}a{2,3}` -> `a{3,5}`   |
| quantifierRangeToSymbol                               | Reduce visual of quantifier ranges                             |  `a{1,}` -> `a+`              |
| charClassClassrangesToChars                           | Replace char class ranges with chars                           |  `[a-a]` -> `[a]`             |
| charClassClassrangesMerge                             | Merge adjacent class ranges                                    |  `[a-de-f]` -> `[a-f]`        |
| charClassToMeta                                       | Use meta-chars like `\d` and \`w` where possible               |  `[0-9]` -> `[\d]`            |
| charClassToSingleChar                                 | Replace a char class with a single meta-char where possible    |  `[\d]` -> `\d`               |
| charEscapeUnescape                                    | Remove unnecessary escapes                                     |  `\e` -> `e`                  |
| disjunctionRemoveDuplicates\*                         | Remove duplicate disjunctions                                  |  `(ab\|ab)` -> `(ab)`         |
| groupSingleCharsToCharClass\*                         | Reduce disjunction complexity                                  |  `(a\|b\|c)` -> `[abc]`       |
| removeEmptyGroup                                      | Remove empty groups                                            |  `(?:)a` -> `a`               |
| ungroup                                               | Remove unnecessary groups                                      |  `(?:a)` -> `a`               |
| combineRepeatingPatterns                              | Replace repetition with quantifiers where possible             |  `abcabcabc` -> `(?:abc){3}`  |

\*: May reduce the risk of REDOS in your regexes.
