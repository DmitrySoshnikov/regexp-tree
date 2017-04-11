/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const charClassToMeta = require('../char-class-to-meta-transform');

describe('char-class-to-meta', () => {

  it('replaces number ranges', () => {
    const re = transform(/[0-9$]/, [
      charClassToMeta,
    ]);
    console.log(JSON.stringify(re.getAST(), null, 2));
    expect(re.toString()).toBe('/[\\d]+/');
  });

});