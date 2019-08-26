/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const parser = require('../../parser');
const generator = require('..');

function test(re) {
  const reStr = re.toString();
  const parsed = parser.parse(reStr);
  const generated = generator.generate(parsed);
  expect(generated).toBe(reStr);
}

describe('generator-basic', () => {
  it('simple char', () => {
    test(/a/);
  });

  it('space char', () => {
    test(/ /);
  });

  it('escaped char', () => {
    test(/\z/);
  });

  it('unicode char', () => {
    test(/\u0036/);
  });

  it('hex char', () => {
    test(/\x3B/);
  });

  it('octal char', () => {
    test(/\073/);
  });

  it('meta char', () => {
    test(/\n/);
    test(/\r/);
    test(/\s/);
    test(/\S/);
    test(/\d/);
    test(/\D/);
    test(/\w/);
    test(/\W/);
    test(/\v/);
    test(/\f/);
  });

  it('alternative', () => {
    test(/abc/);
  });

  it('disjunction', () => {
    test(/a|b/);
  });

  it('disjunction - empty left', () => {
    test(/|a/);
  });

  it('disjunction - empty right', () => {
    test(/a|/);
  });

  it('capturing group', () => {
    test(/(ab)/);
  });

  it('empty capturing group', () => {
    test(/()/);
  });

  it('non-capturing group', () => {
    test(/(?:ab)/);
  });

  it('named group', () => {
    test('/(?<foo\\u003B\\u{003B}>bar)/u');
  });

  it('empty named group', () => {
    test('/(?<foo\\u003B\\u{003B}>)/u');
  });

  it('empty non-capturing group', () => {
    test(/(?:)/);
  });

  it('numeric backreference', () => {
    test(/(a)\1/);
  });

  it('named backreference', () => {
    test('/(?<foo\\u003B\\u{003B}>)\\k<foo\\u003B\\u{003B}>/u');
  });

  it('basic-assertion', () => {
    test(/^/);
    test(/$/);
    test(/\b/);
    test(/\B/);
  });

  it('positive character class', () => {
    test(/[a-z0]/);
  });

  it('empty positive character class', () => {
    /*eslint no-empty-character-class:0*/
    test(/[]/);
  });

  it('negative character class', () => {
    test(/[^a-z0]/);
  });

  it('empty negative character class', () => {
    test(/[^]/);
  });

  it('positive lookahead assertion', () => {
    test(/(?=abc)/);
  });

  it('empty positive lookahead assertion', () => {
    test(/(?=)/);
  });

  it('negative lookahead assertion', () => {
    test(/(?!abc)/);
  });

  it('empty negative lookahead assertion', () => {
    test(/(?!)/);
  });

  it('positive lookbehind assertion', () => {
    test('/(?<=abc)/');
  });

  it('empty positive lookbehind assertion', () => {
    test('/(?<=)/');
  });

  it('negative lookbehind assertion', () => {
    test('/(?<!abc)/');
  });

  it('empty negative lookbehind assertion', () => {
    test('/(?<!)/');
  });

  it('simple greedy quantifier', () => {
    test(/a?/);
    test(/a*/);
    test(/a+/);
  });

  it('simple non-greedy quantifier', () => {
    test(/a??/);
    test(/a*?/);
    test(/a+?/);
  });

  it('range greedy quantifier', () => {
    test(/a{1}/);
    test(/a{1,}/);
    test(/a{1,3}/);
  });

  it('range non-greedy quantifier', () => {
    test(/a{1}?/);
    test(/a{1,}?/);
    test(/a{1,3}?/);
  });
});
