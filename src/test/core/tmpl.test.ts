import { expect, test } from 'vitest';
import { Vars } from '../../_type';
import { DateTime, Tmpl } from '../../core/';

test('list_index', () => {
  let vars = {
    index: 0,
  };
  let s = 'index=${index}';
  let tmpl = Tmpl.parse(s);

  let str = tmpl.render(vars);
  expect(str).eq('index=0');
});

test('loop_in_loop', () => {
  let vars = {
    users: [
      {
        name: 'wang',
        pets: [{ name: 'A' }, { name: 'B' }],
      },
      {
        name: 'zhang',
        pets: [{ name: 'C' }, { name: 'D' }],
      },
    ],
  };
  let s =
    'SEE ${=users.length} Users: ${#loop u:users}' +
    '${u.name}(' +
    '${#loop pet:u.pets}' +
    '【${pet.name}】' +
    '${#end}' +
    ')' +
    '${#end}';
  let tmpl = Tmpl.parse(s);

  let str = tmpl.render(vars);
  expect(str).eq('SEE 2 Users: wang(【A】【B】)zhang(【C】【D】)');
});

test('branch_in_loop', () => {
  let vars = {
    pets: [{ name: 'cat' }, { name: 'dog' }],
    foods: [{ name: 'cake' }, { name: 'banana' }],
  };

  let input =
    '${#loop pet,i=1 : pets}' +
    "${#if 'pet.name' : 'cat' }" +
    '${i}-CAT: ${pet.name}' +
    "${#else-if 'pet.name' : 'dog' }" +
    '${i}-DOG: ${pet.name}' +
    '${#else}' +
    '${i} - Unkown: ${pet.name}' +
    '${#end}' +
    ' > ' +
    '${#end}';
  let tmpl = Tmpl.parse(input);

  let str = tmpl.render(vars);
  expect(str).eq('1-CAT: cat > 2-DOG: dog > ');
});

test('loop_in_branch', () => {
  let vars = {
    pets: [{ name: 'cat' }, { name: 'dog' }],
    foods: [{ name: 'cake' }, { name: 'banana' }],
  } as Vars;

  let input =
    "${#if a:'[0,100)'}" +
    '${#loop pet,i=1 : pets}${i}.${pet.name};${#end}' +
    "${#else-if a:'[100,200)'}" +
    '${#loop fo,i=1 : foods}${i}.${fo.name};${#end}' +
    '${#else}' +
    'NoNo' +
    '${#end}';
  let tmpl = Tmpl.parse(input);

  vars.a = 99;
  let str = tmpl.render(vars);
  expect(str).eq('1.cat;2.dog;');

  vars.a = 100;
  str = tmpl.render(vars);
  expect(str).eq('1.cake;2.banana;');

  vars.a = 300;
  str = tmpl.render(vars);
  expect(str).eq('NoNo');
});

test('loop', () => {
  let vars = {
    a: 100,
    b: 20,
    pets: [{ name: 'xiaobai' }, { name: 'xiaohei' }],
  };

  let tmpl = '${#loop pet,i=1 : pets}${i}.${pet.name};${#end}';
  let str = Tmpl.exec(tmpl, vars);
  expect(str).eq('1.xiaobai;2.xiaohei;');
});

test('branch_if_not', () => {
  let vars = { a: 100, b: 20 };

  let str = Tmpl.exec("${#if not a:'[0,99]'}A=${a}${#else}B=${b}${#end}", vars);
  expect(str).eq('A=100');

  str = Tmpl.exec("${#if not a:'[0,100]'}A=${a}${#else}B=${b}${#end}", vars);
  expect(str).eq('B=20');
});

test('branch_if', () => {
  let vars = { a: 100, b: 20 };

  let str = Tmpl.exec("${#if a:'[0,99]'}A=${a}${#else}B=${b}${#end}", vars);
  expect(str).eq('B=20');

  vars.a = 80;
  str = Tmpl.exec("${#if a:'[0,99]'}A=${a}${#else}B=${b}${#end}", vars);
  expect(str).eq('A=80');
});

test('simple', () => {
  expect(Tmpl.exec('a=${a}', { a: 100, b: 20 })).eq('a=100');
});

test('uppercase', () => {
  expect(Tmpl.exec('${s<string:upper>}', { s: 'abc' })).eq('ABC');
});

test('getOr', () => {
  expect(Tmpl.exec('${b|a?-nil-}', { a: 'AAA' })).eq('AAA');
});

test('dft_true_false', () => {
  let context = { a: true };
  expect(Tmpl.exec('${a<boolean:x>}', context)).eq('x');
  expect(Tmpl.exec('${a<boolean:x/>}', context)).eq('');
  expect(Tmpl.exec('${a<boolean:x/y>}', context)).eq('y');
  expect(Tmpl.exec('${a<boolean:/x>}', context)).eq('x');
});

test('string_replace', () => {
  expect(
    Tmpl.exec("${path<:@trim;@replace'/','-';@replace'~'>}", {
      path: '  ~/a/b/c  ',
    })
  ).eq('-a-b-c');
});

test('EL', () => {
  expect(Tmpl.exec('${=a.length}', { a: ['A', 'B'] })).eq('2');
});

test('string_mapping', () => {
  expect(Tmpl.exec('${fruit(::A=Apple,B=Banana,C=Cherry)}', { fruit: 'A' })).eq(
    'Apple'
  );
  expect(Tmpl.exec('${fruit(::A=Apple,B=Banana,C=Cherry)}', { fruit: 'C' })).eq(
    'Cherry'
  );
});

