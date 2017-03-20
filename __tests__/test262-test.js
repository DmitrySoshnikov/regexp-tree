/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

// Below are the RegExp tests defined by `test262` suite:
// https://github.com/tc39/test262/tree/master/test/built-ins/RegExp

const regexpTree = require('../index');

function re(regexp) {
  return regexpTree.parse(regexp.toString());
}

function invalid(regexp, message) {
  try {
    regexpTree.parse(regexp);
    expect(1).not.toBe(1); // unreachable
  } catch (e) {
    expect(e instanceof SyntaxError).toBe(true);

    if (message) {
      expect(e.message.includes(message)).toBe(true);
    }
  }
}

function valid(regexp) {
  expect(() => regexpTree.parse(regexp)).not.toThrow(SyntaxError);
}

const UT = 'Unexpected token:';

function ut(message) {
  return `${UT} ${message}`;
}

describe('test262', () => {

  it('invalid char range', () => {
    // TODO: /^[z-a]$/ - should throw, 'a' is less than 'z'
  });

  it('invalid quantifier range', () => {
    // TODO: /0{2,1}/ - should throw, 1 is less than 2
  });

  it('invalid flags', () => {
    invalid('/abc/a');
  });

  it('valid flags', () => {
    valid('/abc/gimuy');
  });

  it('invalid * char', () => {
    invalid('/a**/', ut(`"*" at 1:3`));
  });

  it('invalid + char', () => {
    invalid('/++a/', ut(`"+" at 1:1`));
  });

  it('invalid ? char', () => {
    invalid('/?a/', ut(`"?" at 1:1`));
  });

});