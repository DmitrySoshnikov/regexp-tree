/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const charClassClassrangesToChars = require('../char-class-classranges-to-chars-transform');

describe('char-class-classranges-to-chars', () => {

  it('[a-a] -> [a]', () => {
    const re = transform('/[a-a]/', [
      charClassClassrangesToChars,
    ]);
    expect(re.toString()).toBe('/[a]/');
  });

  it('[a-b] -> [ab]', () => {
    const re = transform('/[a-b]/', [
      charClassClassrangesToChars,
    ]);
    expect(re.toString()).toBe('/[ab]/');
  });

});