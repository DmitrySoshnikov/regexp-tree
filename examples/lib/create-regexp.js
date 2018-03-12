const regexpTree = require('../../');

/**
 * regex: String representation 'abc' or RegExp object /abc/
 *        Accepts most of the Python syntax as well.
 *
 * Returns a JS RegExp, or throws.
 */
function createRegExp(regex) {
	let pattern = regex.source || regex;

  // JS/regexpTree doesn't support lookbehind assertions.
	if (pattern.match(/\(\?<=/) || pattern.match(/\(\?<!/)) {
		throw 'Unsupported: lookbehind assertions';
	}

  /* Convert Python syntax to the regexpTree regex syntax. */

	// Named capture groups.
	pattern = pattern.replace(/\(\?P(<(?:.*?)>.*?)\)/g, function(str, group1) {
		return `(?${group1})`;
	});

	// Remove comments.
	pattern = pattern.replace(/\(\?#.*?\)/g, function(str, group1) {
		return '';
	});

	let reOrPattern;
	try {
		reOrPattern = new RegExp(pattern);
	}
	catch (e) {
		/* Set reOrPattern to pattern, escaping every un-escaped / character. */
		escapedPatternChars = [];
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
			}
			else {
				escapedPatternChars.push(pattern[i]);
			}
		}

		reOrPattern = `/${escapedPatternChars.join('')}/`;
	}

	// Transpile Python-esque syntax (named groups, etc.?) to JS-friendly.
	let transpiledRE;
	try {
		transpiledRE = regexpTree.compatTranspile(reOrPattern).toRegExp();
	}
	catch (e) {
		console.error(`Unparseable: ${reOrPattern}`);
		throw e;
	}

	return transpiledRE;
}

module.exports = createRegExp;
