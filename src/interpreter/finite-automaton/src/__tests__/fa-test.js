/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const NFA = require('../nfa/nfa');
const DFA = require('../dfa/dfa');

const fa = require('../');
const builders = require('../nfa/builders');

describe('fa', () => {

  it('API', () => {
    expect(fa.NFA).toBe(NFA);
    expect(fa.DFA).toBe(DFA);

    expect(fa.builders).toBe(builders);

    expect(typeof fa.test).toBe('function');
    expect(typeof fa.toNFA).toBe('function');
    expect(typeof fa.toDFA).toBe('function');
  });

  it('test', () => {
    expect(fa.test(/a*/, '')).toBe(true);
    expect(fa.test(/a*/, 'aaa')).toBe(true);
    expect(fa.test(/a*/, 'ab')).toBe(false);

    expect(fa.test(/abc/, 'abc')).toBe(true);

    expect(fa.test(/a|b/, 'a')).toBe(true);
    expect(fa.test(/a|b/, 'b')).toBe(true);
    expect(fa.test(/a|b/, 'c')).toBe(false);

    expect(fa.test(/ab|bcd*/, 'ab')).toBe(true);
    expect(fa.test(/ab|bcd*/, 'bc')).toBe(true);
    expect(fa.test(/ab|bcd*/, 'bcddd')).toBe(true);
  });

  it('builders', () => {
    const {
      alt,
      char,
      or,
      rep,
    } = fa.builders;

    const nfa = or(
      alt(char('a'), char('b')),
      rep(char('c'))
    );

    expect(nfa.matches('ab')).toBe(true);
    expect(nfa.matches('c')).toBe(true);

    expect(new fa.DFA(nfa).matches('ab')).toBe(true);
    expect(new fa.DFA(nfa).matches('c')).toBe(true);
  });

  it('toNFA', () => {
    const nfa = fa.toNFA(/a*/);

    expect(nfa).toBeInstanceOf(NFA);

    expect(nfa.matches('')).toBe(true);
    expect(nfa.matches('a')).toBe(true);
    expect(nfa.matches('aa')).toBe(true);
  });

  it('toDFA', () => {
    const dfa = fa.toDFA(/a*/);

    expect(dfa).toBeInstanceOf(DFA);

    expect(dfa.matches('')).toBe(true);
    expect(dfa.matches('a')).toBe(true);
    expect(dfa.matches('aa')).toBe(true);
  });

});