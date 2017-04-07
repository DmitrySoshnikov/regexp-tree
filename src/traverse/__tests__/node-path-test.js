/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const NodePath = require('../node-path');
const generator = require('../../generator');
const parser = require('../../parser');
const traverse = require('..');

describe('NodePath', () => {

  it('creates a node path', () => {
    const ast = parser.parse('/a/');
    const node = ast.body;

    const regexpPath = NodePath.getForNode(ast);

    expect(regexpPath.node).toBe(ast);
    expect(regexpPath.parent).toBe(null);
    expect(regexpPath.parentPath).toBe(null);
    expect(regexpPath.property).toBe(null);
    expect(regexpPath.index).toBe(null);

    const charPath = NodePath.getForNode(node, regexpPath, 'body');

    expect(charPath.node).toBe(node);
    expect(charPath.parent).toBe(ast);
    expect(charPath.parentPath).toBe(regexpPath);
    expect(charPath.property).toBe('body');
    expect(charPath.index).toBe(null);
  });

  it('removes a node', () => {
    const ast = parser.parse('/[ab]/');

    const bCharPath = NodePath.getForNode(
      ast.body.expressions[1],
      NodePath.getForNode(ast.body),
      'expressions',
      1
    );

    bCharPath.remove();

    expect(bCharPath.isRemoved()).toBe(true);
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

  it('checks correct indices after removal', () => {
    const ast = parser.parse('/abcde/');

    traverse.traverse(ast, [
      // First handler, removes current 'b', and further 'c'.
      {
        Char(path) {
          const {node, parent, property, index} = path;

          if (node.value === 'b') {

            const aPath = path.getPreviousSibling();
            const cPath = path.getNextSibling();
            const dPath = cPath.getNextSibling();
            const ePath = dPath.getNextSibling();

            // Remove 'b' itself.
            path.remove();

            // Remove 'c' as well.
            cPath.remove();

            // Check the index is rebuilt:

            // a, 0
            expect(aPath.node.value).toBe('a');
            expect(aPath.index).toBe(0);

            // No b (was 1 before removal)
            expect(path.isRemoved()).toBe(true);

            // No c (was 2 before removal)
            expect(cPath.isRemoved()).toBe(true);

            // d is now 1
            expect(dPath.node.value).toBe('d');
            expect(dPath.index).toBe(1);

            // e is now 2
            expect(ePath.node.value).toBe('e');
            expect(ePath.index).toBe(2);
          }
        },
      },

      // Second handler, backward-removes 'a' being on last 'e'.
      {
        // This handler is not called for 'b', and 'c' since
        // they were removed in the previous handler.
        Char(path) {
          const {node, parent, property, index} = path;

          // Never can be 'b' or 'c', since they were removed.
          expect(path.value).not.toBe('b');
          expect(path.value).not.toBe('c');

          if (node.value === 'e') {

            // Initially index of `e` is 2.
            expect(path.index).toBe(2);

            // Being on 'd', we remove one of the previous siblings, 'a':

            const aPath = path.getPreviousSibling().getPreviousSibling();
            expect(aPath.node.value).toBe('a');

            const dPath = path.getPreviousSibling();
            expect(dPath.node.value).toBe('d');

            // Remove 'a'
            aPath.remove();
            expect(aPath.isRemoved()).toBe(true);

            // Check the index is rebuilt:

            // d, 0
            expect(dPath.index).toBe(0);

            // e, 1 (index of `e` is changed from 2 to 1)
            expect(path.index).toBe(1);

            expect(path.getNextSibling()).toBe(null);
          }
        }
      }
    ]);

    // '/abcde/' -> '/ae/', after 3 removals in 2 handlers.
    expect(generator.generate(ast)).toBe('/de/');
  });

  it('conditional remove', () => {
    const ast = parser.parse('/abcd/');

    // '/abcd/' -> '/ad/'
    traverse.traverse(ast, {
      Char(path) {
        const {node, parent, property, index} = path;
        if (node.value === 'b' || node.value === 'c') {
          path.remove();
        }
      }
    });

    expect(generator.generate(ast)).toBe('/ad/');
  });

  it('replaces a node', () => {
    const ast = parser.parse('/[ab]/');

    const bCharPath = new NodePath(
      ast.body.expressions[1],
      new NodePath(ast.body),
      'expressions',
      1
    );

    const cNode = {
      type: 'Char',
      value: 'c',
      kind: 'simple',
    };

    bCharPath.replace(cNode);
    expect(bCharPath.node).toEqual(cNode);

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
          // 'a' replaced with 'c'
          cNode
        ]
      },
      flags: '',
    });
  });

  it('getPreviousSibling', () => {
    const ast = parser.parse('/ab/');

    const aCharPath = NodePath.getForNode(
      ast.body.expressions[0],
      NodePath.getForNode(ast.body),
      'expressions',
      0
    );

    const bCharPath = NodePath.getForNode(
      ast.body.expressions[1],
      NodePath.getForNode(ast.body),
      'expressions',
      1
    );

    expect(bCharPath.getPreviousSibling()).toBe(aCharPath);
  });

  it('getNextSibling', () => {
    const ast = parser.parse('/ab/');

    const aCharPath = NodePath.getForNode(
      ast.body.expressions[0],
      NodePath.getForNode(ast.body),
      'expressions',
      0
    );

    const bCharPath = NodePath.getForNode(
      ast.body.expressions[1],
      NodePath.getForNode(ast.body),
      'expressions',
      1
    );

    expect(aCharPath.getNextSibling()).toBe(bCharPath);
  });

});