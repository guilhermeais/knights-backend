import { differenceInYears } from 'date-fns';
import { EquippingMoreThanOnceWeaponError } from '../errors/equipping-more-than-once-weapon.error';
import { RangeModifier } from '../value-object/range';
import { UUID } from '../value-object/uuid';

export class Knight {
  #props: KnightProps;

  private constructor(
    private readonly _id: string,
    props: KnightProps,
  ) {
    this.#props = structuredClone(props);

    Object.freeze(this);
  }

  static create(props: KnightProps): Knight {
    const id = UUID.generate();
    const knight = new Knight(id, props);

    knight.validate();

    return knight;
  }

  static restore(id: string, props: KnightProps): Knight {
    return new Knight(id, props);
  }

  validate() {
    this.validateWeapons();
  }

  setWeapons(weapons: KnightWeapon[]) {
    this.validateWeapons(weapons);

    this.#props.weapons = weapons;
  }

  private validateWeapons(weapons = this.#props.weapons) {
    const equippedWeapons = weapons?.filter((weapon) => weapon.equipped).length;

    if (equippedWeapons > 1) {
      throw new EquippingMoreThanOnceWeaponError();
    }
  }

  get id() {
    return this._id;
  }

  get name() {
    return this.#props.name;
  }

  get nickname() {
    return this.#props.nickname;
  }

  set nickname(nickname: string) {
    this.#props.nickname = nickname;
  }

  get experience() {
    const MIN_AGE = 7;
    const age = this.getAge();

    if (age < MIN_AGE) return 0;

    return Math.floor((age - 7) * Math.pow(22, 1.45));
  }

  getAge(date: Date = new Date()): number {
    const age = differenceInYears(date, this.birthday);

    return age;
  }

  get birthday() {
    return this.#props.birthday;
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

  get keyAttributeValue() {
    return this.attributes[this.keyAttribute];
  }

  get attributes() {
    return this.#props.attributes;
  }

  get keyAttribute() {
    return this.#props.keyAttribute;
  }

  get equippedWeapon() {
    return this.#props.weapons?.find((weapon) => weapon.equipped);
  }

  get weapons() {
    return structuredClone(this.#props.weapons);
  }

  get type() {
    return this.#props.type;
  }

  toProps(): KnightProps {
    return structuredClone(this.#props);
  }
}

export type KnightProps = {
  name: string;
  nickname: string;
  birthday: Date;
  attributes: KnightAttributes;
  keyAttribute: KnightAttributesKeys;
  weapons?: KnightWeapon[];
  type: KnightType;
};

export type KnightAttributes = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

export type KnightAttributesKeys = keyof KnightAttributes;

export type KnightWeapon = {
  name: string;
  mod: number;
  attr: KnightAttributesKeys;
  equipped: boolean;
};

export enum KnightType {
  HERO = 'HERO',
  VILLAIN = 'VILLAIN',
}
