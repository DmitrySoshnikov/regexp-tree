/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const charClassClassrangesMerge = require('../char-class-classranges-merge-transform');

describe('char-class-classranges-merge', () => {

  it('merges chars in meta', () => {
    let re = transform(/[\wa_z]/, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[\\w]/');

    re = transform(/[\d1509]/, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[\\d]/');

    re = transform(/[\s\t\u2000 ]/, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[\\s]/');
  });

  it('merges chars in \w with i and u flags', () => {
    const re = transform(/[\u212a\w\u017fa]/iu, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[\\w]/iu');
  });

  it('merges class ranges in meta', () => {
    let re = transform(/[\wa-dh-u]/, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[\\w]/');

    re = transform(/[\d1-5]/, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[\\d]/');

    re = transform(/[\s\u2000-\u2007]/, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[\\s]/');
  });

  it('merges meta in meta', () => {
    let re = transform(/[\w\d]/, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[\\w]/');

    re = transform(/[\W\D\s]/, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[\\D]/');

    re = transform(/[\W\s]/, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[\\W]/');

    re = transform(/[\w\S\d]/, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[\\S]/');
  });

  it('merges chars in class ranges', () => {
    let re = transform(/[fb-eg]/, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[b-g]/');

    re = transform(/[bva-g15dt-z0-7]/, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[0-7a-gt-z]/');

    re = transform(/[\u0024-\u0035\u0027]/, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[\\u0024-\\u0035]/');

    re = transform(/[\u{24}-\u{35}\u0027\u{28}]/u, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[\\u{24}-\\u{35}]/u');

    re = transform(/[\ud83d\ude80-\ud83d\ude88\ud83d\ude83]/u, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[\\ud83d\\ude80-\\ud83d\\ude88]/u');
  });

  it('merges ranges together', () => {
    let re = transform(/[a-fc-u0-56-8]/, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[0-8a-u]/');

    re = transform(/[\u0024-\u0035\u0036-\u0042]/, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[\\u0024-\\u0042]/');

    re = transform(/[\u{24}-\u{35}\u0036-\u0042]/u, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[\\u{24}-\\u0042]/u');

    re = transform(/[\u{1F680}-\ud83d\ude88\ud83d\ude89-\ud83d\ude9b]/u, [
      charClassClassrangesMerge,
    ]);
    expect(re.toString()).toBe('/[\\u{1F680}-\\ud83d\\ude9b]/u');
  });

});