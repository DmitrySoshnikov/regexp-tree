/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const State = require('../state');

function setIndex(set, index) {
  return [...set][index];
}

describe('fa-state', () => {

  it('accepting', () => {
    const A = new State({
      accepting: true,
    });

    const B = new State();
    B.accepting = true;

    const C = new State();

    expect(A.accepting).toBe(true);
    expect(B.accepting).toBe(true);
    expect(C.accepting).toBe(false);
  });

  it('add symbol transitions', () => {
    const A = new State();
    const B = new State();

    expect(A.getTransitions().size).toBe(0);
    expect(B.getTransitions().size).toBe(0);

    A.addTransition('b', B);

    expect(A.getTransitions().size).toBe(1);
    expect(B.getTransitions().size).toBe(0);

    expect(A.getTransitionsOnSymbol('b').size).toBe(1);
    expect(setIndex(A.getTransitionsOnSymbol('b'), 0)).toBe(B);

    const C = new State();

    A.addTransition('b', C);

    expect(A.getTransitions().size).toBe(1);
    expect(A.getTransitionsOnSymbol('b').size).toBe(2);
    expect(setIndex(A.getTransitionsOnSymbol('b'), 1)).toBe(C);
  });
});