/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const charUnescape = require('../char-escape-unescape-transform');

describe('\e -> e', () => {

  it('simple chars', () => {
    const re = transform(/\e\*/, [
      charUnescape,
    ]);
    expect(re.toString()).toBe(/e\*/.toString());
  });

  it('preserve escape', () => {
    const re = transform(/\*\^\$\(\)\[/, [
      charUnescape,
    ]);
    expect(re.toString()).toBe(/\*\^\$\(\)\[/.toString());
  });

  it('char class', () => {
    const re = transform(/[\e\*\(\]\ \^\$]\(\n/, [
      charUnescape,
    ]);
    expect(re.toString()).toBe(/[e*(\] ^$]\(\n/.toString());
  });

});