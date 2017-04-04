/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const parser = require('../../parser');

const {TransformResult, transform} = require('..');

const defaultRe = /a{1,}/i;
const defaultReString = `${defaultRe}`;
const defaultAst = parser.parse(defaultReString);

describe('transform-basic', () => {

  function test(re) {
    const result = transform(re, {
      Quantifier(path) {
        const {node} = path;

        if (node.kind === 'Range' && node.from == 1 && !node.to) {
          path.replace({
            type: 'Quantifier',
            kind: '+',
            greedy: node.greedy,
          });
        }
      }
    });

    expect(result).toBeInstanceOf(TransformResult);

    expect(result.toString()).toBe('/a+/i');
    expect(result.toRegExp()).toEqual(/a+/i);

    expect(result.getAST()).toEqual({
      type: 'RegExp',
      body: {
        type: 'Repetition',
        expression: {
          type: 'Char',
          value: 'a',
          kind: 'simple',
        },
        quantifier: {
          type: 'Quantifier',
          kind: '+',
          greedy: true,
        },
      },
      flags: 'i',
    });
  }

  it('from string', () => {
    test(defaultReString);
  });

  it('from regexp', () => {
    test(defaultRe);
  });

  it('from ast', () => {
    test(defaultAst);
  });

});