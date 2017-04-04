/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const traverse = require('..');
const parser = require('../../parser');

const defaultAst = parser.parse('/[a-z]+a/i');

describe('traverse-basic', () => {

  it('visits each node as a NodePath', () => {
    const visited = [];

    traverse.traverse(defaultAst, {

      RegExp({node, parent}) {
        visited.push(node.type);

        expect(node.type).toBe('RegExp');
        expect(parent).toBe(null);
      },

      Alternative({node, parent}) {
        visited.push(node.type);

        expect(node.type).toBe('Alternative');
        expect(parent.type).toBe('RegExp');

        expect(node.expressions.length).toBe(2);
        expect(node.expressions[0].type).toBe('Repetition');
        expect(node.expressions[1].type).toBe('Char');
      },

      Repetition({node, parent}) {
        visited.push(node.type);

        expect(node.type).toBe('Repetition');
        expect(parent.type).toBe('Alternative');

        expect(node.expression.type).toBe('CharacterClass');
        expect(node.quantifier.type).toBe('Quantifier');
        expect(node.quantifier.kind).toBe('+');
      },

      CharacterClass({node, parent}) {
        visited.push(node.type);

        expect(node.type).toBe('CharacterClass');
        expect(parent.type).toBe('Repetition');

        expect(node.expressions.length).toBe(1);
        expect(node.expressions[0].type).toBe('ClassRange');
      },

      ClassRange({node, parent, property, index}) {
        visited.push(node.type);

        expect(node.type).toBe('ClassRange');
        expect(parent.type).toBe('CharacterClass');

        expect(node.from.type).toBe('Char');
        expect(node.to.type).toBe('Char');

        expect(property).toBe('expressions');
        expect(index).toBe(0);
      },

      Quantifier({node}) {
        visited.push(node.type);
        expect(node.type).toBe('Quantifier');
        expect(node.kind).toBe('+');
      },

      Char({node, parent}) {
        visited.push(node.type);

        expect(node.type).toBe('Char');

        // Char appears only in these two parent nodes:
        expect(
          parent.type === 'ClassRange' ||
          parent.type === 'Alternative'
        ).toBe(true);
      },
    });

    // Visit order.
    expect(visited).toEqual([
      'RegExp',
      'Alternative',
      'Repetition',
      'CharacterClass',
      'ClassRange',
      'Char',
      'Char',
      'Quantifier',
      'Char',
    ]);
  });

  it('visits each node as raw', () => {
    const visited = [];

    // This traversal receives raw nodes in handlers.
    const options = {asNodes: true};

    traverse.traverse(defaultAst, {

      RegExp(node, parent) {
        visited.push(node.type);

        expect(node.type).toBe('RegExp');
        expect(parent).toBe(null);
      },

      Alternative(node, parent) {
        visited.push(node.type);

        expect(node.type).toBe('Alternative');
        expect(parent.type).toBe('RegExp');

        expect(node.expressions.length).toBe(2);
        expect(node.expressions[0].type).toBe('Repetition');
        expect(node.expressions[1].type).toBe('Char');
      },

      Repetition(node, parent) {
        visited.push(node.type);

        expect(node.type).toBe('Repetition');
        expect(parent.type).toBe('Alternative');

        expect(node.expression.type).toBe('CharacterClass');
        expect(node.quantifier.type).toBe('Quantifier');
        expect(node.quantifier.kind).toBe('+');
      },

      CharacterClass(node, parent) {
        visited.push(node.type);

        expect(node.type).toBe('CharacterClass');
        expect(parent.type).toBe('Repetition');

        expect(node.expressions.length).toBe(1);
        expect(node.expressions[0].type).toBe('ClassRange');
      },

      ClassRange(node, parent, property, index) {
        visited.push(node.type);

        expect(node.type).toBe('ClassRange');
        expect(parent.type).toBe('CharacterClass');

        expect(node.from.type).toBe('Char');
        expect(node.to.type).toBe('Char');

        expect(property).toBe('expressions');
        expect(index).toBe(0);
      },

      Quantifier(node) {
        visited.push(node.type);
        expect(node.type).toBe('Quantifier');
        expect(node.kind).toBe('+');
      },

      Char(node, parent) {
        visited.push(node.type);

        expect(node.type).toBe('Char');

        // Char appears only in these two parent nodes:
        expect(
          parent.type === 'ClassRange' ||
          parent.type === 'Alternative'
        ).toBe(true);
      },
    }, options);

    // Visit order.
    expect(visited).toEqual([
      'RegExp',
      'Alternative',
      'Repetition',
      'CharacterClass',
      'ClassRange',
      'Char',
      'Char',
      'Quantifier',
      'Char',
    ]);
  });

  it('modifies a direct node', () => {
    const ast = parser.parse('/a{1,}/');

    traverse.traverse(ast, {
      Quantifier({node}) {
        if (node.kind === 'Range' && node.from == 1 && !node.to) {
          node.kind = '+';
          delete node.from;
        }
      },
    });

    expect(ast.body.quantifier).toEqual({
      type: 'Quantifier',
      kind: '+',
      greedy: true,
    });
  });

  it('replaces a node using parent', () => {
    const ast = parser.parse('/a{1,}?/');

    traverse.traverse(ast, {
      Quantifier({node, parent, property}) {
        if (node.kind === 'Range' && node.from == 1 && !node.to) {
          parent[property] = {
            type: 'Quantifier',
            kind: '+',
            greedy: node.greedy,
          };
        }
      },
    });

    expect(ast.body.quantifier).toEqual({
      type: 'Quantifier',
      kind: '+',
      greedy: false,
    });
  });

  it('multiple handlers', () => {
    const ast = parser.parse('/a/');

    expect(ast.body.value).toBe('a');

    // Two handlers.
    const handlers = [
      {
        Char({node}) {
          node.value = 'b';
        },
      },
      {
        Char({node}) {
          node.value += 'c';
        },
      }
    ];

    traverse.traverse(ast, handlers);

    expect(ast.body.value).toBe('bc');
  });

  it('shouldRun hook', () => {
    const handler = {
      shouldRun(ast) {
        return ast.flags.includes('s');
      },

      RegExp({node}) {
        node.flags = node.flags.replace('s', '');
      },

      Char(path) {
        const {node} = path;
        if (node.kind === 'meta' && node.value === '.') {
          path.replace({
            type: 'CharacterClass',
            negative: true,
          });
        }
      },
    };

    // Should run.
    let ast = parser.parse('/./s');
    traverse.traverse(ast, handler);

    expect(ast).toEqual({
      type: 'RegExp',
      body: {
        type: 'CharacterClass',
        negative: true,
      },
      flags: '',
    });

    // Should not run.
    ast = parser.parse('/./');
    traverse.traverse(ast, handler);

    expect(ast).toEqual({
      type: 'RegExp',
      body: {
        type: 'Char',
        value: '.',
        kind: 'meta',
      },
      flags: '',
    });

    // Should run (not `shouldRun` hook present).
    ast = parser.parse('/./');
    traverse.traverse(ast, {
      Char({node, parent, property}) {
        if (node.kind === 'meta' && node.value === '.') {
          parent[property] = {
            type: 'CharacterClass',
            negative: true,
          };
        }
      },
    });

    expect(ast).toEqual({
      type: 'RegExp',
      body: {
        type: 'CharacterClass',
        negative: true,
      },
      flags: '',
    });
  });

  it('catch-all * handler', () => {
    const ast = parser.parse('/a+/');
    const visited = [];

    traverse.traverse(ast, {
      '*': ({node}) => {
        visited.push(node.type);
      },
    });

    expect(visited).toEqual([
      'RegExp',
      'Repetition',
      'Char',
      'Quantifier',
    ]);
  });

});