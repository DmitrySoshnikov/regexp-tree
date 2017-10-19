/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const NFAState = require('../nfa-state');
const {EPSILON} = require('../../special-symbols');

describe('nfa-state', () => {

  it('epsilon-closure', () => {
    const A = new NFAState();
    const B = new NFAState();
    const C = new NFAState({
      accepting: true,
    });

    A.addTransition(EPSILON, B);
    B.addTransition(EPSILON, C);
    C.addTransition(EPSILON, A);

    A.addTransition('c', C);

    expect(A.getEpsilonClosure()).toEqual(new Set([A, B, C]));
    expect(B.getEpsilonClosure()).toEqual(new Set([B, C, A]));
    expect(C.getEpsilonClosure()).toEqual(new Set([C, A, B]));
  });

  it('matches', () => {
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

    expect(A.matches('x')).toBe(true);
    expect(A.matches('y')).toBe(true);

    expect(A.matches('z')).toBe(false);
    expect(A.matches('')).toBe(false);
  });

});