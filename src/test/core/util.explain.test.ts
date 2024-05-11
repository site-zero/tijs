import _ from 'lodash';
import { expect, test } from 'vitest';
import { Util, Vars } from '../../core/ti';

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

test('ZeroIndexExplain', () => {
  expect(Util.explainObj({ index: 1 }, '->list.${index}')).toStrictEqual(
    'list.1'
  );
  expect(Util.explainObj({ index: 0 }, '->list.${index}')).toStrictEqual(
    'list.0'
  );
});

test('MapValExplain', () => {
  let pos = new Map<string, number>();
  pos.set('x', 100);
  pos.set('y', 99);
  let posObj = Util.mapToObj(pos);
  expect(Util.explainObj({ pos }, '=pos')).toStrictEqual(posObj);

  let aa = new Map();
  aa.set(0, 'a');
  expect(Util.explainObj({ aa }, '=aa')).toStrictEqual({ '0': 'a' });
});
