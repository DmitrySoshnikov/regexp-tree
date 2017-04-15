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

  it('several backward/forward removes', () => {
    const ast = parser.parse('/abcdefghi/');

    // '/abcdefghi/' -> '/bfi/'
    traverse.traverse(ast, {
      Char(path) {
        const {node, parent, property, index} = path;

        // From 'd' remove previous 'a', 'c', 'd' (itself), and 'e'.
        // After this it is: bfghi
        if (node.value === 'd') {
          const cPath = path.getPreviousSibling();
          const aPath = cPath.getPreviousSibling().getPreviousSibling();
          const ePath = path.getNextSibling();

          aPath.remove();
          cPath.remove();
          path.remove();
          ePath.remove();
        }

        // From 'f' remove two next 'g', and 'h'
        // After this it is: bfi
        if (node.value === 'f') {
          const gPath = path.getNextSibling();
          const hPath = gPath.getNextSibling();

          gPath.remove();
          hPath.remove();
        }
      }
    });

    expect(generator.generate(ast)).toBe('/bfi/');
  });

  it('several backward/forward removes/inserts', () => {
    const ast = parser.parse('/abcdefghi/');

    // '/abcdefghi/' -> '/bxyfzi/'
    traverse.traverse(ast, {
      Char(path) {
        const {node, parent, property, index} = path;

        // From 'd' remove previous 'a', 'c', inserts 'x' before 'd',
        // removes 'd' (itself), insert 'y' after 'e', remove 'e'.
        // After this it is: bxyfghi
        if (node.value === 'd') {
          const cPath = path.getPreviousSibling();
          const aPath = cPath.getPreviousSibling().getPreviousSibling();
          const ePath = path.getNextSibling();

          // Remove 'a', and 'c'.
          aPath.remove();
          cPath.remove();

          // Insert 'x' before 'd'. After we removed 'a', and 'c'
          // insert index is 1.
          const xNode = {
            type: 'Char',
            value: 'x',
            kind: 'simple',
          };

          const parentPath = path.parentPath;

          parentPath.insertChildAt(xNode, 1);

          // Remove 'd'.
          path.remove();

          // Insert 'y' after 'e'.
          const yNode = {
            type: 'Char',
            value: 'y',
            kind: 'simple',
          };

          parentPath.insertChildAt(yNode, 3);

          // Remove 'e'.
          ePath.remove();
        }

        // From 'f' remove two next 'g', and 'h', insert 'z' after 'f'.
        // After this it is: bfi
        if (node.value === 'f') {
          const gPath = path.getNextSibling();
          const hPath = gPath.getNextSibling();

          // Remove 'g'.
          gPath.remove();

          // Insert 'z'.
          const zNode = {
            type: 'Char',
            value: 'z',
            kind: 'simple',
          };
          path.parentPath.insertChildAt(zNode, 4);

          // Remove 'h'.
          hPath.remove();
        }
      }
    });

    expect(generator.generate(ast)).toBe('/bxyfzi/');
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
          // 'b' replaced with 'c'
          cNode
        ]
      },
      flags: '',
    });
  });

  it('replaces with already used node with another parent', () => {
    const ast = parser.parse('/a(b)/');

    const bodyPath = new NodePath(ast.body);
    const aCharPath = bodyPath.getChild(0);
    const groupPath = bodyPath.getChild(1);
    const bCharPath = groupPath.getChild();
    const aNode = aCharPath.node;
    const bNode = bCharPath.node;

    bodyPath.node.mark = "body";
    groupPath.node.mark = "group";

    // swap a and b
    groupPath.setChild(aNode);
    bodyPath.setChild(bNode, 0);

    // 'a' and 'b' should be swapped now
    expect(generator.generate(ast)).toBe('/b(a)/');

    // body and group still ok
    expect(bodyPath.node.mark).toBe('body')
    expect(groupPath.node.mark).toBe('group')
    expect(bodyPath.getChild(1).node.mark).toBe('group')

    // first is now Char 'b' in body
    expect(bodyPath.getChild(0).node.type).toBe('Char')
    expect(bodyPath.getChild(0).node.value).toBe('b')
    // parentPath should point to the same node as parent
    expect(bodyPath.getChild(0).parentPath.node).toBe(bodyPath.getChild(0).parent)
    // now the parent of 'b' is the body
    expect(bodyPath.getChild(0).parent.mark).toBe('body')
    expect(bodyPath.getChild(0).parent.type).toBe('Alternative')
    // Group has children property 'expressions'
    expect(bodyPath.getChild(0).property).toBe('expressions')
    // and an index of 0
    expect(bodyPath.getChild(0).index).toBe(0)

    // second is Char 'a' in the Group
    expect(bodyPath.getChild(1).getChild().node.type).toBe('Char')
    expect(bodyPath.getChild(1).getChild().node.value).toBe('a')
    // parentPath should point to the same node as parent
    expect(bodyPath.getChild(1).getChild().parentPath.node).toBe(bodyPath.getChild(1).getChild().parent)
    // now the parent of 'a' is the Group
    expect(bodyPath.getChild(1).getChild().parent.mark).toBe('group')
    expect(bodyPath.getChild(1).getChild().parent.type).toBe('Group')
    // Group has child property 'expression'
    expect(bodyPath.getChild(1).getChild().property).toBe('expression')
    // and no index!
    expect(bodyPath.getChild(1).getChild().index).toBe(null)

    // the locally stored NodePaths should have new parents
    expect(bCharPath.parentPath).toBe(bodyPath);
    expect(aCharPath.parentPath).toBe(groupPath);
    // paths from the registry should be the same
    const bCharPath2 = NodePath.getForNode(bNode);
    expect(bCharPath2).toBe(bCharPath);
    const aCharPath2 = NodePath.getForNode(aNode);
    expect(aCharPath2).toBe(aCharPath);
  });

  it('sets a child node to two new nested nodes', () => {
    const ast = parser.parse('/ab/');

    const bodyPath = new NodePath(ast.body);
    const bCharPath = bodyPath.getChild(1);

    const cNode = {
      type: 'Char',
      value: 'c',
      kind: 'simple',
    };

    const groupNode = {
      type: "Group",
      capturing: true,
      expression: null
    };

    const alterNode = {
      type: "Alternative",
      expressions: []
    };

    bCharPath.replace(groupNode);
    expect(bCharPath.node).toEqual(groupNode);

    const groupPath = bodyPath.getChild(1);

    groupPath.setChild(cNode);

    const cPath = NodePath.getForNode(cNode);
    expect(cPath.parentPath).toBe(groupPath);
    const cPath2 = groupPath.getChild();
    expect(cPath2).toBe(cPath);
    expect(cPath2.parentPath).toBe(groupPath);

    const alterPath = groupPath.setChild(alterNode);
    alterPath.appendChild(cNode);

    const dNode = {
      type: 'Char',
      value: 'd',
      kind: 'simple',
    };
    alterPath.appendChild(dNode);

    const dPath = NodePath.getForNode(dNode);
    expect(cPath.parentPath).toBe(alterPath);
    expect(dPath.parentPath).toBe(alterPath);
    expect(alterPath.parentPath).toBe(groupPath);

    expect(generator.generate(ast)).toEqual('/a(cd)/');
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

  it('getParent/getChild', () => {
    const ast = parser.parse('/a(bc)d/');

    const bodyPath = NodePath.getForNode(ast.body);
    const groupPath = bodyPath.getChild(1);

    expect(groupPath.node.type).toBe("Group");
    expect(groupPath.getParent()).toBe(bodyPath);

    const alterPath = groupPath.getChild();

    expect(alterPath.node.type).toBe("Alternative");
    expect(alterPath.getParent()).toBe(groupPath);

    const bCharPath = alterPath.getChild(0);
    const cCharPath = alterPath.getChild(1);

    expect(bCharPath.getParent()).toBe(alterPath);
    expect(cCharPath.getParent()).toBe(alterPath);

    expect(bCharPath.getParent().getParent()).toBe(groupPath);
    expect(cCharPath.getParent().getParent()).toBe(groupPath);

    expect(groupPath.getChild()).toBe(alterPath);
    expect(groupPath.getChild(0)).toBe(alterPath);
    expect(groupPath.getChild(1)).toBe(null);

    expect(groupPath.getChild().getChild(0)).toBe(bCharPath);
    expect(groupPath.getChild().getChild(1)).toBe(cCharPath);

    expect(groupPath.getChild()).toBe(alterPath);
    expect(groupPath.getChild(0)).toBe(alterPath);
    expect(groupPath.getChild(1)).toBe(null);
  });

  it('hasEqualSource', () => {
    const ast = parser.parse('/aba/', {
      captureLocations: true,
    });

    const parentPath = NodePath.getForNode(ast.body);

    const a1Path = NodePath.getForNode(
      ast.body.expressions[0],
      parentPath,
      'expressions',
      0
    );

    const bPath = NodePath.getForNode(
      ast.body.expressions[1],
      parentPath,
      'expressions',
      1
    );

    const a2Path = NodePath.getForNode(
      ast.body.expressions[2],
      parentPath,
      'expressions',
      2
    );

    expect(a1Path.hasEqualSource(a2Path)).toBe(true);

    expect(bPath.hasEqualSource(a1Path)).toBe(false);
    expect(bPath.hasEqualSource(a2Path)).toBe(false);
  });

  it('jsonEncode', () => {
    const node =  {
      type: 'Char',
      value: 'a',
      kind: 'simple',
    };

    const path = NodePath.getForNode(
      Object.assign({}, node, {
        loc: {
          source: 'a',
          start: 1,
          end: 2,
        }
      })
    );

    expect(path.jsonEncode())
      .toBe(JSON.stringify(node, null, (prop, value) => {
        if (prop === 'loc') {
          return undefined;
        }
        return value;
      }));
  });

});
