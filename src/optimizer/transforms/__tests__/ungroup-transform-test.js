/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const ungroup = require('../ungroup-transform');

describe('ungroup', () => {

  it('ungroups simple groups', () => {
    const re = transform(/(?:a)/, [
      ungroup,
    ]);
    expect(re.toString()).toBe('/a/');

    const re2 = transform(/a(?:[\da]b)c/, [
      ungroup,
    ]);
    expect(re2.toString()).toBe('/a[\\da]bc/');
  });

  it('ungroups disjunctions if top-level', () => {
    const re = transform(/(?:ab|bc)/, [
      ungroup,
    ]);
    expect(re.toString()).toBe('/ab|bc/');
  });

  it('does not ungroup other disjunctions', () => {
    const re = transform(/^(?:ab|bc)/, [
      ungroup,
    ]);
    expect(re.toString()).toBe('/^(?:ab|bc)/');
  });

  it('ungroups groups with quantifier if child is a Char', () => {
    const re = transform(/(?:a)+/, [
      ungroup,
    ]);
    expect(re.toString()).toBe('/a+/');
  });

  it('ungroups groups with quantifier if child is a CharacterClass', () => {
    const re = transform(/(?:[ab])+/, [
      ungroup,
    ]);
    expect(re.toString()).toBe('/[ab]+/');
  });

  it('does not ungroup groups with quantifier otherwise', () => {
    const re = transform(/(?:ab)+/, [
      ungroup,
    ]);
    expect(re.toString()).toBe('/(?:ab)+/');
  });

  it('does not ungroup capturing groups', () => {
    const re = transform(/(a)/, [
      ungroup,
    ]);
    expect(re.toString()).toBe('/(a)/');
  });

  it('does not ungroup empty groups', () => {
    const re = transform(/(?:)+/, [
      ungroup,
    ]);
    expect(re.toString()).toBe('/(?:)+/');
  });

});