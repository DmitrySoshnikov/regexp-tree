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

    const regexpNodePath = new NodePath(ast);

    expect(regexpNodePath.node).toBe(ast);
    expect(regexpNodePath.parent).toBe(null);
    expect(regexpNodePath.parentPath).toBe(null);
    expect(regexpNodePath.property).toBe(null);
    expect(regexpNodePath.index).toBe(null);

    const charNodePath = new NodePath(node, regexpNodePath, 'body');

    expect(charNodePath.node).toBe(node);
    expect(charNodePath.parent).toBe(ast);
    expect(charNodePath.parentPath).toBe(regexpNodePath);
    expect(charNodePath.property).toBe('body');
    expect(charNodePath.index).toBe(null);
  });

});