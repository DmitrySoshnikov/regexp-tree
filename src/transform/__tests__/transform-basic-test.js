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
            loc: {
              source: '+',
              start: node.loc.start,
              end: node.loc.start + 1,
            },
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
          kind: 'simple',
          loc: {
            source: 'a',
            start: 1,
            end: 2,
          },
        },
        quantifier: {
          type: 'Quantifier',
          kind: '+',
          greedy: true,
          loc: {
            source: '+',
            start: 2,
            end: 3,
          }
        },
        loc: {
          source: 'a{1,}', // NOTE: original source might not be updated
          start: 1,
          end: 6,
        },
      },
      flags: 'i',
      loc: {
        source: '/a{1,}/i',
        start: 0,
        end: 8
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