/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const nfaFromRegExp = require('../nfa-from-regexp');
const NFA = require('../nfa');

describe('nfa-from-regexp', () => {

  it('char', () => {
    const a = nfaFromRegExp.build(/a/);

    expect(a).toBeInstanceOf(NFA);

    expect(a.matches('a')).toBe(true);
    expect(a.matches('b')).toBe(false);
  });

  it('or', () => {
    const AorBorC = nfaFromRegExp.build(/a|b|c/);

    expect(AorBorC).toBeInstanceOf(NFA);

    expect(AorBorC.matches('a')).toBe(true);
    expect(AorBorC.matches('b')).toBe(true);
    expect(AorBorC.matches('c')).toBe(true);
    expect(AorBorC.matches('d')).toBe(false);
  });

  it('alt', () => {
    const ABC = nfaFromRegExp.build(/abc/);

    expect(ABC).toBeInstanceOf(NFA);

    expect(ABC.matches('abc')).toBe(true);

    expect(ABC.matches('ab')).toBe(false);
    expect(ABC.matches('a')).toBe(false);
    expect(ABC.matches('d')).toBe(false);
  });

  it('rep', () => {
    const aRep = nfaFromRegExp.build(/a*/);

    expect(aRep).toBeInstanceOf(NFA);

    expect(aRep.matches('')).toBe(true);
    expect(aRep.matches('a')).toBe(true);
    expect(aRep.matches('aa')).toBe(true);
    expect(aRep.matches('aaa')).toBe(true);

    expect(aRep.matches('ab')).toBe(false);
    expect(aRep.matches('b')).toBe(false);
  });

  it('desugar a+', () => {
    const aRep = nfaFromRegExp.build(/a+/);

    expect(aRep).toBeInstanceOf(NFA);

    expect(aRep.matches('')).toBe(false);

    expect(aRep.matches('a')).toBe(true);
    expect(aRep.matches('aa')).toBe(true);
    expect(aRep.matches('aaa')).toBe(true);

    expect(aRep.matches('ab')).toBe(false);
    expect(aRep.matches('b')).toBe(false);
  });

});