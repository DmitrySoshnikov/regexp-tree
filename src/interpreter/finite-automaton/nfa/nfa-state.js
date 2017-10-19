/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

const State = require('../state');
const {EPSILON} = require('../special-symbols');

/**
 * NFA state.
 *
 * Allows nondeterministic transitions to several states on the
 * same symbol, and also epsilon-transitions.
 */
class NFAState extends State {

  /**
   * Whether this state matches a string.
   *
   * We maintain set of visited epsilon-states to avoid infinite loops
   * when an epsilon-transition goes eventually to itself.
   *
   * NOTE: this function is rather "educational", since we use DFA for strings
   * matching. DFA is built on top of NFA, and uses fast transition table.
   */
  matches(string, visited = new Set()) {
    // An epsilon-state has been visited, stop to avoid infinite loop.
    if (visited.has(this)) {
      return false;
    }

    visited.add(this);

    // No symbols left..
    if (string.length === 0) {
      // .. and we're in the accepting state.
      if (this.accepting) {
        return true;
      }

      // Check if we can reach any accepting state from
      // on the epsilon transitions.
      for (const nextState of this.getTransitionsOnSymbol(EPSILON)) {
        if (nextState.matches('', visited)) {
          return true;
        }
      }
      return false;
    }

    // Else, we get some symbols.
    const symbol = string[0];
    const rest = string.slice(1);

    const symbolTransitions = this.getTransitionsOnSymbol(symbol);
    for (const nextState of symbolTransitions) {
      if (nextState.matches(rest)) {
        return true;
      }
    }

    // If we couldn't match on symbol, check still epsilon-transitions
    // without consuming the symbol (i.e. continue from `string`, not `rest`).
    for (const nextState of this.getTransitionsOnSymbol(EPSILON)) {
      if (nextState.matches(string, visited)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Returns an ε-closure for this state:
   * self + all states following ε-transitions.
   */
  getEpsilonClosure() {
    if (!this._epsilonClosure) {
      const epsilonTransitions = this.getTransitionsOnSymbol(EPSILON);
      const closure = this._epsilonClosure = new Set();
      closure.add(this);
      for (const nextState of epsilonTransitions) {
        if (!closure.has(nextState)) {
          closure.add(nextState);
          const nextClosure = nextState.getEpsilonClosure();
          nextClosure.forEach(state => closure.add(state));
        }
      }
    }

    return this._epsilonClosure;
  }
}

module.exports = NFAState;