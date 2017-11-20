/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const DFAMinimizer = require('../dfa-minimizer');
const fa = require('../../index');

describe('dfa-minimizer', () => {

  it('a|b', () => {
    const dfa = fa.toDFA(/a|b/);

    expect(dfa.getTransitionTable()).toEqual({
      1: {a: 3, b: 2},
      2: {},
      3: {},
    });

    const minimized = DFAMinimizer.minimize(dfa);

    expect(minimized.getTransitionTable()).toEqual({
      1: {a: 2, b: 2},
      2: {},
    });

    expect(minimized.getAcceptingStateNumbers()).toEqual(new Set([2]));
  });

  it('a*', () => {
    const dfa = fa.toDFA(/a*/);

    expect(dfa.getTransitionTable()).toEqual({
      1: {a: 2},
      2: {a: 2},
    });

    const minimized = DFAMinimizer.minimize(dfa);

    expect(minimized.getTransitionTable()).toEqual({
      1: {a: 1},
    });
  });

});