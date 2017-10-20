/**
 * The MIT License (MIT)
 * Copyright (c) 2015-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const Table = require('cli-table2');

/**
 * Wrapper class over `cli-table2` with default options preset.
 */
class TablePrinter extends Table {
  constructor(options) {
    options = Object.assign({}, options, {
      style: {
        head: ['blue'],
        border: ['gray'],
      },
    });
    super(options);
  }
}

module.exports = TablePrinter;