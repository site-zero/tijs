import { expect, test } from 'vitest';
import { BusMsg, Callback1, TiBus, Vars } from '../../_type';
import { createBus } from '../../core';

function bus(): TiBus<number> {
  return createBus<number>();
}

function hdl(re: Vars, suffix: string): Callback1<BusMsg<number>> {
  return ({ data: v, name: k } = {} as BusMsg<number>) => {
    re[`${k}-${suffix}`] = v;
  };
}

test('simple-on-any', function () {
  let B = bus();
  let re = {} as Vars;

  B.on('*', ({ name: k, data: v }) => {
    re[`${k}-1`] = v;
  });

  B.on('*', ({ name: k, data: v }) => {
    re[`${k}-2`] = v;
  });

  B.emit('test', 100);
  B.emit('xyz', 88);

  expect({
    'test-1': 100,
    'test-2': 100,
    'xyz-1': 88,
    'xyz-2': 88,
  }).toStrictEqual(re);
});

test('simple-on-name', function () {
  let B = bus();
  let re = {} as Vars;

  B.on('test', ({ name: k, data: v }) => {
    re[`${k}-1`] = v;
  });

  B.on('xyz', ({ name: k, data: v }) => {
    re[`${k}-2`] = v;
  });

  B.emit('test', 100);
  B.emit('xyz', 88);

  expect({
    'test-1': 100,
    'xyz-2': 88,
  }).toStrictEqual(re);
});

test('simple-on-match', function () {
  let B = bus();
  let re = {} as Vars;

  B.on('^(a|b)', ({ name: k, data: v }) => {
    re[`${k}-ab`] = v;
  });

  B.on('p*', ({ name: k, data: v }) => {
    re[`${k}-p`] = v;
  });

  B.emit('apple', 1);
  B.emit('banana', 2);
  B.emit('grape', 3);
  B.emit('pear', 4);
  B.emit('peach', 5);

  expect({
    'apple-ab': 1,
    'banana-ab': 2,
    'pear-p': 4,
    'peach-p': 5,
  }).toStrictEqual(re);
});

test('simple-off-any', function () {
  let B = bus();
  let re = {} as Vars;
  let handler1 = ({ data: v, name: k } = {} as BusMsg<number>) => {
    re[`${k}-1`] = v;
  };
  let handler2 = ({ data: v, name: k } = {} as BusMsg<number>) => {
    re[`${k}-2`] = v;
  };
  B.on('*', handler1);
  B.on('*', handler2);

  B.off(handler1, '*');

  B.emit('test', 100);
  B.emit('xyz', 88);

  expect({
    'test-2': 100,
    'xyz-2': 88,
  }).toStrictEqual(re);
});

test('simple-off-name', function () {
  let B = bus();
  let re = {} as Vars;
  let handler1 = ({ data: v, name: k } = {} as BusMsg<number>) => {
    re[`${k}-1`] = v;
  };
  let handler2 = ({ data: v, name: k } = {} as BusMsg<number>) => {
    re[`${k}-2`] = v;
  };

  B.on('test', handler1);
  B.on('xyz', handler2);

  B.off(handler2, 'xyz');

  B.emit('test', 100);
  B.emit('xyz', 88);

  expect({
    'test-1': 100,
  }).toStrictEqual(re);
});

test('simple-off-match', function () {
  let B = bus();
  let re = {} as Vars;
  let handler1 = ({ data: v, name: k } = {} as BusMsg<number>) => {
    re[`${k}-ab`] = v;
  };
  let handler2 = ({ data: v, name: k } = {} as BusMsg<number>) => {
    re[`${k}-p`] = v;
  };

  B.on('^(a|b)', handler1);
  B.on('p*', handler2);

  B.off(handler1, '^(a|b)');

  B.emit('apple', 1);
  B.emit('banana', 2);
  B.emit('grape', 3);
  B.emit('pear', 4);
  B.emit('peach', 5);

  expect({
    'pear-p': 4,
    'peach-p': 5,
  }).toStrictEqual(re);
});

test('combo-multi', function () {
  let B = bus();
  let re = {} as Vars;
  let handler0 = hdl(re, '0');
  let handler1 = hdl(re, '1');
  let handler2 = hdl(re, '2');
  let handler3 = hdl(re, '3');

  B.on('*', handler0);
  B.on('apple', handler1);
  B.on('apple', handler2);
  B.on('^(a|b)', handler3);

  B.emit('apple', 1);
  B.emit('banana', 2);
  B.emit('grape', 3);
  B.emit('pear', 4);
  B.emit('peach', 5);

  expect({
    'apple-0': 1,
    'apple-1': 1,
    'apple-2': 1,
    'apple-3': 1,
    'banana-0': 2,
    'banana-3': 2,
    'grape-0': 3,
    'pear-0': 4,
    'peach-0': 5,
  }).toStrictEqual(re);
});

test('combo-multi-off', function () {
  let B = bus();
  let re = {} as Vars;
  let handler0 = hdl(re, '0');
  let handler1 = hdl(re, '1');
  let handler2 = hdl(re, '2');
  let handler3 = hdl(re, '3');

  B.on('*', handler0);
  B.on('apple', handler1);
  B.on('apple', handler2);
  B.on('^(a|b)', handler3);

  B.off(handler0);
  B.off(handler2);

  B.emit('apple', 1);
  B.emit('banana', 2);
  B.emit('grape', 3);
  B.emit('pear', 4);
  B.emit('peach', 5);

  expect({
    'apple-1': 1,
    'apple-3': 1,
    'banana-3': 2,
  }).toStrictEqual(re);
});
