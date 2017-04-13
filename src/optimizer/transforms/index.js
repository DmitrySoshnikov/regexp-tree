/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

module.exports = [
  // [\d\d] -> [\d]
  require('./char-class-remove-duplicates-transform'),

  // a{1,} -> a+, a{3,3} -> a{3}, a{1} -> a
  require('./quantifier-range-to-symbol-transform'),

  // [0-9] -> [\d]
  require('./char-class-to-meta-transform'),

  // [\d] -> \d, [^\w] -> \W
  require('./char-class-to-single-char-transform'),

  // aa* -> a+
  require('./char-star-to-plus-transform'),

  // \e -> e
  require('./char-escape-unescape-transform'),
];