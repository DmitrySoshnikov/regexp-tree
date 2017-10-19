/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const {
  EPSILON,
  EPSILON_CLOSURE,
} = require('../special-symbols');

/**
 * DFA is build by converting from NFA (subset construction).
 */
class DFA {
  constructor(nfa) {
    this._nfa = nfa;
  }

  /**
   * Returns alphabet for this DFA.
   */
  getAlphabet() {
    return this._nfa.getAlphabet();
  }

  /**
   * Returns starting state.
   */
  getStartingStateNumber() {
    if (!this._startingStateNumber) {
      // Starting state is determined during table construction.
      this.getTransitionTable();
    }

    return this._startingStateNumber;
  }

  /**
   * Returns accepting states.
   */
  getAcceptingStateNumbers() {
    if (!this._acceptingStateNumbers) {
      // Accepting states are determined during table construction.
      this.getTransitionTable();
    }

    return this._acceptingStateNumbers;
  }

  /**
   * DFA transition table is built from NFA table.
   */
  getTransitionTable() {
    if (this._transitionTable) {
      return this._transitionTable;
    }

    // Calculate from NFA transition table.
    const nfaTable = this._nfa.getTransitionTable();
    const nfaStates = Object.keys(nfaTable);

    this._startingStateNumber = 0;
    this._acceptingStateNumbers = new Set();

    // Start state of DFA is E(S[nfa])
    const startState = nfaTable[nfaStates[0]][EPSILON_CLOSURE];

    this._startingStateNumber = startState.join(',');

    // Init the worklist (states which should be in the DFA).
    const worklist = [startState];

    const alphabet = this.getAlphabet();
    const nfaAcceptingStates = this._nfa.getAcceptingStateNumbers();

    const dfaTable = {};

    while (worklist.length > 0) {
      const states = worklist.shift();
      const dfaStateLabel = states.join(',');
      dfaTable[dfaStateLabel] = {};

      for (const symbol of alphabet) {
        let onSymbol = [];

        for (const state of states) {
          const nfaStatesOnSymbol = nfaTable[state][symbol];
          if (!nfaStatesOnSymbol) {
            continue;
          }

          for (const nfaStateOnSymbol of nfaStatesOnSymbol) {
            if (!nfaTable[nfaStateOnSymbol]) {
              continue;
            }
            onSymbol.push(...nfaTable[nfaStateOnSymbol][EPSILON_CLOSURE]);
          }
        }

        const dfaStatesOnSymbolSet = new Set(onSymbol);
        const dfaStatesOnSymbol = [...dfaStatesOnSymbolSet];

        if (dfaStatesOnSymbol.length > 0) {
          const dfaOnSymbolStr = dfaStatesOnSymbol.join(',');

          // Determine whether the combined state is accepting.
          for (const nfaAcceptingState of nfaAcceptingStates) {
            // If any of the states from NFA is accepting, DFA's
            // state is accepting as well.
            if (dfaStatesOnSymbolSet.has(nfaAcceptingState)) {
              this._acceptingStateNumbers.add(dfaOnSymbolStr);
              break;
            }
          }

          dfaTable[dfaStateLabel][symbol] = dfaOnSymbolStr;

          if (!dfaTable.hasOwnProperty(dfaOnSymbolStr)) {
            worklist.unshift(dfaStatesOnSymbol);
          }
        }
      }

    }

    return (this._transitionTable = dfaTable);
  }

  /**
   * Checks whether this DFA accepts a string.
   */
  matches(string) {
    let state = this.getStartingStateNumber();
    let i = 0;
    const table = this.getTransitionTable();

    while (string[i]) {
      state = table[state][string[i++]];
      if (!state) {
        return false;
      }
    }

    if (!this.getAcceptingStateNumbers().has(state)) {
      return false;
    }

    return true;
  }
}

module.exports = DFA;