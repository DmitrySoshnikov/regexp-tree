/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const NodePath = require('../node-path');
const parser = require('../../parser');

describe('NodePath', () => {

  it('creates a node path', () => {
    const ast = parser.parse('/a/');
    const node = ast.body;

    const regexpPath = new NodePath(ast);

    expect(regexpPath.node).toBe(ast);
    expect(regexpPath.parent).toBe(null);
    expect(regexpPath.parentPath).toBe(null);
    expect(regexpPath.property).toBe(null);
    expect(regexpPath.index).toBe(null);

    const charPath = new NodePath(node, regexpPath, 'body');

    expect(charPath.node).toBe(node);
    expect(charPath.parent).toBe(ast);
    expect(charPath.parentPath).toBe(regexpPath);
    expect(charPath.property).toBe('body');
    expect(charPath.index).toBe(null);
  });

  it('remove a node', () => {
    const ast = parser.parse('/[ab]/');

    const bCharPath = new NodePath(
      ast.body.expressions[1],
      new NodePath(ast.body),
      'expressions',
      1,
    );

    bCharPath.remove();

    expect(bCharPath.node).toBe(null);

    expect(ast).toEqual({
      type: 'RegExp',
      body: {
        type: 'CharacterClass',
        expressions: [
          {
            type: 'Char',
            value: 'a',
            kind: 'simple',
          },
          // No 'b' char.
        ]
      },
      flags: '',
    });
  });

});