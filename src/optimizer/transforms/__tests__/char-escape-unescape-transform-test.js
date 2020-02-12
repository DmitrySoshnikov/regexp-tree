/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const charUnescape = require('../char-escape-unescape-transform');

describe('e -> e', () => {
  it('simple chars', () => {
    const re = transform(/\e\*\]/, [charUnescape]);
    expect(re.toString()).toBe(/e\*]/.toString());
  });

  it('preserve escape', () => {
    const re = transform(/\*\^\$\(\)\[\|/, [charUnescape]);
    expect(re.toString()).toBe(/\*\^\$\(\)\[\|/.toString());
  });

  it('unescapes curly braces', () => {
    const re = transform(/\{\}/, [charUnescape]);
    expect(re.toString()).toBe(/{}/.toString());
  });

  it('preserves dash', () => {
    let re = transform('/[^a-zа-яё -]+gi/', [charUnescape]);
    expect(re.toString()).toBe('/[^a-zа-яё -]+gi/');

    re = transform('/[0-9-a-z]/', [charUnescape]);
    expect(re.toString()).toBe('/[0-9-a-z]/');

    re = transform(/^[a-z][a-z0-9\-]{5,29}$/, [charUnescape]);
    expect(re.toString()).toBe('/^[a-z][a-z0-9\\-]{5,29}$/');
  });

  it('unescapes curly in parent with no index', () => {
    let re = transform(/(?:\{)/, [charUnescape]);
    expect(re.toString()).toBe(/(?:{)/.toString());

    re = transform(/(?:\})/, [charUnescape]);
    expect(re.toString()).toBe(/(?:})/.toString());

    re = transform(/\{/, [charUnescape]);
    expect(re.toString()).toBe(/{/.toString());

    re = transform(/\}/, [charUnescape]);
    expect(re.toString()).toBe(/}/.toString());

    re = transform(/\{|v/, [charUnescape]);
    expect(re.toString()).toBe(/{|v/.toString());

    re = transform(/\}|v/, [charUnescape]);
    expect(re.toString()).toBe(/}|v/.toString());
  });

  it('does not unescape { when looking like a quantifier', () => {
    let re = transform(/a\{3}/, [charUnescape]);
    expect(re.toString()).toBe(/a\{3}/.toString());

    re = transform(/a\{3,}/, [charUnescape]);
    expect(re.toString()).toBe(/a\{3,}/.toString());

    re = transform(/a\{10,12}/, [charUnescape]);
    expect(re.toString()).toBe(/a\{10,12}/.toString());
  });

  it('does not unescape } when looking like a quantifier', () => {
    let re = transform(/a{3\}/, [charUnescape]);
    expect(re.toString()).toBe(/a{3\}/.toString());

    re = transform(/a{3,\}/, [charUnescape]);
    expect(re.toString()).toBe(/a{3,\}/.toString());

    re = transform(/a{10,12\}/, [charUnescape]);
    expect(re.toString()).toBe(/a{10,12\}/.toString());
  });

  it('char class', () => {
    const re = transform(/[\e\*\(\]\ \^\$\/-\?\-]\(\n/, [charUnescape]);
    // Can't use native toString() conversion on a regexp here
    // because Node 6 stringifies /[/]/ as /[\/]/
    expect(re.toString()).toBe('/[e*(\\] ^$/-?\\-]\\(\\n/');
  });

  it('does not unescape ^ in char class when in first position', () => {
    const re = transform(/[\^a]/, [charUnescape]);
    expect(re.toString()).toBe(/[\^a]/.toString());
  });

  it('does not unescape - in char class when not in first or last position', () => {
    const re = transform(/[a\-z]/, [charUnescape]);
    expect(re.toString()).toBe(/[a\-z]/.toString());
  });

  it('does not unescape space and # when x flag is set', () => {
    const re = transform('/\\ \\#[\\ \\#]/x', [charUnescape]);
    expect(re.toString()).toBe('/\\ \\#[ #]/x');
  });
});
