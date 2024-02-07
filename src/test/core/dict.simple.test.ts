import { expect, test } from 'vitest';
import { Dicts } from '../../core/ti';

let $d = Dicts.getOrCreate(
  Dicts.makeDictOptions({
    data: async () =>
      new Promise<any[]>((resolve) => {
        resolve([
          { value: 1, text: 'A', icon: 'icon-a', tip: 'tip-a' },
          { value: 2, text: 'B', icon: 'icon-b', tip: 'tip-b' },
          { value: 3, text: 'C', icon: 'icon-c', tip: 'tip-c' },
          { value: 4, text: 'D', icon: 'icon-d', tip: 'tip-d' },
          { value: 5, text: 'E', icon: 'icon-e', tip: 'tip-e' },
        ]);
      }),
  }),
  'simple',
);

test('getData', async function () {
  let list = await $d.getData();
  expect(list.length).eq(5);
  expect(list[0].text).eq('A');
  expect(list[1].text).eq('B');
  expect(list[2].text).eq('C');
  expect(list[3].text).eq('D');
  expect(list[4].text).eq('E');
});

test('getText', async function () {
  let s = await $d.getText(2);
  expect(s).eq('B');
  s = await $d.getIcon(4);
  expect(s).eq('icon-d');
  s = await $d.getTip(5);
  expect(s).eq('tip-e');
});

test('query', async function () {
  let list = await $d.queryData('^(A|B)');
  expect(list.length).eq(2);
  expect(list[0].text).eq('A');
  expect(list[1].text).eq('B');

  list = await $d.queryData(['D', '^(A|B)']);
  expect(list.length).eq(3);
  expect(list[0].text).eq('A');
  expect(list[1].text).eq('B');
  expect(list[2].text).eq('D');

  list = await $d.queryData('[2,4)');
  expect(list.length).eq(2);
  expect(list[0].text).eq('B');
  expect(list[1].text).eq('C');
});
