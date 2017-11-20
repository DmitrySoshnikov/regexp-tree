/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

module.exports = {
  // [\d\d] -> [\d]
  'charClassRemoveDuplicates': require('./char-class-remove-duplicates-transform'),

  // a{1,2}a{2,3} -> a{3,5}
  'quantifiersMerge': require('./quantifiers-merge-transform'),

  // a{1,} -> a+, a{3,3} -> a{3}, a{1} -> a
  'quantifierRangeToSymbol': require('./quantifier-range-to-symbol-transform'),

  // [0-9] -> [\d]
  'charClassToMeta': require('./char-class-to-meta-transform'),

  // [\d] -> \d, [^\w] -> \W
  'charClassToSingleChar': require('./char-class-to-single-char-transform'),

  // \e -> e
  'charEscapeUnescape': require('./char-escape-unescape-transform'),

  // (ab|ab) -> (ab)
  'disjunctionRemoveDuplicates': require('./disjunction-remove-duplicates-transform'),

  // (a|b|c) -> [abc]
  'groupSingleCharsToCharClass': require('./group-single-chars-to-char-class'),

  // (?:)a -> a
  'removeEmptyGroup': require('./remove-empty-group-transform'),

  // (?:a) -> a
  'ungroup': require('./ungroup-transform'),

  // abcabcabc -> (?:abc){3}
  'combineRepeatingPatterns': require('./combine-repeating-patterns-transform')
};