test('bracket_mode', () => {
  expect(Tmpl.exec('A${b(int)?89}C', { b: 100 })).eq('A100C');
  expect(Tmpl.exec('A${b(int)?89}C')).eq('A89C');
});

test('json_format', () => {
  expect(Tmpl.exec('${a<json>}')).eq('null');
  expect(Tmpl.exec('${a<json>}', { a: null })).eq('null');
  expect(Tmpl.exec('${a<json:c>}', { a: { x: 100, y: 99 } })).eq(
    `{x:100,y:99}`
  );
  expect(Tmpl.exec('${a<json:cq>}', { a: { x: 100, y: 99 } })).eq(
    `{"x":100,"y":99}`
  );
  expect(Tmpl.exec('${a<json>?}')).eq(`''`);
  expect(Tmpl.exec('${a<json>?[]}')).eq(`[]`);
  expect(Tmpl.exec('${a<json>?-array-}')).eq(`[]`);
  expect(Tmpl.exec('${a<json>?-obj-}')).eq(`{}`);
  expect(Tmpl.exec('${a<json>?-obj-}', { a: 'xyz' })).eq(`'xyz'`);
  expect(Tmpl.exec('${a<json:cq>?-obj-}', { a: { k: [3, true, 'a'] } })).eq(
    `{"k":[3,true,"a"]}`
  );
});

test('string_format', () => {
  expect(Tmpl.exec('A${b<:%-4s>?}C', { b: 'B' })).eq('AB   C');
});

test('escape', () => {
  expect(Tmpl.exec('A$${b}C', { b: 'BB' })).eq('A${b}C');
  expect(Tmpl.exec('$${${x}}', { x: 'A' })).eq('${A}');
});

test('dynamic_dft', () => {
  expect(Tmpl.exec('A${b?@x}C', { x: 'B' })).eq('ABC');
});

test('empty_dft', () => {
  expect(Tmpl.exec('A${b?}C', { x: 'B' })).eq('AC');
  expect(Tmpl.exec('A${b?}C', { b: 'B' })).eq('ABC');
});

// TODO lodash 的 _.get 并不支持下面复杂的路径获取，还需要特殊处理
test('special_key', () => {
  expect(Tmpl.exec('A${a-b}C', { 'a-b': 'B' })).eq('ABC');
  expect(Tmpl.exec("A${'a.b'}C", { 'a.b': 'B' })).eq('ABC');
  expect(
    Tmpl.exec("A${pos[0].'x.x'}C", { pos: [{ 'x.x': 1 }, { 'y.y': 2 }] })
  ).eq('A1C');
  expect(
    Tmpl.exec("A${pos[1].'y.y'}C", { pos: [{ 'x.x': 1 }, { 'y.y': 2 }] })
  ).eq('A2C');
});

test('string', () => {
  expect(Tmpl.exec('A${a.b}C', { a: { b: 'B' } })).eq('ABC');
  expect(Tmpl.exec('A${a.b[1]}C', { a: { b: ['A', 'B', 'C'] } })).eq('ABC');
  expect(Tmpl.exec('A${a?B}C')).eq('ABC');
});

test('int', () => {
  expect(Tmpl.exec('${n<int:%03d>}', { n: 3 })).eq('003');
  expect(Tmpl.exec('${n<int:%03X>}', { n: 16 })).eq('010');
});

test('float', () => {
  expect(Tmpl.exec('${n<float>}', { n: 3 })).eq('3.00');
  expect(Tmpl.exec('${n<float>?.984}')).eq('0.98');
});

test('date', () => {
  let d = new Date();
  let ms = d.getTime();
  let sd = DateTime.format(d, { fmt: 'yyyy-MM-dd HH:mm:ss' });
  expect(Tmpl.exec('${d<date>}', { d: ms })).eq(sd);
  expect(Tmpl.exec('${d<date:yyyy-MM-dd>}', { d: sd })).eq(
    DateTime.format(d, { fmt: 'yyyy-MM-dd' })
  );
  expect(Tmpl.exec('${xyz<date:yyyy-MM-dd>?}', {})).eq('');
});

test('boolean', () => {
  expect(Tmpl.exec('${v<boolean:no/yes>}', { v: true })).eq('yes');
  expect(Tmpl.exec('${v<boolean:no/yes>}', { v: false })).eq('no');
  expect(Tmpl.exec('${v<boolean:no/yes>?false}')).eq('no');

  expect(Tmpl.exec('${v<boolean:否/是>}', { v: true })).eq('是');
  expect(Tmpl.exec('${v<boolean:否/是>}', { v: false })).eq('否');
  expect(Tmpl.exec('${v<boolean:否/是>?false}')).eq('否');

  expect(Tmpl.exec('${v<boolean>?false}')).eq('false');
  expect(Tmpl.exec('${v<boolean>?true}', {})).eq('true');

  expect(Tmpl.exec('${v<boolean>}')).eq('false');
  expect(Tmpl.exec('${v<boolean>}', {})).eq('false');

  expect(Tmpl.exec('${v<boolean:/yes>}', { v: true })).eq('yes');
  expect(Tmpl.exec('${v<boolean:/yes>}', { v: false })).eq('');
});

test('dynamic_default', () => {
  expect(Tmpl.exec('${a?=b}', { b: 'B' })).eq('B');
});
