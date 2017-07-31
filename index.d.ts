declare namespace Node {
  interface Base<T> {
    type: T;
    loc?: {
      source: string;
      start: number;
      end: number;
    };
  }

  interface SimpleChar extends Base<'Char'> {
    value: string;
    kind: 'simple';
    escaped?: true;
  }

  interface SpecialChar extends Base<'Char'> {
    value: string;
    kind: 'meta' | 'control' | 'hex' | 'decimal' | 'oct' | 'unicode';
  }

  type Char = SimpleChar | SpecialChar;

  interface ClassRange extends Base<'ClassRange'> {
    from: Char;
    to: Char;
  }

  interface CharacterClass extends Base<'CharacterClass'> {
    negative?: true;
    expressions: (Char | ClassRange)[];
  }

  interface Alternative extends Base<'Alternative'> {
    expressions: Expression[];
  }

  interface Disjunction extends Base<'Disjunction'> {
    expressions: (Expression | null)[];
  }

  interface CapturingGroup extends Base<'Group'> {
    capturing: true;
    number: number;
    name?: string;
    expression: Expression | null;
  }

  interface NoncapturingGroup extends Base<'Group'> {
    capturing: false;
    expression: Expression | null;
  }

  type Group = CapturingGroup | NoncapturingGroup;

  interface NumericBackreference extends Base<'Backreference'> {
    kind: 'number';
    number: number;
    reference: number;
  }

  interface NamedBackreference extends Base<'Backreference'> {
    kind: 'name';
    number: number;
    reference: string;
  }

  type Backreference = NumericBackreference | NamedBackreference;

  interface Repetition extends Base<'Repetition'> {
    expression: Expression;
    quantifier: Quantifier;
  }

  interface SimpleQuantifier extends Base<'Quantifier'> {
    kind: '+' | '*';
    greedy: boolean;
  }

  interface RangeQuantifier extends Base<'Quantifier'> {
    kind: 'Range';
    from: number;
    to: number;
    greedy: boolean;
  }

  type Quantifier = SimpleQuantifier | RangeQuantifier;

  interface SimpleAssertion extends Base<'Assertion'> {
    kind: '^' | '$' | '\\b' | '\\B';
  }

  interface LookaroundAssertion extends Base<'Assertion'> {
    kind: 'Lookahead' | 'Lookbehind';
    negative?: true;
    assertion: Expression | null;
  }

  type Assertion = SimpleAssertion | LookaroundAssertion;

  type Expression =
    | Char
    | CharacterClass
    | Alternative
    | Disjunction
    | Group
    | Backreference
    | Repetition
    | Assertion;

  interface RegExp extends Base<'RegExp'> {
    body: Expression | null;
    flags: string;
  }
}

interface ParserOptions {
  captureLocations?: boolean;
}

export function parse(s: string | RegExp, options?: ParserOptions): Node.RegExp;
