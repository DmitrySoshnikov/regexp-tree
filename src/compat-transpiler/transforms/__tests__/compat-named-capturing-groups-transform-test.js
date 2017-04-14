/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const compatNamedCapturingGroups = require('../compat-named-capturing-groups-transform');

describe('compat-named-capturing-groups-transform', () => {

  it('transforms named groups', () => {
    const re = transform(
      '/(?:x)(?<foo>a)(b)(?:y)(?<bar>c)\\k<foo>\\1\\2\\k<bar>\\k<other>/', [
        compatNamedCapturingGroups,
      ]
    );

    expect(re.toString())
      .toBe(/(?:x)(a)(b)(?:y)(c)\1\1\2\3\k<other>/.toString());

    // Collected group names.
    expect(compatNamedCapturingGroups.getExtra()).toEqual({
      foo: 1,
      bar: 3,
    })
  });

});