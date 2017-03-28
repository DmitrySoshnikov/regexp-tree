/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

const traverse = require('../index');
const parser = require('../../parser');

const defaultAst = parser.parse('/[a-z]+a/i');

describe('traverse-basic', () => {

  it('visits each node', () => {
    const visited = [];

    traverse.traverse(defaultAst, {

      onRegExp(node, parent) {
        visited.push(node.type);

        expect(node.type).toBe('RegExp');
        expect(parent).toBe(null);
      },

      onAlternative(node, parent) {
        visited.push(node.type);

        expect(node.type).toBe('Alternative');
        expect(parent.type).toBe('RegExp');

        expect(node.expressions.length).toBe(2);
        expect(node.expressions[0].type).toBe('Repetition');
        expect(node.expressions[1].type).toBe('Char');
      },

      onRepetition(node, parent) {
        visited.push(node.type);

        expect(node.type).toBe('Repetition');
        expect(parent.type).toBe('Alternative');

        expect(node.expression.type).toBe('CharacterClass');
        expect(node.quantifier.type).toBe('Quantifier');
        expect(node.quantifier.kind).toBe('+');
      },

      onCharacterClass(node, parent) {
        visited.push(node.type);

        expect(node.type).toBe('CharacterClass');
        expect(parent.type).toBe('Repetition');

        expect(node.expressions.length).toBe(1);
        expect(node.expressions[0].type).toBe('ClassRange');
      },

      onClassRange(node, parent, prop, index) {
        visited.push(node.type);

        expect(node.type).toBe('ClassRange');
        expect(parent.type).toBe('CharacterClass');

        expect(node.from.type).toBe('Char');
        expect(node.to.type).toBe('Char');

        expect(prop).toBe('expressions');
        expect(index).toBe(0);
      },

      onQuantifier(node) {
        visited.push(node.type);
        expect(node.type).toBe('Quantifier');
        expect(node.kind).toBe('+');
      },

      onChar(node, parent) {
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

});