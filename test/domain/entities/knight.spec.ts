import { Knight } from '@/domain/entities/knight';
import { EquippingMoreThanOnceWeaponError } from '@/domain/errors/equipping-more-than-once-weapon.error';
import { makeKnight } from '@test/mocks/domain/entities/knight.mock';
import { parse } from 'date-fns';

describe('Knight Entity', () => {
  it('should not be possible to equip two weapons', () => {
    expect(() =>
      makeKnight({
        weapons: [
          { name: 'Sword', equipped: true, attr: 'strength', mod: 1 },
          { name: 'Axe', equipped: true, attr: 'strength', mod: 0 },
        ],
      }),
    ).toThrow(new EquippingMoreThanOnceWeaponError());
  });

  describe('getAge()', () => {
    it.each([
      {
        birthday: parse('2000/01/01', 'yyyy/MM/dd', new Date()),
        actualDate: parse('2021/01/01', 'yyyy/MM/dd', new Date()),
        expectedAge: 21,
      },
      {
        birthday: parse('2000/12/12', 'yyyy/MM/dd', new Date()),
        actualDate: parse('2021/01/01', 'yyyy/MM/dd', new Date()),
        expectedAge: 20,
      },
    ] as {
      birthday: Date;
      actualDate: Date;
      expectedAge: number;
    }[])(
      'should create a knight with the age of $expectedAge if his birthdate is $birthday and the actual date is $actualDate',
      ({ actualDate, birthday, expectedAge }) => {
        const knight = Knight.create({
          name: 'Sir Knight',
          nickname: 'Sir',
          birthday,
          attributes: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
          },
          keyAttribute: 'strength',
          weapons: [],
        });

        const age = knight.getAge(actualDate);

        expect(age).toBe(expectedAge);
      },
    );
  });

  describe('.experience', () => {
    it("should return 0 if the knight's age is less than 7", () => {
      const actualDate = parse('2021/01/01', 'yyyy/MM/dd', new Date());
      jest.useFakeTimers({
        now: actualDate,
      });

      const knight = makeKnight({
        birthday: parse('2015/01/01', 'yyyy/MM/dd', new Date()),
      });

      expect(knight.getAge()).toBe(6);
      expect(knight.experience).toBe(0);

      jest.useRealTimers();
    });

    it("should return the knight's experience based on his age", () => {
      const actualDate = parse('2021/01/01', 'yyyy/MM/dd', new Date());
      jest.useFakeTimers({
        now: actualDate,
      });

      const knight = makeKnight({
        birthday: parse('1992/01/01', 'yyyy/MM/dd', new Date()),
      });

      expect(knight.getAge()).toBe(29);
      expect(knight.experience).toBe(1945);

      jest.useRealTimers();
    });
  });

  describe('.equippedWeapon', () => {
    it('should return the equipped weapon', () => {
      const knight = makeKnight({
        weapons: [
          { name: 'Sword', equipped: false, attr: 'strength', mod: 1 },
          { name: 'Axe', equipped: true, attr: 'strength', mod: 0 },
        ],
      });

      expect(knight.equippedWeapon).toEqual({
        name: 'Axe',
        equipped: true,
        attr: 'strength',
        mod: 0,
      });
    });
  });

  describe('.attack', () => {
    it.each([
      {
        equippedWeaponMod: 0,
        keyAttributeValue: 0,
        expectedAttack: 8,
        expectedAttackModifier: -2,
      },
      {
        equippedWeaponMod: 2,
        keyAttributeValue: 0,
        expectedAttack: 10,
        expectedAttackModifier: -2,
      },
      {
        equippedWeaponMod: 0,
        keyAttributeValue: 9,
        expectedAttack: 9,
        expectedAttackModifier: -1,
      },
      {
        equippedWeaponMod: 0,
        keyAttributeValue: 11,
        expectedAttack: 10,
        expectedAttackModifier: 0,
      },
      {
        equippedWeaponMod: 0,
        keyAttributeValue: 13,
        expectedAttack: 11,
        expectedAttackModifier: 1,
      },
      {
        equippedWeaponMod: 0,
        keyAttributeValue: 16,
        expectedAttack: 12,
        expectedAttackModifier: 2,
      },
      {
        equippedWeaponMod: 0,
        keyAttributeValue: 19,
        expectedAttack: 13,
        expectedAttackModifier: 3,
      },
    ] as {
      equippedWeaponMod: number;
      keyAttributeValue: number;
      expectedAttack: number;
      expectedAttackModifier: number;
    }[])(
      'should return $expectedAttack when knight weapon mod is $equippedWeaponMod and key attribute value is $keyAttributeValue',
      ({
        expectedAttack,
        equippedWeaponMod,
        keyAttributeValue,
        expectedAttackModifier,
      }) => {
        const knight = makeKnight({
          attributes: {
            strength: keyAttributeValue,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0,
          },
          weapons: [
            {
              name: 'Sword',
              equipped: true,
              attr: 'strength',
              mod: equippedWeaponMod,
            },
          ],
          keyAttribute: 'strength',
        });

        expect(knight.attack).toBe(expectedAttack);
        expect(knight.attackModifier).toBe(expectedAttackModifier);
      },
    );
  });
});
