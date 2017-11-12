# regexp-tree: Finite automaton interpreter

Finate automaton (aka finite state machines) is a classic implementation technique for regular expressions based on _regular grammars_. This allows matching strings using fast transition tables rather than recursive interpretation. On practice it is implemented either as an [NFA](https://en.wikipedia.org/wiki/Nondeterministic_finite_automaton) (Nondeterministic finate automaton) or a [DFA](https://en.wikipedia.org/wiki/Deterministic_finite_automaton) (Deterministic finite automaton).

RegExp-Tree implements both, NFA and DFA, using classic _"ε-NFA->DFA subset construction"_ technique. Resulting DFA match function is just a loop over string characters, transitioning from state to state based on this table.

You can read more on implementation details in [this series of articles](https://medium.com/@DmitrySoshnikov/building-a-regexp-machine-part-1-regular-grammars-d4986b585d7e).