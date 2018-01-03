'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The MIT License (MIT)
 * Copyright (c) 2015-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

var Table = require('cli-table2');

/**
 * Wrapper class over `cli-table2` with default options preset.
 */

var TablePrinter = function (_Table) {
  _inherits(TablePrinter, _Table);

  function TablePrinter(options) {
    _classCallCheck(this, TablePrinter);

    options = Object.assign({}, options, {
      style: {
        head: ['blue'],
        border: ['gray']
      }
    });
    return _possibleConstructorReturn(this, (TablePrinter.__proto__ || Object.getPrototypeOf(TablePrinter)).call(this, options));
  }

  return TablePrinter;
}(Table);

module.exports = TablePrinter;