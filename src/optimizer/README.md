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

**Optimizations applied:**

- `aa*` -> `a+`
- `()`, `(?:)` - `<empty>` (remove empty groups)
- `a{1,}` -> `a+`
- `a{1}` -> `a`
- `a{3,3}` -> `a{3}`
- `[a-zA-Z_0-9]` -> `\w`
- `[^a-zA-Z_0-9]` -> `\W`
- `[\d\d]` -> `[\d]` (remove duplicates from char-class)
- `[\d]` -> `\d` (remove char class for single char)
- `[0-9]` -> `\d`
- `[^0-9]` -> `\D`
- `[ \t\r\n\f]` -> `\s`
- `[^ \t\r\n\f]` -> `\S`
- `\e` -> `e` (remove unnecessary escape)
- ...
