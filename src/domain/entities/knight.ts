import { differenceInYears } from 'date-fns';
import { EquippingMoreThanOnceWeaponError } from '../errors/equipping-more-than-once-weapon.error';
import { RangeModifier } from '../value-object/range';
import { UUID } from '../value-object/uuid';

export class Knight {
  #props: KnightProps;
  #id: string;

  private constructor(props: KnightProps) {
    this.#props = structuredClone(props);
    this.#id = props.id || UUID.generate();

    Object.freeze(this);
  }

  static create(props: KnightProps): Knight {
    this.#validate(props);

    return new Knight(props);
  }

  static #validate(props: KnightProps) {
    const equippedWeapons = props.weapons?.filter(
      (weapon) => weapon.equipped,
    ).length;

    if (equippedWeapons > 1) {
      throw new EquippingMoreThanOnceWeaponError();
    }
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#props.name;
  }

  get nickname() {
    return this.#props.nickname;
  }

  get birthday() {
    return this.#props.birthday;
  }

  get attributes() {
    return this.#props.attributes;
  }

  get keyAttribute() {
    return this.#props.keyAttribute;
  }

  get keyAttributeValue() {
    return this.attributes[this.keyAttribute];
  }

  getAge(date: Date = new Date()): number {
    const age = differenceInYears(date, this.birthday);

    return age;
  }

  get experience() {
    const MIN_AGE = 7;
    const age = this.getAge();

    if (age < MIN_AGE) return 0;

    return Math.floor((age - 7) * Math.pow(22, 1.45));
  }

  get attack() {
    return 10 + this.attackModifier + (this.equippedWeapon?.mod || 0);
  }

  get attackModifier() {
    const attributteModifiers = [
      new RangeModifier(0, 8, -2),
      new RangeModifier(9, 10, -1),
      new RangeModifier(11, 12, 0),
      new RangeModifier(13, 15, 1),
      new RangeModifier(16, 18, 2),
      new RangeModifier(19, 20, 3),
    ];

    return (
      attributteModifiers.find((range) =>
        range.isInRange(this.keyAttributeValue),
      )?.modifier || 0
    );
  }

  get equippedWeapon() {
    return this.#props.weapons?.find((weapon) => weapon.equipped);
  }

  toProps(): KnightProps {
    return structuredClone(this.#props);
  }
}

export type KnightProps = {
  id?: string;
  name: string;
  nickname: string;
  birthday: Date;
  attributes: KnightAttributes;
  keyAttribute: keyof KnightAttributes;
  weapons?: KnightWeapon[];
};

export type KnightAttributes = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

export type KnightWeapon = {
  name: string;
  mod: number;
  attr: keyof KnightAttributes;
  equipped: boolean;
};
