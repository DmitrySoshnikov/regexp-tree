/**
 * The MIT License (MIT)
 * Copyright (c) 2015-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const Table = require('cli-table3');

/**
 * Wrapper class over `cli-table3` with default options preset.
 */
class TablePrinter {
  constructor(options) {
    return new Table(
      Object.assign({}, options, {
        style: {
          head: ['blue'],
          border: ['gray'],
        },
      })
    );
  }
}

module.exports = TablePrinter;
