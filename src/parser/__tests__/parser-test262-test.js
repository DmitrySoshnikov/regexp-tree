/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

// Below are the RegExp tests defined by `test262` suite:
// https://github.com/tc39/test262/tree/master/test/built-ins/RegExp/

const parser = require('..');

function invalid(regexp, message) {
  try {
    parser.parse(regexp);
    throw new Error('expected `parse` to throw');
  } catch (e) {
    expect(e).toBeInstanceOf(SyntaxError);

    if (message) {
      expect(e.message.includes(message)).toBe(true);
    }
  }
}

function valid(regexp) {
  expect(() => parser.parse(regexp)).not.toThrow(SyntaxError);
}

function ut(message) {
  return `Unexpected token: ${message}`;
}

describe('test262', () => {

  it('invalid char range', () => {
    // 15.10.2.15-6-1
    // TODO: /^[z-a]$/ - should throw, 'a' is less than 'z'
  });

  it('invalid quantifier range', () => {
    // 15.10.2.5-3-1
    // TODO: /0{2,1}/ - should throw, 1 is less than 2
  });

  it('invalid flags', () => {
    // 15.10.4.1-3
    invalid('/abc/a');
  });

  it('valid flags', () => {
    // 15.10.4.1-4
    valid('/abc/gimuy');
  });

  it('invalid * char', () => {
    // S15.10.1_A1_T1
    invalid('/a**/', ut(`"*" at 1:3`));
  });

  it('invalid + char', () => {
    // S15.10.1_A1_T10
    invalid('/++a/', ut(`"+" at 1:1`));
  });

  it('invalid ? char', () => {
    // S15.10.1_A1_T11
    invalid('/?a/', ut(`"?" at 1:1`));
  });

  it('invalid ?? char', () => {
    // S15.10.1_A1_T12
    invalid('/??a/', ut(`"?" at 1:1`));
  });

  it('nothing to repeat 1', () => {
    // S15.10.1_A1_T13
    invalid('/x{1}{1,}/', ut(`"{1,}" at 1:5`));
  });

  it('nothing to repeat 2', () => {
    // S15.10.1_A1_T14
    invalid('/x{1,2}{1}/', ut(`"{1}" at 1:7`));
  });

  it('nothing to repeat 3', () => {
    // S15.10.1_A1_T15
    invalid('/x{1,}{1}/', ut(`"{1}" at 1:6`));
  });

  it('nothing to repeat 4', () => {
    // S15.10.1_A1_T16
    invalid('/x{0,1}{1,}/', ut(`"{1,}" at 1:7`));
  });

  it('invalid * 2', () => {
    // S15.10.1_A1_T2
    invalid('/a***/', ut(`"*" at 1:3`));
  });

  it('invalid + 2', () => {
    // S15.10.1_A1_T3
    invalid('/a++/', ut(`"+" at 1:3`));
  });

  it('invalid + 3', () => {
    // S15.10.1_A1_T4
    invalid('/a+++/', ut(`"+" at 1:3`));
  });

  it('invalid ? 2', () => {
    // S15.10.1_A1_T5
    invalid('/a???/', ut(`"?" at 1:4`));
  });

  it('invalid ? 3', () => {
    // S15.10.1_A1_T6
    invalid('/a????/', ut(`"?" at 1:4`));
  });

  it('invalid * 3', () => {
    // S15.10.1_A1_T7
    invalid('/*a/', ut(`"*" at 1:1`));
  });

  it('invalid * 4', () => {
    // S15.10.1_A1_T8
    invalid('/**a/', ut(`"*" at 1:1`));
  });

  it('invalid + 4', () => {
    // S15.10.1_A1_T9
    invalid('/+a/', ut(`"+" at 1:1`));
  });

  it('invalid unicode escape', () => {
    invalid('/\\u{11FFFF}/u', 'Bad character escape');
  });
});