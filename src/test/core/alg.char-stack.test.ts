import { expect, test } from 'vitest';
import { Alg } from '../../core/ti';
import _ from 'lodash';

test('simple', () => {
  let cs = new Alg.CharStack('{', '}');
  let re = cs.process('A {{x:100}} B');
  expect(re).eq('{x:100}');
});

test('toArray', () => {
  let cs = new Alg.CharStack('{', '}');
  let ss = cs.processAsArray('{{x:100}} {<abc>} {x:{n:t,b:{q:0}}}');
  expect(ss.length).eq(3);
  expect(ss[0]).eq('{x:100}');
  expect(ss[1]).eq('<abc>');
  expect(ss[2]).eq('x:{n:t,b:{q:0}}');
});

test('quote', () => {
  let cs = new Alg.CharStack('"\'');
  let re = cs.process('"abc"');
  expect(re).eq('abc');

  re = cs.process('"ab\\nc"');
  expect(re).eq('ab\nc');

  re = cs.process('\'"ab\\nc"\'');
  expect(re).eq('"ab\nc"');
});

test('quote2', () => {
  let cs = new Alg.CharStack('"\'');
  let re = cs.process('"ab\'x\\"y\'c"');
  expect(re).eq("ab'x\"y'c");
});
