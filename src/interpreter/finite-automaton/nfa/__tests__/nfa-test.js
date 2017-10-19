/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const NFA = require('../nfa');
const NFAState = require('../nfa-state');

const {
  EPSILON,
  EPSILON_CLOSURE,
} = require('../../special-symbols');

// x|y
function getDefaultNFA() {
  const A = new NFAState();
  const B = new NFAState();
  const C = new NFAState();
  const D = new NFAState();
  const E = new NFAState();
  const F = new NFAState({
    accepting: true,
  });

  // x|y

  A.addTransition(EPSILON, B);
  A.addTransition(EPSILON, C);

  // x
  B.addTransition('x', D);

  // y
  C.addTransition('y', E);


  D.addTransition(EPSILON, F);
  E.addTransition(EPSILON, F);

  return new NFA(A, F);
}

describe('nfa', () => {

  it('alphabet', () => {
    const A = new NFAState();
    const B = new NFAState();
    const C = new NFAState({
      accepting: true,
    });

    A.addTransition(EPSILON, C);

    A.addTransition('b', B);
    B.addTransition('c', C);

    const nfa = new NFA(A, C);

    expect(nfa.getAlphabet()).toEqual(new Set(['b', 'c']));
  });

  it('accepting states', () => {
    const A = new NFAState();

    const B = new NFAState({
      accepting: true,
    });

    const C = new NFAState({
      accepting: true,
    });

    A.addTransition(EPSILON, C);

    A.addTransition('b', B);
    B.addTransition('c', C);

    const nfa = new NFA(A, C);

    expect(nfa.getAcceptingStates()).toContain(B);
    expect(nfa.getAcceptingStates()).toContain(C);

    expect(nfa.getAcceptingStateNumbers()).toEqual(new Set([2, 3]));
  });

  it('transition table', () => {
    const nfa = getDefaultNFA();

    expect(nfa.getTransitionTable()).toEqual({
      1: {"ε*": [1, 2, 5]},
      2: {"x": [3], "ε*": [2]},
      3: {"ε*": [3, 4]},
      4: {"ε*": [4]},
      5: {"y": [6], "ε*": [5]},
      6: {"ε*": [6, 4]},
    });
  });

  it('matches', () => {
    const nfa = getDefaultNFA();

    expect(nfa.matches('x')).toBe(true);
    expect(nfa.matches('y')).toBe(true);

    expect(nfa.matches('z')).toBe(false);
    expect(nfa.matches('')).toBe(false);
  });

});