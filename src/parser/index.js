/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const regexpTreeParser = require('./generated/regexp-tree');

// By default do not capture locations; callers may override.
regexpTreeParser.setOptions({captureLocations: false});

module.exports = regexpTreeParser;
