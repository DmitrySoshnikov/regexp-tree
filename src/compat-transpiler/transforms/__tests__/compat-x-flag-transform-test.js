/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const compatXFlagTransform = require('../compat-x-flag-transform');

describe('compat-x-flag-transform', () => {

  it('removes x flag', () => {
    const re = transform('/foo/x', [
      compatXFlagTransform,
    ]);
    expect(re.toString()).toBe('/foo/');
  });

});