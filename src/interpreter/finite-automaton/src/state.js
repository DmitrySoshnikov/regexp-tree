/**
 * The MIT License (MIT)
 * Copyright (c) 2017-present Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 */

'use strict';

/**
 * A generic FA State class (base for NFA and DFA).
 *
 * Maintains the transition map, and the flag whether
 * the state is accepting.
 */
class State {
  constructor({
    accepting = false,
  } = {}) {

    /**
     * Outgoing transitions to other states.
     */
    this._transitions = new Map();

    /**
     * Whether the state is accepting.
     */
    this.accepting = accepting;
  }

  /**
   * Returns transitions for this state.
   */
  getTransitions() {
    return this._transitions;
  }

  /**
   * Creates a transition on symbol.
   */
  addTransition(symbol, toState) {
    this.getTransitionsOnSymbol(symbol).add(toState);
    return this;
  }

  /**
   * Returns transitions set on symbol.
   */
  getTransitionsOnSymbol(symbol) {
    let transitions = this._transitions.get(symbol);

    if (!transitions) {
      transitions = new Set();
      this._transitions.set(symbol, transitions);
    }

    return transitions;
  }
}

module.exports = State;