/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

module.exports = [
  // aa* -> a+
  require('./char-star-to-plus-transform'),

  // [0-9] -> [\d]
  require('./char-class-to-meta-transform'),
];