/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const parser = require('../../parser');
const transformUtils = require('../utils');

describe('transform-utils', () => {

  it('disjunctionToList', () => {
    const disjunction = parser.parse('/a|b|c|d/').body;
    const list = transformUtils.disjunctionToList(disjunction);

    expect(list).toEqual([
      disjunction.left.left.left,  // a
      disjunction.left.left.right, // b
      disjunction.left.right,      // c
      disjunction.right,           // d
    ]);
  });

  it('handles empty parts', () => {
    const disjunction = parser.parse('/|/').body;
    const list = transformUtils.disjunctionToList(disjunction);
    expect(list).toEqual([
      disjunction.left, // null
      disjunction.right // null
    ]);
  });

  it('disjunctionToList', () => {
    const list = [
      {type: 'Char', value: 'a', kind: 'simple', codePoint: 97, symbol: 'a'},
      {type: 'Char', value: 'b', kind: 'simple', codePoint: 98, symbol: 'b'},
      {type: 'Char', value: 'c', kind: 'simple', codePoint: 99, symbol: 'c'},
      {type: 'Char', value: 'd', kind: 'simple', codePoint: 100, symbol: 'd'},
    ];

    const disjunction = transformUtils.listToDisjunction(list);
    const expected = parser.parse('/a|b|c|d/').body;

    expect(disjunction).toEqual(expected);
  });

  it('increaseQuantifierByOne', () => {
    const quantifiers = [{
        type: 'Quantifier',
        kind: '*',
        greedy: true
    }, {
      type: 'Quantifier',
      kind: '+',
      greedy: false
    }, {
      type: 'Quantifier',
      kind: '?',
      greedy: true
    }, {
      type: 'Quantifier',
      kind: 'Range',
      from: 2,
      to: 2,
      greedy: true
    }, {
      type: 'Quantifier',
      kind: 'Range',
      from: 2,
      greedy: false
    }, {
      type: 'Quantifier',
      kind: 'Range',
      from: 2,
      to: 3,
      greedy: true
    }];
    const quantifiersIncreased = [{
      type: 'Quantifier',
      kind: '+',
      greedy: true
    }, {
      type: 'Quantifier',
      kind: 'Range',
      from: 2,
      greedy: false
    }, {
      type: 'Quantifier',
      kind: 'Range',
      from: 1,
      to: 2,
      greedy: true
    }, {
      type: 'Quantifier',
      kind: 'Range',
      from: 3,
      to: 3,
      greedy: true
    }, {
      type: 'Quantifier',
      kind: 'Range',
      from: 3,
      greedy: false
    }, {
      type: 'Quantifier',
      kind: 'Range',
      from: 3,
      to: 4,
      greedy: true
    }];

    quantifiers.forEach((quantifier, i) => {
      transformUtils.increaseQuantifierByOne(quantifier);
      expect(quantifier).toEqual(quantifiersIncreased[i])
    });
  });

});