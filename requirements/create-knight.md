# Criar um Knight

## Dados
- Nome;
- Apelido;
- Data de Nascimento;
- Armas
- Atributos
- Atributo Chave

## Requisitos

- ✅ Criar um **Knight**
- ✅ Deve calcular o poder de ataque de um **Knight** a partir da sua arma e de seus atributos
  - ✅ `Ataque = 10 + mod(keyAttribute) + equippedWeapon.mod`
  - ✅ Obter o modificador do atributo chave a partir da seguinte tabela:
    | Valor Do Atributo | Modificador |
    |-------------------|-------------|
    | 0-8               | -2          |
    | 9-10              | -1          |
    | 11-12             | 0           |
    | 13-15             | +1          |
    | 16-18             | +2          |
    | 19-20             | +3          |
- ✅ Deve calcular a experiência de um **Knight** de acordo com as regras abaixo:
  - ✅ Idade superior a 7 anos;
  - ✅ Formula: `exp = Math.floor((age - 7) * Math.pow(22, 1.45))`
