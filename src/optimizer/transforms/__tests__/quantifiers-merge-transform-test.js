/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const quantifiersMerge = require('../quantifiers-merge-transform');

describe('merge quantifiers with simple previous sibling', () => {

  it('aa* -> a+', () => {
    const re = transform(/aa*/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a+/');

    const re2 = transform(/aa*?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a+?/');
  });

  it('aa+ -> a{2,}', () => {
    const re = transform(/aa+/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,}/');

    const re2 = transform(/aa+?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,}?/');
  });

  it('aa? -> a{1,2}', () => {
    const re = transform(/aa?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,2}/');

    const re2 = transform(/aa??/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{1,2}?/');
  });

  it('aa{3} -> a{4}', () => {
    const re = transform(/aa{3}/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{4}/');

    const re2 = transform(/aa{3}?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{4}?/');
  });

  it('aa{3,} -> a{4,}', () => {
    const re = transform(/aa{3,}/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{4,}/');

    const re2 = transform(/aa{3,}?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{4,}?/');
  });

  it('aa{3,5} -> a{4,6}', () => {
    const re = transform(/aa{3,5}/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{4,6}/');

    const re2 = transform(/aa{3,5}?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{4,6}?/');
  });
});

describe('merge closed greedy quantifier with closed greedy quantifier', () => {

  it('a?a?', () => {
    const re = transform(/a?a?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{0,2}/');
  });

  it('a?a{2}', () => {
    const re = transform(/a?a{2}/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,3}/');

    const re2 = transform(/a{2}a?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,3}/');
  });

  it('a?a{1,2}', () => {
    const re = transform(/a?a{1,2}/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,3}/');

    const re2 = transform(/a{1,2}a?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{1,3}/');
  });

  it('a{2}a{2}', () => {
    const re = transform(/a{2}a{2}/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{4}/');
  });

  it('a{2}a{1,2}', () => {
    const re = transform(/a{2}a{1,2}/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{3,4}/');

    const re2 = transform(/a{1,2}a{2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{3,4}/');
  });

  it('a{1,2}a{1,2}', () => {
    const re = transform(/a{1,2}a{1,2}/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,4}/');
  });
});

describe('do not merge closed greedy quantifier with closed ungreedy quantifier', () => {

  it('a?a??', () => {
    const re = transform(/a?a??/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a?a??/');

    const re2 = transform(/a??a?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a??a?/');
  });

  it('a?a{2}?', () => {
    const re = transform(/a?a{2}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a?a{2}?/');

    const re2 = transform(/a{2}?a?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2}?a?/');
  });

  it('a?a{1,2}?', () => {
    const re = transform(/a?a{1,2}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a?a{1,2}?/');

    const re2 = transform(/a{1,2}?a?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{1,2}?a?/');
  });

  it('a{2}a??', () => {
    const re = transform(/a{2}a??/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2}a??/');

    const re2 = transform(/a??a{2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a??a{2}/');
  });

  it('a{2}a{2}?', () => {
    const re = transform(/a{2}a{2}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2}a{2}?/');

    const re2 = transform(/a{2}?a{2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2}?a{2}/');
  });

  it('a{2}a{1,2}?', () => {
    const re = transform(/a{2}a{1,2}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2}a{1,2}?/');

    const re2 = transform(/a{1,2}?a{2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{1,2}?a{2}/');
  });

  it('a{1,2}a??', () => {
    const re = transform(/a{1,2}a??/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,2}a??/');

    const re2 = transform(/a??a{1,2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a??a{1,2}/');
  });

  it('a{1,2}a{2}?', () => {
    const re = transform(/a{1,2}a{2}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,2}a{2}?/');

    const re2 = transform(/a{2}?a{1,2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2}?a{1,2}/');
  });

  it('a{1,2}a{1,2}?', () => {
    const re = transform(/a{1,2}a{1,2}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,2}a{1,2}?/');

    const re2 = transform(/a{1,2}?a{1,2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{1,2}?a{1,2}/');
  });
});

describe('merge closed greedy quantifier with open greedy quantifier', () => {

  it('a?a+', () => {
    const re = transform(/a?a+/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,}/');

    const re2 = transform(/a+a?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{1,}/');
  });

  it('a?a*', () => {
    const re = transform(/a?a*/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{0,}/');

    const re2 = transform(/a*a?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{0,}/');
  });

  it('a?a{2,}', () => {
    const re = transform(/a?a{2,}/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,}/');

    const re2 = transform(/a{2,}a?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,}/');
  });

  it('a{2}a+', () => {
    const re = transform(/a{2}a+/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{3,}/');

    const re2 = transform(/a+a{2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{3,}/');
  });

  it('a{2}a*', () => {
    const re = transform(/a{2}a*/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,}/');

    const re2 = transform(/a*a{2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,}/');
  });

  it('a{2}a{2,}', () => {
    const re = transform(/a{2}a{2,}/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{4,}/');

    const re2 = transform(/a{2,}a{2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{4,}/');
  });

  it('a{1,2}a+', () => {
    const re = transform(/a{1,2}a+/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,}/');

    const re2 = transform(/a+a{1,2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,}/');
  });

  it('a{1,2}a*', () => {
    const re = transform(/a{1,2}a*/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,}/');

    const re2 = transform(/a*a{1,2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{1,}/');
  });

  it('a{1,2}a{2,}', () => {
    const re = transform(/a{1,2}a{2,}/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{3,}/');

    const re2 = transform(/a{2,}a{1,2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{3,}/');
  });
});

describe('do not merge closed greedy quantifier with open ungreedy quantifier', () => {

  it('a?a+?', () => {
    const re = transform(/a?a+?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a?a+?/');

    const re2 = transform(/a+?a?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a+?a?/');
  });

  it('a?a*?', () => {
    const re = transform(/a?a*?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a?a*?/');

    const re2 = transform(/a*?a?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a*?a?/');
  });

  it('a?a{2,}?', () => {
    const re = transform(/a?a{2,}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a?a{2,}?/');

    const re2 = transform(/a{2,}?a?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,}?a?/');
  });

  it('a{2}a+?', () => {
    const re = transform(/a{2}a+?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2}a+?/');

    const re2 = transform(/a+?a{2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a+?a{2}/');
  });

  it('a{2}a*?', () => {
    const re = transform(/a{2}a*?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2}a*?/');

    const re2 = transform(/a*?a{2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a*?a{2}/');
  });

  it('a{2}a{2,}?', () => {
    const re = transform(/a{2}a{2,}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2}a{2,}?/');

    const re2 = transform(/a{2,}?a{2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,}?a{2}/');
  });

  it('a{1,2}a+?', () => {
    const re = transform(/a{1,2}a+?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,2}a+?/');

    const re2 = transform(/a+?a{1,2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a+?a{1,2}/');
  });

  it('a{1,2}a*?', () => {
    const re = transform(/a{1,2}a*?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,2}a*?/');

    const re2 = transform(/a*?a{1,2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a*?a{1,2}/');
  });

  it('a{1,2}a{2,}?', () => {
    const re = transform(/a{1,2}a{2,}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,2}a{2,}?/');

    const re2 = transform(/a{2,}?a{1,2}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,}?a{1,2}/');
  });
});

describe('merge closed ungreedy quantifier with closed ungreedy quantifier', () => {

  it('a??a??', () => {
    const re = transform(/a??a??/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{0,2}?/');
  });

  it('a??a{2}?', () => {
    const re = transform(/a??a{2}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,3}?/');

    const re2 = transform(/a{2}?a??/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,3}?/');
  });

  it('a??a{1,2}?', () => {
    const re = transform(/a??a{1,2}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,3}?/');

    const re2 = transform(/a{1,2}?a??/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{1,3}?/');
  });

  it('a{2}?a{2}?', () => {
    const re = transform(/a{2}?a{2}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{4}?/');
  });

  it('a{2}?a{1,2}?', () => {
    const re = transform(/a{2}?a{1,2}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{3,4}?/');

    const re2 = transform(/a{1,2}?a{2}?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{3,4}?/');
  });

  it('a{1,2}?a{1,2}?', () => {
    const re = transform(/a{1,2}?a{1,2}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,4}?/');
  });
});

describe('merge closed ungreedy quantifier with open greedy quantifier', () => {

  it('a??a+', () => {
    const re = transform(/a??a+/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,}/');

    const re2 = transform(/a+a??/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{1,}/');
  });

  it('a??a*', () => {
    const re = transform(/a??a*/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{0,}/');

    const re2 = transform(/a*a??/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{0,}/');
  });

  it('a??a{2,}', () => {
    const re = transform(/a??a{2,}/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,}/');

    const re2 = transform(/a{2,}a??/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,}/');
  });

  it('a{2}?a+', () => {
    const re = transform(/a{2}?a+/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{3,}/');

    const re2 = transform(/a+a{2}?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{3,}/');
  });

  it('a{2}?a*', () => {
    const re = transform(/a{2}?a*/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,}/');

    const re2 = transform(/a*a{2}?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,}/');
  });

  it('a{2}?a{2,}', () => {
    const re = transform(/a{2}?a{2,}/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{4,}/');

    const re2 = transform(/a{2,}a{2}?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{4,}/');
  });

  it('a{1,2}?a+', () => {
    const re = transform(/a{1,2}?a+/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,}/');

    const re2 = transform(/a+a{1,2}?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,}/');
  });

  it('a{1,2}?a*', () => {
    const re = transform(/a{1,2}?a*/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,}/');

    const re2 = transform(/a*a{1,2}?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{1,}/');
  });

  it('a{1,2}?a{2,}', () => {
    const re = transform(/a{1,2}?a{2,}/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{3,}/');

    const re2 = transform(/a{2,}a{1,2}?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{3,}/');
  });
});

describe('merge closed ungreedy quantifier with open ungreedy quantifier', () => {

  it('a??a+?', () => {
    const re = transform(/a??a+?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,}?/');

    const re2 = transform(/a+?a??/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{1,}?/');
  });

  it('a??a*?', () => {
    const re = transform(/a??a*?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{0,}?/');

    const re2 = transform(/a*?a??/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{0,}?/');
  });

  it('a??a{2,}?', () => {
    const re = transform(/a??a{2,}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,}?/');

    const re2 = transform(/a{2,}?a??/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,}?/');
  });

  it('a{2}?a+?', () => {
    const re = transform(/a{2}?a+?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{3,}?/');

    const re2 = transform(/a+?a{2}?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{3,}?/');
  });

  it('a{2}?a*?', () => {
    const re = transform(/a{2}?a*?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,}?/');

    const re2 = transform(/a*?a{2}?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,}?/');
  });

  it('a{2}?a{2,}?', () => {
    const re = transform(/a{2}?a{2,}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{4,}?/');

    const re2 = transform(/a{2,}?a{2}?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{4,}?/');
  });

  it('a{1,2}?a+?', () => {
    const re = transform(/a{1,2}?a+?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,}?/');

    const re2 = transform(/a+?a{1,2}?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,}?/');
  });

  it('a{1,2}?a*?', () => {
    const re = transform(/a{1,2}?a*?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,}?/');

    const re2 = transform(/a*?a{1,2}?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{1,}?/');
  });

  it('a{1,2}?a{2,}?', () => {
    const re = transform(/a{1,2}?a{2,}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{3,}?/');

    const re2 = transform(/a{2,}?a{1,2}?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{3,}?/');
  });
});

describe('merge open greedy quantifier with open greedy quantifier', () => {

  it('a+a+', () => {
    const re = transform(/a+a+/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,}/');
  });

  it('a+a*', () => {
    const re = transform(/a+a*/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,}/');

    const re2 = transform(/a*a+/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{1,}/');
  });

  it('a+a{2,}', () => {
    const re = transform(/a+a{2,}/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{3,}/');

    const re2 = transform(/a{2,}a+/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{3,}/');
  });

  it('a*a*', () => {
    const re = transform(/a*a*/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{0,}/');
  });

  it('a*a{2,}', () => {
    const re = transform(/a*a{2,}/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,}/');

    const re2 = transform(/a{2,}a*/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,}/');
  });

  it('a{2,}a{2,}', () => {
    const re = transform(/a{2,}a{2,}/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{4,}/');
  });
});

describe('merge open greedy quantifier with open ungreedy quantifier', () => {

  it('a+a+?', () => {
    const re = transform(/a+a+?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,}/');

    const re2 = transform(/a+?a+/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,}/');
  });

  it('a+a*?', () => {
    const re = transform(/a+a*?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,}/');

    const re2 = transform(/a*?a+/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{1,}/');
  });

  it('a+a{2,}?', () => {
    const re = transform(/a+a{2,}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{3,}/');

    const re2 = transform(/a{2,}?a+/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{3,}/');
  });

  it('a*a+?', () => {
    const re = transform(/a*a+?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,}/');

    const re2 = transform(/a+?a*/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{1,}/');
  });

  it('a*a*?', () => {
    const re = transform(/a*a*?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{0,}/');

    const re2 = transform(/a*?a*/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{0,}/');
  });

  it('a*a{2,}?', () => {
    const re = transform(/a*a{2,}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,}/');

    const re2 = transform(/a{2,}?a*/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,}/');
  });

  it('a{2,}a+?', () => {
    const re = transform(/a{2,}a+?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{3,}/');

    const re2 = transform(/a+?a{2,}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{3,}/');
  });

  it('a{2,}a*?', () => {
    const re = transform(/a{2,}a*?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,}/');

    const re2 = transform(/a*?a{2,}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,}/');
  });

  it('a{2,}a{2,}?', () => {
    const re = transform(/a{2,}a{2,}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{4,}/');

    const re2 = transform(/a{2,}?a{2,}/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{4,}/');
  });
});

describe('merge open ungreedy quantifier with open ungreedy quantifier', () => {

  it('a+?a+?', () => {
    const re = transform(/a+?a+?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,}?/');
  });

  it('a+?a*?', () => {
    const re = transform(/a+?a*?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{1,}?/');

    const re2 = transform(/a*?a+?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{1,}?/');
  });

  it('a+?a{2,}?', () => {
    const re = transform(/a+?a{2,}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{3,}?/');

    const re2 = transform(/a{2,}?a+?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{3,}?/');
  });

  it('a*?a*?', () => {
    const re = transform(/a*?a*?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{0,}?/');
  });

  it('a*?a{2,}?', () => {
    const re = transform(/a*?a{2,}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{2,}?/');

    const re2 = transform(/a{2,}?a*?/, [
      quantifiersMerge
    ]);
    expect(re2.toString()).toBe('/a{2,}?/');
  });

  it('a{2,}?a{2,}?', () => {
    const re = transform(/a{2,}?a{2,}?/, [
      quantifiersMerge
    ]);
    expect(re.toString()).toBe('/a{4,}?/');
  });

});