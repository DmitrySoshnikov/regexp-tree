/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const parser = require('../../parser');

const {TransformResult, transform} = require('..');

const defaultRe = /a{1,}/i;
const defaultReString = `${defaultRe}`;
const defaultAst = parser.parse(defaultReString, {
  captureLocations: true,
});

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

    expect(result.getSource()).toBe('a+');
    expect(result.getFlags()).toBe('i');

    expect(result.getAST()).toEqual({
      type: 'RegExp',
      body: {
        type: 'Repetition',
        expression: {
          type: 'Char',
          value: 'a',
          symbol: 'a',
          kind: 'simple',
          codePoint: 'a'.codePointAt(0),
          loc: {
            source: 'a',
            start: {
              line: 1,
              column: 1,
              offset: 1,
            },
            end: {
              line: 1,
              column: 2,
              offset: 2,
            },
          },
        },
        quantifier: {
          type: 'Quantifier',
          kind: '+',
          greedy: true,
        },
        loc: {
          source: 'a{1,}', // NOTE: original source might not be updated
          start: {
            line: 1,
            column: 1,
            offset: 1,
          },
          end: {
            line: 1,
            column: 6,
            offset: 6,
          },
        },
      },
      flags: 'i',
      loc: {
        source: '/a{1,}/i',
        start: {
          line: 1,
          column: 0,
          offset: 0,
        },
        end: {
          line: 1,
          column: 8,
          offset: 8,
        },
      }
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