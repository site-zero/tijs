import { expect, test } from 'vitest';
import { RectInfo } from '../../_type';
import { Rects } from '../../core';

test('explainToArray', function () {
  // Rects.createBy().;

  let arr = ['height', 'left', 'top', 'width'];
  expect(Rects.explainToArray('tlwh')).toStrictEqual(arr);

  arr = ['top', 'left', 'width', 'height'];
  expect(Rects.explainToArray('tlwh', false)).toStrictEqual(arr);

  arr = ['bottom', 'height', 'right', 'width'];
  expect(Rects.explainToArray('brwh')).toStrictEqual(arr);

  arr = ['bottom', 'right', 'width', 'height'];
  expect(Rects.explainToArray('brwh', false)).toStrictEqual(arr);

  arr = ['left', 'top'];
  expect(Rects.explainToArray('tlmn')).toStrictEqual(arr);

  arr = [];
  expect(Rects.explainToArray('adef')).toStrictEqual(arr);
});

test('pickKeys', function () {
  // let rect = Rects.createBy();
  // console.log("rect is:", rect);

  // Rects.createByInfo();

  // let params: RectInfo = { left: 0, top: 0, width: 120, height: 120 };
  // rect = Rects.createBy(params);
  // console.log("rect is:", rect);

  // let aa = { width: 120, height: 100, left: 10, top: 10 } as Rect;
  // console.log("aa:", aa);

  let ri: RectInfo = { left: 0, top: 0, width: 120, height: 120 };

  // let reObj = Rects.pickKeys(ri, "whxy");
  // console.log(reObj);

  expect(Rects.pickKeys(ri, 'whxy')).toStrictEqual({
    width: 120,
    x: NaN,
    y: NaN,
    height: 120,
  });

  expect(Rects.pickKeys(ri, 'twxb')).toStrictEqual({
    width: 120,
    x: NaN,
    bottom: NaN,
    top: 0,
  });
});

test('rectNew', function () {
  expect(1).eq(1);
  let rect = Rects.createBy({});
  expect(
    rect.width == 0 &&
      rect.height == 0 &&
      rect.left == 0 &&
      rect.right == 0 &&
      rect.top == 0 &&
      rect.bottom == 0 &&
      rect.x == 0 &&
      rect.y == 0
  ).eq(true);

  // mode: "height/left/top/width"
  let ri: RectInfo = { left: 10, top: 20, width: 120, height: 120 };
  rect = Rects.createBy(ri);
  expect(
    rect.width == 120 &&
      rect.height == 120 &&
      rect.left == 10 &&
      rect.right == 130 &&
      rect.top == 20 &&
      rect.bottom == 140 &&
      rect.x == 70 &&
      rect.y == 80
  ).eq(true);

  // mode: "height/right/top/width"
  ri = { right: 210, top: 30, width: 120, height: 120 };
  rect = Rects.createBy(ri);
  // console.log(rect);
  expect(
    rect.width == 120 &&
      rect.height == 120 &&
      rect.left == 90 &&
      rect.right == 210 &&
      rect.top == 30 &&
      rect.bottom == 150 &&
      rect.x == 150 &&
      rect.y == 90
  ).eq(true);

  // mode: "bottom/height/left/width"
  ri = { left: 190, bottom: 230, width: 90, height: 60 };
  rect = Rects.createBy(ri);
  expect(
    rect.width == 90 &&
      rect.height == 60 &&
      rect.left == 190 &&
      rect.right == 280 &&
      rect.top == 170 &&
      rect.bottom == 230 &&
      rect.x == 235 &&
      rect.y == 200
  ).eq(true);

  // mode: "bottom/height/right/width"
  ri = { width: 60, height: 90, bottom: 100, right: 70 };
  rect = Rects.createBy(ri);
  expect(
    rect.width == 60 &&
      rect.height == 90 &&
      rect.left == 10 &&
      rect.right == 70 &&
      rect.top == 10 &&
      rect.bottom == 100 &&
      rect.x == 40 &&
      rect.y == 55
  ).eq(true);

  // mode: "bottom/left/right/top"
  ri = { left: 60, top: 90, bottom: 130, right: 70 };
  rect = Rects.createBy(ri);
  expect(
    rect.width == 10 &&
      rect.height == 40 &&
      rect.left == 60 &&
      rect.right == 70 &&
      rect.top == 90 &&
      rect.bottom == 130 &&
      rect.x == 65 &&
      rect.y == 110
  ).eq(true);

  // mode: "height/width/x/y"
  ri = { width: 60, height: 30, x: 40, y: 20 };
  rect = Rects.createBy(ri);
  expect(
    rect.width == 60 &&
      rect.height == 30 &&
      rect.left == 10 &&
      rect.right == 70 &&
      rect.top == 5 &&
      rect.bottom == 35 &&
      rect.x == 40 &&
      rect.y == 20
  ).eq(true);

  // mode: "height/left/width/y"
  ri = { width: 50, height: 40, left: 40, y: 20 };
  rect = Rects.createBy(ri);
  expect(
    rect.width == 50 &&
      rect.height == 40 &&
      rect.left == 40 &&
      rect.right == 90 &&
      rect.top == 0 &&
      rect.bottom == 40 &&
      rect.x == 65 &&
      rect.y == 20
  ).eq(true);

  // mode: "height/right/width/y"
  ri = { width: 10, height: 140, right: 40, y: 120 };
  rect = Rects.createBy(ri);
  expect(
    rect.width == 10 &&
      rect.height == 140 &&
      rect.left == 30 &&
      rect.right == 40 &&
      rect.top == 50 &&
      rect.bottom == 190 &&
      rect.x == 35 &&
      rect.y == 120
  ).eq(true);

  // mode: "height/top/width/x"
  ri = { width: 60, height: 70, top: 50, x: 88 };
  rect = Rects.createBy(ri);
  expect(
    rect.width == 60 &&
      rect.height == 70 &&
      rect.left == 58 &&
      rect.right == 118 &&
      rect.top == 50 &&
      rect.bottom == 120 &&
      rect.x == 88 &&
      rect.y == 85
  ).eq(true);

  // mode: "bottom/height/width/x"
  ri = { width: 60, height: 70, bottom: 150, x: 68 };
  rect = Rects.createBy(ri);
  expect(
    rect.width == 60 &&
      rect.height == 70 &&
      rect.left == 38 &&
      rect.right == 98 &&
      rect.top == 80 &&
      rect.bottom == 150 &&
      rect.x == 68 &&
      rect.y == 115
  ).eq(true);
});

