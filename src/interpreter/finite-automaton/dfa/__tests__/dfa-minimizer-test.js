/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const DFAMinimizer = require('../dfa-minimizer');
const fa = require('../../index');

function testMinimization({
  regexp,
  originalTable,
  minimizedTable,
  newAcceptingStates,
}) {
  const dfa = fa.toDFA(regexp);
  expect(dfa.getTransitionTable()).toEqual(originalTable);

  const minimized = DFAMinimizer.minimize(dfa);

  expect(minimized.getTransitionTable()).toEqual(minimizedTable);
  expect(minimized.getAcceptingStateNumbers()).toEqual(newAcceptingStates);
}

describe('dfa-minimizer', () => {

  it('a|b', () => {
    testMinimization({
      regexp: /a|b|c|d/,
      originalTable: {
        1: {a: 5, b: 4, c: 3, d: 2},
        2: {},
        3: {},
        4: {},
        5: {},
      },
      minimizedTable: {
        1: {a: 2, b: 2, c: 2, d: 2},
        2: {},
      },
      newAcceptingStates: new Set([2]),
    });
  });

  it('a*', () => {
    testMinimization({
      regexp: /a*/,
      originalTable: {
        1: {a: 2},
        2: {a: 2},
      },
      minimizedTable: {
        1: {a: 1},
      },
      newAcceptingStates: new Set([1]),
    });
  });

  it('aa*', () => {
    testMinimization({
      regexp: /aa*/,
      originalTable: {
        1: {a: 2},
        2: {a: 3},
        3: {a: 3},
      },
      minimizedTable: {
        1: {a: 2},
        2: {a: 2},
      },
      newAcceptingStates: new Set([2]),
    });
  });

  it('ab', () => {
    testMinimization({
      regexp: /ab/,
      originalTable: {
        1: {a: 3},
        2: {},
        3: {b: 2},
      },
      // Stays the same, already minimal.
      minimizedTable: {
        1: {a: 3},
        2: {},
        3: {b: 2},
      },
      newAcceptingStates: new Set([2]),
    });
  });

});