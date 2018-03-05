/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const clone = require('../clone');

describe('utils-clone', () => {

  it('clones null', () => {
    expect(clone(null)).toBe(null);
  });

  it('clones scalars', () => {
    expect(clone(true)).toBe(true);
    expect(clone(42.25)).toBe(42.25);
    expect(clone('foobar')).toBe('foobar');
  });

  it('clones arrays', () => {
    const arr = [
      1,
      [false],
      ['string', {}],
      'foo'
    ];
    const arrCopy = clone(arr);
    expect(arrCopy).toEqual(arr);
    expect(arrCopy).not.toBe(arr);
    expect(arrCopy[1]).not.toBe(arr[1]);
    expect(arrCopy[2]).not.toBe(arr[2]);
    expect(arrCopy[2][1]).not.toBe(arr[2][1]);
  });

  it('clones objects', () => {
    const obj = {
      prop: {
        arr: [{}, 1, true, ''],
        prop: {}
      },
      arr: []
    };
    const objCopy = clone(obj);
    expect(objCopy).toEqual(obj);
    expect(objCopy).not.toBe(obj);
    expect(objCopy.prop).not.toBe(obj.prop);
    expect(objCopy.arr).not.toBe(obj.arr);
    expect(objCopy.prop.arr[0]).not.toBe(obj.prop.arr[0]);
  });

});