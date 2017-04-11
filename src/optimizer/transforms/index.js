/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

module.exports = [
  // [\d\d] -> [\d]
  require('./char-class-remove-duplicates-transform'),

  // aa* -> a+
  require('./char-star-to-plus-transform'),

  // [0-9] -> [\d]
  require('./char-class-to-meta-transform'),

  // [\d] -> \d, [^\w] -> \W
  require('./char-class-to-single-char-transform'),
];