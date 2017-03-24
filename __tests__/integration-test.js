/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const regexpTree = require('../index');

describe('regexp-tree', () => {

  it('API', () => {
    // Parser.
    expect(typeof regexpTree.parser).toBe('object');
    expect(typeof regexpTree.parse).toBe('function');

    // Traverse.
    expect(typeof regexpTree.traverse).toBe('function');

    // Generator.
    expect(typeof regexpTree.generate).toBe('function');
  });

  it('operations', () => {
    const ast = regexpTree.parse('/a/i');

    // 1. Parse.
    expect(ast).toEqual({
      type: 'RegExp',
      body: {
        type: 'Char',
        value: 'a',
        kind: 'simple',
      },
      flags: ['i'],
    });

    // 2. Traverse.
    const visited = [];

    regexpTree.traverse(ast, {
      onRegExp(node) {
        visited.push(node.type);
        expect(node.type).toBe('RegExp');
      },

      onChar(node) {
        visited.push(node.type);
        expect(node.type).toBe('Char');
        expect(node.value).toBe('a');
      }
    });

    expect(visited).toEqual([
      'RegExp',
      'Char',
    ]);
  });

});