test('raw', function () {
  let rect = Rects.createBy({ left: 190, bottom: 230, width: 90, height: 60 });
  expect(
    rect.width == 90 &&
      rect.height == 60 &&
      rect.left == 190 &&
      rect.right == 280 &&
      rect.top == 170 &&
      rect.bottom == 230 &&
      rect.x == 235 &&
      rect.y == 200
  ).eq(true);

  expect(rect.raw()).toStrictEqual({
    top: 170,
    left: 190,
    width: 90,
    height: 60,
  });

  expect(rect.raw('whlr')).toStrictEqual({
    width: 90,
    height: 60,
    left: 190,
    right: 280,
  });

  expect(rect.raw('TLXY')).toStrictEqual({
    top: 170,
    left: 190,
    x: 235,
    y: 200,
  });
});

test('toCss', function () {
  let rect = Rects.createBy({ left: 190, bottom: 230, width: 90, height: 60 });
  expect(
    rect.width == 90 &&
      rect.height == 60 &&
      rect.left == 190 &&
      rect.right == 280 &&
      rect.top == 170 &&
      rect.bottom == 230 &&
      rect.x == 235 &&
      rect.y == 200
  ).eq(true);
  expect(rect.toCss('tlwh', { width: 1000, height: 600 })).toStrictEqual({
    top: 170,
    left: 190,
    width: 90,
    height: 60,
  });

  expect(rect.toCss('rb', { width: 1000, height: 600 })).toStrictEqual({
    right: 720,
    bottom: 370,
  });
});

test('relative', function () {
  let rect2 = Rects.createBy({ top: 100, left: 100, width: 150, height: 150 });

  let rect1 = Rects.createBy({ top: 150, left: 150, width: 50, height: 50 });
  rect1.relative(rect2);
  expect(rect1.raw('tlwh')).toStrictEqual({
    top: 50,
    left: 50,
    width: 50,
    height: 50,
  });

  rect1 = Rects.createBy({ top: 200, left: 200, width: 100, height: 100 });
  rect1.relative(rect2, { x: 10, y: 20 });
  expect(rect1.raw('tlwh')).toStrictEqual({
    top: 120,
    left: 110,
    width: 100,
    height: 100,
  });
});

