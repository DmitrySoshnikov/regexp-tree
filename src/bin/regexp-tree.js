/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

function main() {
  console.info(`
  =========================================================
  * CLI commands are moved to the \x1b[1mregexp-tree-cli\x1b[0m package *
  =========================================================

  \x1b[1mInstallation:\x1b[0m

    npm install -g regexp-tree-cli

  \x1b[1mUsage:\x1b[0m

    regexp-tree-cli --help
  `);
}

module.exports = main;

if (require.main === module) {
  main();
}
