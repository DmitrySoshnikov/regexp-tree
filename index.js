/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const regexpTree = require('./generated/regexp-tree');

// By default do not capture locations; callers may override.
regexpTree.setOptions({captureLocations: false});

module.exports = regexpTree;