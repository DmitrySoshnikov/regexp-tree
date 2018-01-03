/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const shell = require('shelljs');

// Rebuild parser.
shell.exec(`node node_modules/syntax-cli/bin/syntax -g src/parser/regexp.bnf -o src/parser/generated/regexp-tree.js -m lalr1 --loc`);

// Transform code for older Node versions.
shell.exec(`node node_modules/.bin/babel ${process.argv[2] || ''} src/ --out-dir dist/ --ignore __tests__`);

// Setup pre-commit hook.
if (!shell.test('-f', '.git/hooks/pre-commit')) {
  shell.ln('-s', '../../scripts/git-pre-commit', '.git/hooks/pre-commit');
}

// Setup pre-push hook.
if (!shell.test('-f', '.git/hooks/pre-push')) {
  shell.ln('-s', '../../scripts/git-pre-push', '.git/hooks/pre-push');
}