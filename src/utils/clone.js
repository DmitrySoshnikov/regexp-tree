/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

/**
 * Performs a deep copy of an simple object.
 * Only handles scalar values, arrays and objects.
 *
 * @param obj Object
 */
module.exports = function clone (obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  let res;
  if (Array.isArray(obj)) {
    res = [];
  } else {
    res = {};
  }
  for (let i in obj) {
    res[i] = clone(obj[i]);
  }
  return res;
};