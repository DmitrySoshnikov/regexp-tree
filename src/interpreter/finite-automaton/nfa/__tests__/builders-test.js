/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const NFA = require('../nfa');
const NFAState = require('../nfa-state');

const {EPSILON} = require('../../special-symbols');

const {
  alt,
  char,
  e,
  or,
  rep,
  repExplicit,
  plusRep,
  questionRep,
} = require('../builders');

function getAtIndex(set, index) {
  return [...set][index];
}

describe('nfa-builders', () => {
  it('char', () => {
    const a = char('a');

    expect(a).toBeInstanceOf(NFA);
    expect(a.in).toBeInstanceOf(NFAState);
    expect(a.out).toBeInstanceOf(NFAState);

    expect(a.in.accepting).toBe(false);
    expect(a.out.accepting).toBe(true);

    expect(a.in.getTransitionsOnSymbol('a').size).toBe(1);
    expect(a.in.getTransitionsOnSymbol('a')).toEqual(new Set([a.out]));

    expect(a.matches('a')).toBe(true);
  });

  it('e', () => {
    const epsilon = e();

    expect(epsilon).toBeInstanceOf(NFA);
    expect(epsilon.in).toBeInstanceOf(NFAState);
    expect(epsilon.out).toBeInstanceOf(NFAState);

    expect(epsilon.in.accepting).toBe(false);
    expect(epsilon.out.accepting).toBe(true);

    expect(epsilon.in.getTransitionsOnSymbol(EPSILON).size).toBe(1);
    expect(epsilon.in.getTransitionsOnSymbol(EPSILON)).toEqual(
      new Set([epsilon.out])
    );

    expect(epsilon.matches('')).toBe(true);
  });

  it('or', () => {
    const a = char('a');
    const b = char('b');
    const c = char('c');

    // Before patching chars are accepting.
    expect(a.out.accepting).toBe(true);
    expect(b.out.accepting).toBe(true);
    expect(c.out.accepting).toBe(true);

    const AorBorC = or(a, b, c);

    expect(AorBorC).toBeInstanceOf(NFA);

    // After patching chars out are not accepting.
    expect(a.out.accepting).toBe(false);
    expect(b.out.accepting).toBe(false);
    expect(c.out.accepting).toBe(false);
    expect(AorBorC.out.accepting).toBe(true);

    const AorB = getAtIndex(AorBorC.in.getTransitionsOnSymbol(EPSILON), 0);

    const partA = getAtIndex(AorB.getTransitionsOnSymbol(EPSILON), 0);
    const partB = getAtIndex(AorB.getTransitionsOnSymbol(EPSILON), 1);

    expect(partA).toBe(a.in);
    expect(partB).toBe(b.in);

    const partC = getAtIndex(AorBorC.in.getTransitionsOnSymbol(EPSILON), 1);
    expect(partC).toBe(c.in);

    const outFromB = getAtIndex(
      getAtIndex(
        b.out.getTransitionsOnSymbol(EPSILON),
        0
      ).getTransitionsOnSymbol(EPSILON),
      0
    );

    expect(outFromB).toBe(AorBorC.out);

    const outFromC = getAtIndex(c.out.getTransitionsOnSymbol(EPSILON), 0);
    expect(outFromC).toBe(AorBorC.out);

    expect(AorBorC.matches('a')).toBe(true);
    expect(AorBorC.matches('b')).toBe(true);
    expect(AorBorC.matches('c')).toBe(true);
  });

  it('alt', () => {
    const a = char('a');
    const b = char('b');
    const c = char('c');

    // Before patching chars are accepting.
    expect(a.out.accepting).toBe(true);
    expect(b.out.accepting).toBe(true);
    expect(c.out.accepting).toBe(true);

    const ABC = alt(a, b, c);

    expect(ABC).toBeInstanceOf(NFA);

    // After patching chars out are not accepting.
    expect(a.out.accepting).toBe(false);
    expect(b.out.accepting).toBe(false);
    expect(c.out.accepting).toBe(true);

    expect(ABC.in).toBe(a.in);
    expect(ABC.out).toBe(c.out);

    expect(getAtIndex(a.out.getTransitionsOnSymbol(EPSILON), 0)).toBe(b.in);

    expect(getAtIndex(b.out.getTransitionsOnSymbol(EPSILON), 0)).toBe(c.in);

    expect(ABC.matches('abc')).toBe(true);
  });

  it('kleene-closure-explicit', () => {
    const a = char('a');
    const aRep = repExplicit(a);

    expect(aRep).toBeInstanceOf(NFA);

    const partA = getAtIndex(aRep.in.getTransitionsOnSymbol(EPSILON), 0);
    expect(partA).toBe(a.in);

    const partEpsilon = getAtIndex(aRep.in.getTransitionsOnSymbol(EPSILON), 1);

    expect(partEpsilon.accepting).toBe(true);
    expect(partEpsilon).toBe(aRep.out);

    const backToA = getAtIndex(aRep.out.getTransitionsOnSymbol(EPSILON), 0);
    expect(backToA).toBe(a.in);

    expect(aRep.matches('')).toBe(true);
    expect(aRep.matches('a')).toBe(true);
    expect(aRep.matches('aaa')).toBe(true);
  });

  it('kleene-closure', () => {
    const a = char('a');
    const aRep = rep(a);

    expect(aRep).toBe(a);

    expect(aRep).toBeInstanceOf(NFA);

    const partEpsilon = getAtIndex(aRep.in.getTransitionsOnSymbol(EPSILON), 0);

    expect(partEpsilon.accepting).toBe(true);
    expect(partEpsilon).toBe(aRep.out);

    const backToA = getAtIndex(aRep.out.getTransitionsOnSymbol(EPSILON), 0);
    expect(backToA).toBe(a.in);

    expect(aRep.matches('')).toBe(true);
    expect(aRep.matches('a')).toBe(true);
    expect(aRep.matches('aaa')).toBe(true);
  });

  it('plusRep', () => {
    const a = char('a');
    const aPlus = plusRep(a);

    expect(aPlus).toBe(a);
    expect(aPlus).toBeInstanceOf(NFA);

    const backToA = getAtIndex(aPlus.out.getTransitionsOnSymbol(EPSILON), 0);
    expect(backToA).toBe(a.in);

    expect(aPlus.matches('')).toBe(false);
    expect(aPlus.matches('a')).toBe(true);
    expect(aPlus.matches('aaa')).toBe(true);
  });

  it('questionRep', () => {
    const a = char('a');
    const aQuestion = questionRep(a);

    expect(aQuestion).toBe(a);
    expect(aQuestion).toBeInstanceOf(NFA);

    const partEpsilon = getAtIndex(
      aQuestion.in.getTransitionsOnSymbol(EPSILON),
      0
    );
    expect(partEpsilon).toBe(a.out);

    expect(aQuestion.matches('')).toBe(true);
    expect(aQuestion.matches('a')).toBe(true);
    expect(aQuestion.matches('aa')).toBe(false);
  });
});
