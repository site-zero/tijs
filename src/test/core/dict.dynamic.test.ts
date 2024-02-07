import { Dicts, IDict, Vars } from '../../core/ti.ts';
import _ from 'lodash';
import { expect, test } from 'vitest';

const data = [
  { value: 1, race: 'dog', text: 'wangcai' },
  { value: 2, race: 'dog', text: 'xiaohei' },
  { value: 3, race: 'dog', text: 'buck' },
  { value: 4, race: 'cat', text: 'xiaobai' },
  { value: 5, race: 'cat', text: 'miaomiao' },
];

Dicts.createDynamicDict((vars: Vars): IDict<any, any> => {
  let list = _.filter(data, (it: any) => it.race == vars.race);
  let opt = Dicts.makeDictOptions({
    data: list,
  });
  return Dicts.createDict(opt);
}, 'pet');

test('simple_pet_dogs', async () => {
  let $d = Dicts.checkDynamicDict('pet', 'dog', { race: 'dog' });
  let dogs = await $d.getData();
  expect(dogs.length).eq(3);
  expect(dogs[0].text).eq('wangcai');
  expect(dogs[1].text).eq('xiaohei');
  expect(dogs[2].text).eq('buck');

  expect(await $d.getText(1)).eq('wangcai');
  expect(await $d.getText(2)).eq('xiaohei');
  expect(await $d.getText(3)).eq('buck');
});

test('simple_pet_cats', async () => {
  let $d = Dicts.checkDynamicDict('pet', 'cat', { race: 'cat' });
  let dogs = await $d.getData();
  expect(dogs.length).eq(2);
  expect(dogs[0].text).eq('xiaobai');
  expect(dogs[1].text).eq('miaomiao');

  expect(await $d.getText(4)).eq('xiaobai');
  expect(await $d.getText(5)).eq('miaomiao');
});
