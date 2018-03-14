const regexpTree = require('../../');

/**
 * regex: String representation 'abc' or RegExp object /abc/
 *        Accepts most of the Python syntax as well.
 *
 * Returns a JS RegExp as transpiled by regexpTree, or throws.
 */
function createRegExp(regex) {
  let pattern = regex.source || regex;

  // JS/regexpTree doesn't support lookbehind assertions.
  if (pattern.match(/\(\?<=/) || pattern.match(/\(\?<!/)) {
    throw 'Unsupported: lookbehind assertions';
  }

  /* Convert Python syntax to the regexpTree regex syntax.
   * NB This is not a sound parser due to possible escape chars, but it's probably fine. */

  // Named capture groups in regexpTree style.
  pattern = pattern.replace(/\(\?P(<(?:.*?)>.*?)\)/g, (str, group1) => {
    return `(?${group1})`;
  });

  // Remove Python comments.
  pattern = pattern.replace(/\(\?#.*?\)/g, () => {
    return '';
  });

  let reOrPattern;
  try {
    reOrPattern = new RegExp(pattern);
  } catch (e) {
    /* Set reOrPattern to pattern, escaping every un-escaped / character. */

    let escapedPatternChars = []; // The pattern chars, with escapes added as needed.
    let isEscaped = false;
    for (let i = 0; i < pattern.length; i++) {
      if (isEscaped) {
        escapedPatternChars.push(pattern[i]);
        isEscaped = false;
        continue;
      }

      if (pattern[i] === '\\') {
        escapedPatternChars.push(pattern[i]);
        isEscaped = true;
        continue;
      }

      if (pattern[i] === '/') {
        escapedPatternChars.push('\\');
        escapedPatternChars.push('/');
      } else {
        escapedPatternChars.push(pattern[i]);
      }
    }

    reOrPattern = `/${escapedPatternChars.join('')}/`;
  }

  // Transpile Python-esque syntax (named groups, etc.?) to JS-friendly.
  let transpiledRE;
  try {
    transpiledRE = regexpTree.compatTranspile(reOrPattern).toRegExp();
  } catch (e) {
    throw e;
  }

  return transpiledRE;
}

module.exports = createRegExp;
