/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const charClassRemoveDuplicates = require('../char-class-remove-duplicates-transform');

describe('char-class-remove-duplicates', () => {

  it('removes duplicates', () => {
    const re = transform('/[0-90-9\\d\\daba\\w\\n\\w$]/', [
      charClassRemoveDuplicates,
    ]);
    expect(re.toString()).toBe('/[0-9\\dab\\w\\n$]/');
  });

});