/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {transform} = require('../../../transform');
const combineRepeatingPatterns = require('../combine-repeating-patterns-transform');

describe('abcdefabcdef -> (?:abcdef){2}', () => {

  it('combines repeating patterns', () => {
    const re = transform(/abcdefabcdef/, [
      combineRepeatingPatterns
    ]);
    expect(re.toString()).toBe('/(?:abcdef){2}/');
  });

  it('combines complex repeating patterns', () => {
    const re = transform(/a{5,}[\d\W]{3}a{5,}[\d\W]{3}/, [
      combineRepeatingPatterns
    ]);
    expect(re.toString()).toBe('/(?:a{5,}[\\d\\W]{3}){2}/');
  });

  it('combines multiple repeating patterns', () => {
    const re = transform(/(?:a|bc)(?:a|bc)(?:a|bc)defdefdef/, [
      combineRepeatingPatterns
    ]);
    expect(re.toString()).toBe('/(?:a|bc){3}(?:def){3}/');
  });

});

describe('(?:abc){4}abc -> (?:abc){5}', () => {

  it('combines pattern with repetition on the left', () => {
    let re = transform(/(?:abc){4}abc/, [
      combineRepeatingPatterns
    ]);
    expect(re.toString()).toBe('/(?:abc){5}/');

    re = transform(/(?:abc)+abc/, [
      combineRepeatingPatterns
    ]);
    expect(re.toString()).toBe('/(?:abc){2,}/');
  });

});

describe('abc(?:abc){4} -> (?:abc){5}', () => {

  it('combines repetition with pattern on the left', () => {
    const re = transform(/abc(?:abc){4}/, [
      combineRepeatingPatterns
    ]);
    expect(re.toString()).toBe('/(?:abc){5}/');
  });

});

describe('abc(?:abc){4}abcabc -> (?:abc){7}', () => {

  it('combine all those repeating patterns at once', () => {
    const re = transform(/abc(?:abc){4}abcabc/, [
      combineRepeatingPatterns
    ]);
    expect(re.toString()).toBe('/(?:abc){7}/');
  });

});