test('zoom', function () {
  let rect = Rects.createBy({ top: 100, left: 100, width: 50, height: 60 });
  // x, y 不变，宽度变成原来的 2 倍，高度成为原来的 3 倍
  rect.zoom({ x: 2, y: 3 });
  let rect2 = Rects.createBy({ width: 100, height: 180, x: 125, y: 130 });
  expect(rect).toStrictEqual(rect2);

  rect = Rects.createBy({ top: 100, left: 100, width: 50, height: 60 });
  // x, y 不变，宽度变成原来的 0.5 倍，高度成为原来的 0.6 倍
  rect.zoom({ x: 0.5, y: 0.6 });
  rect2 = Rects.createBy({ width: 25, height: 36, x: 125, y: 130 });
  expect(rect).toStrictEqual(rect2);
});

// 等 contains 测试完毕，再来补充这个 case
test('zoomTo', function () {
  let rect = Rects.createBy({ top: 100, left: 100, width: 50, height: 60 });
  rect.zoomTo({ width: 80, height: 80 });
  // console.log("=================");
  // console.log(rect);
});

test('centreTo', function () {
  let rect = Rects.createBy({ top: 100, left: 80, width: 150, height: 160 });
  rect.centreTo({ width: 180, height: 180, top: 0, left: 0 });
  let rect2 = Rects.createBy({ x: 90, y: 90, width: 150, height: 160 });
  expect(rect).toStrictEqual(rect2);

  rect = Rects.createBy({ top: 100, left: 80, width: 140, height: 150 });
  rect.centreTo({ width: 200, height: 220, top: 10, left: 10 });
  rect2 = Rects.createBy({ x: 110, y: 120, width: 140, height: 150 });
  expect(rect).toStrictEqual(rect2);

  rect = Rects.createBy({ top: 100, left: 80, width: 110, height: 90 });
  rect.centreTo(
    { width: 100, height: 120, top: 20, left: 20 },
    { xAxis: true, yAxis: false }
  );
  rect2 = Rects.createBy({ x: 70, y: 145, width: 110, height: 90 });
  expect(rect).toStrictEqual(rect2);

  rect = Rects.createBy({ top: 100, left: 80, width: 110, height: 90 });
  rect.centreTo(
    { width: 100, height: 120, top: 20, left: 20 },
    { xAxis: false, yAxis: true }
  );
  rect2 = Rects.createBy({ x: 135, y: 80, width: 110, height: 90 });
  expect(rect).toStrictEqual(rect2);
});

test('translate', function () {
  let rect = Rects.createBy({ top: 20, left: 10, width: 110, height: 120 });
  rect.translate({ x: 10, y: 20 });
  let rect2 = Rects.createBy({ top: 40, left: 20, width: 110, height: 120 });
  expect(rect).toStrictEqual(rect2);
});

test('moveTo', function () {
  let rect = Rects.createBy({ top: 0, left: 0, width: 100, height: 120 });
  rect.moveTo({ x: 10, y: 15 }, { x: 10, y: 10 }, 'tl');
  let rect2 = Rects.createBy({ top: 5, left: 0, width: 100, height: 120 });
  expect(rect).toStrictEqual(rect2);

  rect = Rects.createBy({ top: 50, left: 60, width: 100, height: 120 });
  rect.moveTo({ x: 10, y: 15 }, { x: 10, y: 10 }, 'rt');
  rect2 = Rects.createBy({ top: 5, right: 20, width: 100, height: 120 });
  expect(rect).toStrictEqual(rect2);
});

// 占位
test('dockTo', function () {});
test('dockIn', function () {});
test('wrap', function () {});
test('wrapCut', function () {});

test('union', function () {
  let rect1 = Rects.createBy({ top: 0, left: 15, right: 100, bottom: 100 });
  let rect2 = Rects.createBy({ top: 10, left: 10, right: 130, bottom: 120 });
  let rect3 = Rects.createBy({ top: 15, left: 5, right: 105, bottom: 130 });
  let rect4 = Rects.createBy({ top: 12, left: 25, right: 110, bottom: 90 });
  rect1.union(rect2, rect3, rect4);
  let rect5 = Rects.createBy({ top: 0, left: 5, right: 130, bottom: 130 });
  expect(rect1).toStrictEqual(rect5);
});

