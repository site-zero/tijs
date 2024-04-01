import { expect, test } from 'vitest';
import { Vars, Util } from '../../core/ti';
import _ from 'lodash';

test('BaseExplain', () => {
  let context = {
    name: 'xiaobai',
    age: 12,
  } as Vars;

  expect({ a: 'xiaobai', b: 12 }).toStrictEqual(
    Util.explainObj(context, {
      a: '=name',
      b: '=age',
    })
  );
});

test('InvokeExplain', () => {
  let context = {
    name: 'xiao bai',
    age: 12,
  } as Vars;

  expect({ a: 'XiaoBai' }).toStrictEqual(
    Util.explainObj(
      context,
      {
        a: '=>transName(name)',
      },
      {
        funcSet: {
          transName: (str: string) => {
            return _.upperFirst(_.camelCase(str));
          },
        },
      }
    )
  );
});

test('BoolExplain', () => {
  let context = {
    name: 'asdfasdf',
    age: 12,
  } as Vars;

  expect(true).toStrictEqual(Util.explainObj(context, '==name'));
});

test('MapExplain', () => {
  let context = {
    name: 'abc',
    age: 12,
    pet: {
      name: 'xx',
    },
  } as Vars;

  expect(
    Util.explainObj(context, { a: '=name', b: '=pet.name', c: '=age' })
  ).toStrictEqual({
    a: 'abc',
    b: 'xx',
    c: 12,
  });
});

test('ArrayExplain', () => {
  let context = {
    name: 'abc',
    age: 12,
    pet: {
      name: 'xx',
    },
  } as Vars;

  expect(
    Util.explainObj(context, ['=name', { b: '=pet.name' }, '=age'])
  ).toStrictEqual(['abc', { b: 'xx' }, 12]);
});

test('WholeContextExplain', () => {
  let context = {
    name: 'abc',
    age: 12,
    pet: {
      name: 'xx',
    },
  } as Vars;

  expect(_.get(Util.explainObj(context, '=..'), 'name')).toStrictEqual('abc');
});
