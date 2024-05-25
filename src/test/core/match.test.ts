import { expect, test } from 'vitest';
import { Match, TiMap, TiMatch } from '../../core/ti';

test('match_num', () => {
  expect(Match.test('[2,5)', 5)).eq(false);
  expect(Match.test('[2,5)', 3)).eq(true);
  expect(Match.test('[2,5)', 'abd')).eq(false);
});

test('simple', () => {
  let obj, map, vli: TiMatch;

  obj = { x: 100, y: 99 };
  map = { x: 100, y: 99 };
  vli = Match.parse(map);
  expect(vli.test(obj)).eq(true);

  map = { x: 100 };
  vli = Match.parse(map);
  expect(vli.test(obj)).eq(true);

  map = { y: 99 };
  vli = Match.parse(map);
  expect(vli.test(obj)).eq(true);

  map = { y: 98 };
  vli = Match.parse(map);
  expect(vli.test(obj)).eq(false);

  map = { z: 'notNil' };
  vli = Match.parse(map);
  expect(vli.test(obj)).eq(false);
});

test('match_str', function () {
  let obj, map, vli: TiMatch;

  obj = { name: 'xiaobai', age: 12 };
  map = { name: 'xiaobai', age: '[10, 15]' };
  vli = Match.parse(map);
  expect(vli.test(obj)).eq(true);

  map = { name: 'xiaobai', age: '[13, 15]' };
  vli = Match.parse(map);
  expect(vli.test(obj)).eq(false);

  map = { name: 'xiaobai', age: '(10, 15]' };
  vli = Match.parse(map);
  expect(vli.test(obj)).eq(true);

  map = { age: '(12, 15)' };
  vli = Match.parse(map);
  expect(vli.test(obj)).eq(false);

  map = { age: '(11.5, 15)' };
  vli = Match.parse(map);
  expect(vli.test(obj)).eq(true);

  map = { age: '(11.99, 12.000001)' };
  vli = Match.parse(map);
  expect(vli.test(obj)).eq(true);

  map = { name: '^xiao.+$' };
  vli = Match.parse(map);
  expect(vli.test(obj)).eq(true);

  // 此处 "!" 放到了正则表达式里面
  map = { name: '!^xiao.+$' };
  vli = Match.parse(map);
  expect(vli.test(obj)).eq(false);

  map = { name: "name:'^y.+$'" };
  vli = Match.parse(map);
  expect(vli.test(obj)).eq(false);
});

test('match_str_extra', function () {
  let regex, vli: TiMatch;
  regex = '!^/home/.+/(.thumbnail/gen|.publish/gen|www)';
  vli = Match.parse(regex);
  expect(vli.test('/home/demo/site/path/to/a.jpg')).eq(true);

  regex = '^/home/.+/(.thumbnail/gen|.publish/gen|www)';
  vli = Match.parse(regex);
  expect(vli.test('/home/a/athumbnail/gen')).eq(true);

  regex = '^image/';
  vli = Match.parse(regex);
  expect(vli.test('image/jpeg')).eq(true);
  expect(vli.test('image.png')).eq(false);
  expect(vli.test('image')).eq(false);
  expect(vli.test('image/')).eq(true);
});

test('match_exists_old', function () {
  let m = Match.parse({ abc: '[EXISTS]' });
  let input: TiMap = { xyz: null };
  expect(m.test(input)).eq(false);

  input = { abc: null };
  expect(m.test(input)).eq(true);

  input = { abc: true };
  expect(m.test(input)).eq(true);

  m = Match.parse({ '!abc': '[EXISTS]' });

  input = { xyz: null };
  expect(m.test(input)).eq(true);

  input = { abc: null };
  expect(m.test(input)).eq(false);

  input = { abc: true };
  expect(m.test(input)).eq(false);

  m = Match.parse({ abc: '![EXISTS]' });

  input = { xyz: null };
  expect(m.test(input)).eq(true);

  input = { abc: null };
  expect(m.test(input)).eq(false);

  input = { abc: true };
  expect(m.test(input)).eq(false);
});

test('match_exists', function () {
  let vli: TiMatch;
  let map1, map2: Map<string, any>;
  map1 = new Map([['abc', '[EXISTS]']]);
  vli = Match.parse(map1);

  map2 = new Map([['xyz', null]]);
  expect(vli.test(map2)).eq(false);

  map2 = new Map([['abc', null]]);
  expect(vli.test(map2)).eq(true);

  map1 = new Map([['!abc', '[EXISTS]']]);
  vli = Match.parse(map1);

  map2 = new Map([['xyz', null]]);
  expect(vli.test(map2)).eq(true);

  map2 = new Map([['abc', null]]);
  expect(vli.test(map2)).eq(false);

  map2 = new Map([['abc', true]]);
  expect(vli.test(map2)).eq(false);

  map1 = new Map([['abc', '![EXISTS]']]);
  vli = Match.parse(map1);

  map2 = new Map([['xyz', null]]);
  expect(vli.test(map2)).eq(true);

  map2 = new Map([['abc', null]]);
  expect(vli.test(map2)).eq(false);

  map2 = new Map([['abc', true]]);
  expect(vli.test(map2)).eq(false);
});

test('match_record', function () {
  let vli: TiMatch;
  vli = Match.parse({ name: 'xiaobai' });
  expect(vli.test({ name: 'xiaobai' })).eq(true);
  expect(vli.test({ x: 100, y: 99 })).eq(false);

  vli = Match.parse({ saving: true });
  expect(vli.test({ changed:true,saving:true })).eq(true);
  expect(vli.test({ changed:true})).eq(false);
  expect(vli.test({ changed:true,saving:false })).eq(false);
});

test('test_match_exists2', function () {
  let obj, map: Map<String, any>;
  obj = new Map([['a.b.c', '[EXISTS]']]);
  let vli: TiMatch = Match.parse(obj);

  map = new Map([['xyz', null]]);
  expect(vli.test(map)).eq(false);

  let input = { a: { b: { c: null } } };
  expect(vli.test(input)).eq(true);

  input = { a: { b: { c: true } } } as any;
  expect(vli.test(input)).eq(true);
});

test('test_blank', function () {
  let input, map, vli: TiMatch;
  map = { xyz: '[BLANK]' };
  vli = Match.parse(map);

  input = { xyz: null };
  expect(vli.test(input)).eq(true);

  input = { xyz: 'haha' };
  expect(vli.test(input)).eq(false);

  map = { xyz: '![BLANK]' };
  vli = Match.parse(map);

  input = { xyz: null };
  expect(vli.test(input)).eq(false);

  input = { xyz: 'haha' };
  expect(vli.test(input)).eq(true);
});

test('test_findInArray', function () {
  let input, map, vli: TiMatch;
  map = { matchMode: 'findInArray', matchBy: { type: 'W' } };
  vli = Match.parse(map);

  input = [
    { type: 'X', age: 24 },
    { type: 'Y', age: 25 },
  ];
  expect(vli.test(input)).eq(false);

  input = { type: 'W', age: 26 };
  expect(vli.test(input)).eq(true);
});
