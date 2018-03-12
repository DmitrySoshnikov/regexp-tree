#!/usr/bin/env node
/* Author: Jamie Davis <davisjam@vt.edu>
 * Description: CLI to count the star height of a regex.
 *              This is a correct and improved version of substack's safe-regex.
 *
 * Star height is a heuristic for REDOS (exponential blow-up).
 */

const countStarHeight = require('./lib/count-star-height.js'),
      fs = require('fs');

if (process.argv.length !== 3) {
	console.log(`Usage: ${process.argv[1]} pattern.json (keys: pattern [options -- keys: countQuestionMarks minimumRepetitionUpperLimit])`);
	process.exit(1);
}

const file = process.argv[2];
const content = fs.readFileSync(file);
const obj = JSON.parse(content);

try {
	const starHeight = countStarHeight(obj.pattern, obj.options);
	obj.starHeight = starHeight;
}
catch (e) {
  console.error(e);
	obj.starHeight = 'UNKNOWN';
}

console.log(JSON.stringify(obj));
process.exit(0);
