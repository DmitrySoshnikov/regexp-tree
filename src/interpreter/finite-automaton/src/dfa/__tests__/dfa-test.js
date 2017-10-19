/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const DFA = require('../dfa');
const NFA = require('../../nfa/nfa');
const NFAState = require('../../nfa/nfa-state');

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

describe('dfa', () => {

  it('alphabet', () => {
    const dfa = new DFA(getDefaultNFA());
    expect(dfa.getAlphabet()).toEqual(new Set(['x', 'y']));
  });

  it('starting state', () => {
    const dfa = new DFA(getDefaultNFA());
    expect(dfa.getStartingStateNumber()).toBe('1,2,5');
  });

  it('accepting states', () => {
    const dfa = new DFA(getDefaultNFA());
    expect(dfa.getAcceptingStateNumbers()).toEqual(new Set(['3,4', '6,4']));
  });

  it('transition table', () => {
    const dfa = new DFA(getDefaultNFA());

    expect(dfa.getTransitionTable()).toEqual({
      "1,2,5": {"x": "3,4", "y": "6,4"},
      "3,4": {},
      "6,4": {},
    });

  });

  it('matches', () => {
    const dfa = new DFA(getDefaultNFA());

    expect(dfa.matches('x')).toBe(true);
    expect(dfa.matches('y')).toBe(true);

    expect(dfa.matches('z')).toBe(false);
    expect(dfa.matches('')).toBe(false);
  });

});

