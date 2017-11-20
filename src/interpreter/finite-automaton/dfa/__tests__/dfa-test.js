/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const DFA = require('../dfa');
const NFA = require('../../nfa/nfa');
const NFAState = require('../../nfa/nfa-state');

const {
  char,
  rep,
} = require('../../nfa/builders');

const {
  EPSILON,
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

  it('accepting states', () => {
    const dfa = new DFA(getDefaultNFA());

    expect(dfa.getOriginaAcceptingStateNumbers())
      .toEqual(new Set(['6,4', '3,4']));

    expect(dfa.getAcceptingStateNumbers())
      .toEqual(new Set([2, 3]));
  });

  it('transition table', () => {
    const dfa = new DFA(getDefaultNFA());

    expect(dfa.getOriginalTransitionTable()).toEqual({
      '1,2,5': {'x': '3,4', 'y': '6,4'},
      '3,4': {},
      '6,4': {},
    });

    expect(dfa.getTransitionTable()).toEqual({
      1: {'x': 3, 'y': 2},
      2: {},
      3: {},
    });

  });

  it('matches', () => {
    const dfa = new DFA(getDefaultNFA());

    expect(dfa.matches('x')).toBe(true);
    expect(dfa.matches('y')).toBe(true);

    expect(dfa.matches('z')).toBe(false);
    expect(dfa.matches('')).toBe(false);
  });

  it('matches rep', () => {
    const dfa = new DFA(rep(char('a')));

    expect(dfa.matches('')).toBe(true);
    expect(dfa.matches('a')).toBe(true);
    expect(dfa.matches('aa')).toBe(true);
    expect(dfa.matches('aaa')).toBe(true);
  });

  it('minimizes', () => {
    const dfa = new DFA(getDefaultNFA());

    expect(dfa.getTransitionTable()).toEqual({
      1: {'x': 3, 'y': 2},
      2: {},
      3: {},
    });

    dfa.minimize();

    expect(dfa.getTransitionTable()).toEqual({
      1: {'x': 2, 'y': 2},
      2: {},
    });
  });

  it('matches minimize', () => {
    const dfa = new DFA(getDefaultNFA());
    dfa.minimize();

    expect(dfa.matches('x')).toBe(true);
    expect(dfa.matches('y')).toBe(true);

    expect(dfa.matches('z')).toBe(false);
    expect(dfa.matches('')).toBe(false);
  });

  it('matches rep', () => {
    const dfa = new DFA(rep(char('a')));
    dfa.minimize();

    expect(dfa.matches('')).toBe(true);
    expect(dfa.matches('a')).toBe(true);
    expect(dfa.matches('aa')).toBe(true);
    expect(dfa.matches('aaa')).toBe(true);
  });

});