test('overlap', function () {
  let rect1 = Rects.createBy({ top: 0, left: 15, right: 100, bottom: 100 });
  let rect2 = Rects.createBy({ top: 10, left: 10, right: 130, bottom: 120 });
  let rect3 = Rects.createBy({ top: 15, left: 5, right: 105, bottom: 130 });
  let rect4 = Rects.createBy({ top: 12, left: 25, right: 110, bottom: 90 });
  rect1.overlap(rect2, rect3, rect4);
  let rect5 = Rects.createBy({ top: 15, left: 25, right: 100, bottom: 90 });
  expect(rect1).toStrictEqual(rect5);
});

test('contains', function () {
  let rect1 = Rects.createBy({ top: 10, left: 10, right: 130, bottom: 120 });
  let rect2 = Rects.createBy({ top: 10, left: 10, right: 130, bottom: 120 });
  expect(rect1.contains(rect2)).eq(true);
  expect(rect1.contains(rect2, 1)).eq(false);

  rect2 = Rects.createBy({ top: 10, left: 9, right: 130, bottom: 120 });
  expect(rect1.contains(rect2)).eq(false);

  rect2 = Rects.createBy({ top: 10, left: 10, right: 131, bottom: 120 });
  expect(rect1.contains(rect2)).eq(false);
});

test('containsX', function () {
  let rect1 = Rects.createBy({ top: 10, left: 10, right: 130, bottom: 120 });
  let rect2 = Rects.createBy({ top: 10, left: 10, right: 130, bottom: 120 });
  expect(rect1.containsX(rect2)).eq(true);
  expect(rect1.containsX(rect2, 1)).eq(false);

  rect2 = Rects.createBy({ top: 10, left: 15, right: 160, bottom: 120 });
  expect(rect1.containsX(rect2)).eq(false);

  rect2 = Rects.createBy({ top: 10, left: 8, right: 120, bottom: 120 });
  expect(rect1.containsX(rect2)).eq(false);
});

test('containsY', function () {
  let rect1 = Rects.createBy({ top: 10, left: 10, right: 130, bottom: 120 });
  let rect2 = Rects.createBy({ top: 10, left: 10, right: 130, bottom: 120 });
  expect(rect1.containsY(rect2)).eq(true);
  expect(rect1.containsY(rect2, 1)).eq(false);

  rect2 = Rects.createBy({ top: 15, left: 10, right: 130, bottom: 100 });
  expect(rect1.containsY(rect2)).eq(true);

  rect2 = Rects.createBy({ top: 15, left: 10, right: 130, bottom: 121 });
  expect(rect1.containsY(rect2)).eq(false);
});

test('hasPoint', function () {
  let rect = Rects.createBy({ top: 10, left: 10, right: 130, bottom: 120 });
  expect(rect.hasPoint({ x: 15, y: 16 })).eq(true);
  expect(rect.hasPoint({ x: 15, y: 16 }, 3)).eq(true);
  expect(rect.hasPoint({ x: 8, y: 16 }, 3)).eq(false);
  expect(rect.hasPoint({ x: 15, y: 9 }, 3)).eq(false);
});

test('hasPointX', function () {
  let rect = Rects.createBy({ top: 10, left: 10, right: 130, bottom: 120 });
  expect(rect.hasPointX(15)).eq(true);
  expect(rect.hasPointX(15, 2)).eq(true);
  expect(rect.hasPointX(8)).eq(false);
  expect(rect.hasPointX(135, 2)).eq(false);
});

test('hasPointY', function () {
  let rect = Rects.createBy({ top: 10, left: 10, right: 130, bottom: 120 });
  expect(rect.hasPointY(15)).eq(true);
  expect(rect.hasPointY(15, 2)).eq(true);
  expect(rect.hasPointY(8)).eq(false);
  expect(rect.hasPointY(125, 2)).eq(false);
});

test('isOverlap', function () {
  let rect1 = Rects.createBy({ top: 10, left: 10, right: 50, bottom: 50 });
  let rect2 = Rects.createBy({ top: 8, left: 8, right: 50, bottom: 50 });
  expect(rect1.isOverlap(rect2)).eq(true);
  let rect3 = Rects.createBy({ top: 61, left: 62, right: 150, bottom: 150 });
  expect(rect1.isOverlap(rect3)).eq(false);
});

test('area', function () {
  let rect = Rects.createBy({ top: 10, left: 10, right: 50, bottom: 50 });
  expect(rect.area()).eq(1600);

  rect = Rects.createBy({ top: 10, left: 10, width: 50, height: 60 });
  expect(rect.area()).eq(3000);
});
