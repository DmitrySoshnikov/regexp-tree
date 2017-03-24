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

        expect(node.type === 'Alternative');
        expect(parent.type === 'RegExp');

        expect(node.expressions.length).toBe(2);
        expect(node.expressions[0].type).toBe('Repetition');
        expect(node.expressions[1].type).toBe('Char');
      },

      onRepetition(node, parent) {
        visited.push(node.type);

        expect(node.type === 'Repetition');
        expect(parent.type === 'Alternative');

        expect(node.expression.type).toBe('CharacterClass');
        expect(node.quantifier.type).toBe('+');
      },

      onCharacterClass(node, parent) {
        visited.push(node.type);

        expect(node.type === 'CharacterClass');
        expect(parent.type === 'Repetition');

        expect(node.expressions.length).toBe(1);
        expect(node.expressions[0].type).toBe('ClassRange');
      },

      onClassRange(node, parent, prop, index) {
        visited.push(node.type);

        expect(node.type === 'ClassRange');
        expect(parent.type === 'CharacterClass');

        expect(node.from.type).toBe('Char');
        expect(node.to.type).toBe('Char');

        expect(prop).toBe('expressions');
        expect(index).toBe(0);
      },

      onChar(node, parent) {
        visited.push(node.type);

        expect(node.type === 'Char');
        expect(parent.type === 'ClassRange');
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
      'Char',
    ]);
  });

});