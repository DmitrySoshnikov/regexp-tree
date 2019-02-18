/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const DFAMinimizer = require('./dfa-minimizer');

const {EPSILON_CLOSURE} = require('../special-symbols');

/**
 * DFA is build by converting from NFA (subset construction).
 */
class DFA {
  constructor(nfa) {
    this._nfa = nfa;
  }

  /**
   * Minimizes DFA.
   */
  minimize() {
    this.getTransitionTable();

    this._originalAcceptingStateNumbers = this._acceptingStateNumbers;
    this._originalTransitionTable = this._transitionTable;

    DFAMinimizer.minimize(this);
  }

  /**
   * Returns alphabet for this DFA.
   */
  getAlphabet() {
    return this._nfa.getAlphabet();
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
   * Returns original accepting states.
   */
  getOriginaAcceptingStateNumbers() {
    if (!this._originalAcceptingStateNumbers) {
      // Accepting states are determined during table construction.
      this.getTransitionTable();
    }

    return this._originalAcceptingStateNumbers;
  }

  /**
   * Sets transition table.
   */
  setTransitionTable(table) {
    this._transitionTable = table;
  }

  /**
   * Sets accepting states.
   */
  setAcceptingStateNumbers(stateNumbers) {
    this._acceptingStateNumbers = stateNumbers;
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

    this._acceptingStateNumbers = new Set();

    // Start state of DFA is E(S[nfa])
    const startState = nfaTable[nfaStates[0]][EPSILON_CLOSURE];

    // Init the worklist (states which should be in the DFA).
    const worklist = [startState];

    const alphabet = this.getAlphabet();
    const nfaAcceptingStates = this._nfa.getAcceptingStateNumbers();

    const dfaTable = {};

    // Determine whether the combined DFA state is accepting.
    const updateAcceptingStates = states => {
      for (const nfaAcceptingState of nfaAcceptingStates) {
        // If any of the states from NFA is accepting, DFA's
        // state is accepting as well.
        if (states.indexOf(nfaAcceptingState) !== -1) {
          this._acceptingStateNumbers.add(states.join(','));
          break;
        }
      }
    };

    while (worklist.length > 0) {
      const states = worklist.shift();
      const dfaStateLabel = states.join(',');
      dfaTable[dfaStateLabel] = {};

      for (const symbol of alphabet) {
        let onSymbol = [];

        // Determine whether the combined state is accepting.
        updateAcceptingStates(states);

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

          dfaTable[dfaStateLabel][symbol] = dfaOnSymbolStr;

          if (!dfaTable.hasOwnProperty(dfaOnSymbolStr)) {
            worklist.unshift(dfaStatesOnSymbol);
          }
        }
      }
    }

    return (this._transitionTable = this._remapStateNumbers(dfaTable));
  }

  /**
   * Remaps state numbers in the resulting table:
   * combined states '1,2,3' -> 1, '3,4' -> 2, etc.
   */
  _remapStateNumbers(calculatedDFATable) {
    const newStatesMap = {};

    this._originalTransitionTable = calculatedDFATable;
    const transitionTable = {};

    Object.keys(calculatedDFATable).forEach((originalNumber, newNumber) => {
      newStatesMap[originalNumber] = newNumber + 1;
    });

    for (const originalNumber in calculatedDFATable) {
      const originalRow = calculatedDFATable[originalNumber];
      const row = {};

      for (const symbol in originalRow) {
        row[symbol] = newStatesMap[originalRow[symbol]];
      }

      transitionTable[newStatesMap[originalNumber]] = row;
    }

    // Remap accepting states.
    this._originalAcceptingStateNumbers = this._acceptingStateNumbers;
    this._acceptingStateNumbers = new Set();

    for (const originalNumber of this._originalAcceptingStateNumbers) {
      this._acceptingStateNumbers.add(newStatesMap[originalNumber]);
    }

    return transitionTable;
  }

  /**
   * Returns original DFA table, where state numbers
   * are combined numbers from NFA.
   */
  getOriginalTransitionTable() {
    if (!this._originalTransitionTable) {
      // Original table is determined during table construction.
      this.getTransitionTable();
    }
    return this._originalTransitionTable;
  }

  /**
   * Checks whether this DFA accepts a string.
   */
  matches(string) {
    let state = 1;
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
