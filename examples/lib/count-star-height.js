/**
 * The MIT License (MIT)
 */

/* Author: Jamie Davis <davisjam@vt.edu>
 * Description: Lib to count the star height of a regex.
 *              This is a correct and improved version of substack's safe-regex.
 *
 * Star height is a heuristic for REDOS (exponential blow-up).
 */

const createRegExp = require('./create-regexp');
const regexpTree = require('../../');

/**
 * regex: String representation 'abc' or RegExp object /abc/
 *        Accepts most of the Python syntax as well.
 * options: optional -- clarify what counts as 'star height'
 *          Keys:
 *            countQuestionMarks -- (a+)? is not really a problem
 *              default false (i.e. ignore ?'s)
 *            minimumRepetitionUpperLimit -- a{0,3} is probably OK, a{0,50} is not.
 *              default 0 (i.e. all of {x}, {x,}, {,x}, {x,y} are problematic)
 *
 * Returns the regex's star height: an integer >= 0.
 */
function countStarHeight(regex, options) {
  /* Get an ast. */
  const re = createRegExp(regex);
  const ast = regexpTree.parse(re);

  /* Options. */
  const defaultCountQuestionMarks = false;
  const defaultMinimumRepetitionUpperLimit = 0;
  if (!options) {
    options = {};
  }
  // Apply defaults.
  if (!options.countQuestionMarks) {
    options.countQuestionMarks = defaultCountQuestionMarks;
  }
  if (!options.minimumRepetitionUpperLimit) {
    options.minimumRepetitionUpperLimit = defaultMinimumRepetitionUpperLimit;
  }

  /* Here we go! */

  let currentStarHeight = 0;
  let maxObservedStarHeight = 0;

  regexpTree.traverse(ast, {
    'Repetition': {
      pre({node}) {
        // Optional things to ignore
        if (node.quantifier && node.quantifier.kind === '?' && !options.countQuestionMarks) {
          return;
        } else if (node.quantifier.kind === 'Range' &&
                   (!('to' in node.quantifier) || node.quantifier.to < options.minimumRepetitionUpperLimit))
        {
          return;
        }

        currentStarHeight++;
        if (maxObservedStarHeight < currentStarHeight) {
          maxObservedStarHeight = currentStarHeight;
        }
      },
      post({node}) {
        if (node.quantifier && node.quantifier.kind === '?' && !options.countQuestionMarks) {
          return;
        }
        else if (node.quantifier.kind === 'Range' &&
                 (!('to' in node.quantifier) || node.quantifier.to < options.minimumRepetitionUpperLimit)) {
          return;
        }

        currentStarHeight--;
      }
    },
  });

  return maxObservedStarHeight;
}

module.exports = countStarHeight;
