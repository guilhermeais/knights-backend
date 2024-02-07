export class RangeModifier {
  #min: number;
  #max: number;
  #modifier: number;

  constructor(min: number, max: number, modifier: number) {
    this.#min = min;
    this.#max = max;
    this.#modifier = modifier;

    Object.freeze(this);
  }

  isInRange(value: number): boolean {
    return value >= this.#min && value <= this.#max;
  }

  get modifier(): number {
    return this.#modifier;
  }
}
