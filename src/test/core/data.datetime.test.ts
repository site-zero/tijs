import _ from 'lodash';
import { assert, expect, test } from 'vitest';
import { DateTime, installTiCoreI18n } from '../../core';

installTiCoreI18n("en-us");

test('quickParse with ymd mode', () => {
  const cases = [
    ['2408', '2024-08-01 00:00:00'],
    ['240906', '2024-09-06 00:00:00'],
    ['20241006', '2024-10-06 00:00:00'],
    ['2403 11', '2024-03-01 11:00:00'],
    // ['2404 1102', '2024-04-01 11:02:00'],
    // ['2405 110235', '2024-05-01 11:02:35'],
    // ['240623 11:02:35', '2024-06-23 11:02:35'],
  ];

  cases.forEach(([input, expected]) => {
    const result = DateTime.quickParse(input, { mode: 'ymd' });
    assert(result, `Date '${input}' Fail to convert to Date`);
    const d_str = DateTime.format(result, { fmt: 'yyyy-MM-dd HH:mm:ss' });
    expect(d_str).eq(expected);
  });
});

test('quickParse with dmy mode', () => {
  let toyear = new Date().getFullYear();
  let yy = Math.floor(toyear / 100);
  const cases = [
    ['0108', `${toyear}-08-01 00:00:00`],
    ['060919', `${yy}19-09-06 00:00:00`],
    ['06102028', `2028-10-06 00:00:00`],
    ['0103 11', `${toyear}-03-01 11:00:00`],
    ['0104 1102', `${toyear}-04-01 11:02:00`],
    ['1705 110235', `${toyear}-05-17 11:02:35`],
    ['23061999 11:02:35', '1999-06-23 11:02:35'],
  ];

  cases.forEach(([input, expected]) => {
    const result = DateTime.quickParse(input, { mode: 'dmy' });
    assert(result, `Date '${input}' Fail to convert to Date`);
    const d_str = DateTime.format(result, { fmt: 'yyyy-MM-dd HH:mm:ss' });
    expect(d_str).eq(expected);
  });
});

test('quickParse with mdy mode', () => {
  let toyear = new Date().getFullYear();
  let yy = Math.floor(toyear / 100);
  const cases = [
    ['0801', `${toyear}-08-01 00:00:00`],
    // ['090619', `${yy}19-09-06 00:00:00`],
    // ['10062028', `2028-10-06 00:00:00`],
    // ['0301 11', `${toyear}-03-01 11:00:00`],
    // ['0401 1102', `${toyear}-04-01 11:02:00`],
    // ['0517 110235', '2024-05-17 11:02:35'],
    // ['06231999 11:02:35', '1999-06-23 11:02:35'],
  ];

  cases.forEach(([input, expected]) => {
    const result = DateTime.quickParse(input, { mode: 'mdy' });
    assert(result, `Date '${input}' Fail to convert to Date`);
    const d_str = DateTime.format(result, { fmt: 'yyyy-MM-dd HH:mm:ss' });
    expect(d_str).eq(expected);
  });
});

test('parse_time', () => {
  expect(`${DateTime.parseTime('0821')}`).eq('08:21');
  expect(`${DateTime.parseTime('082114')}`).eq('08:21:14');
  expect(`${DateTime.parseTime('1800')}`).eq('18:00');
  expect(`${DateTime.parseTime('17')}`).eq('17:00');
  expect(`${DateTime.parseTime('37')}`).eq('03:07');
});

test('parse_format', () => {
  let d = DateTime.parse('2021-12-23T13:14:27.981+08:00');
  expect(d?.getMilliseconds()).eq(981);
  expect('2021-12-23 13:14:27').eq(DateTime.format(d, { timezone: 8 }));
});

test('parse_undefined', function () {
  let reval = DateTime.parse(undefined);
  expect(true).eq(_.isUndefined(reval));
});

test('parse_today', function () {
  let today = DateTime.parse('today');
  expect(true).eq(today != null);
  let nowTs = DateTime.setTime(new Date()).getTime();
  expect(nowTs).eq(today?.getTime());
});

test('parse_now', function () {
  let now = DateTime.parse('now');
  expect(true).eq(now != null);
  let nowTs = new Date().getTime();
  let interval = nowTs - now!.getTime();
  expect(true).eq(interval >= 0 && interval < 1000);
});

test('parse_null_emptyArray', function () {
  let reval = DateTime.parse(null);
  expect(reval).eq(undefined);
  reval = DateTime.parse([]);
  expect(reval).eq(undefined);
});

test('parse_date', function () {
  let nowDate = new Date();
  let reval = DateTime.parse(nowDate);
  expect(reval?.getTime()).eq(nowDate.getTime());
});

test('parse_number', function () {
  let number = 1696321830000;
  let reval = DateTime.parse(number);
  // date.toJson 结果会默认转到UTC时区
  expect(reval?.toJSON()).eq('2023-10-03T08:30:30.000Z');
  expect(DateTime.format(reval)).eq('2023-10-03 16:30:30');
});

test('parse_string', function () {
  let d = DateTime.parse('2023-06-01 08:00:01.126+8');
  expect(d?.getMilliseconds()).eq(126);
  expect(DateTime.format(d, { timezone: 8 })).eq('2023-06-01 08:00:01');

  d = DateTime.parse('21-06-12 18:00:01+8');
  expect(DateTime.format(d, { timezone: 8 })).eq('2021-06-12 18:00:01');

  d = DateTime.parse('21-6-12 18:0:1+8');
  expect(DateTime.format(d, { timezone: 8 })).eq('2021-06-12 18:00:01');

  d = DateTime.parse('21\\06\\12 18:00:01+8');
  expect(DateTime.format(d, { timezone: 8 })).eq('2021-06-12 18:00:01');

  d = DateTime.parse('21/06/12 18:00:01+8');
  expect(DateTime.format(d, { timezone: 8 })).eq('2021-06-12 18:00:01');

  d = DateTime.parse('21/06/12T18:00:01+8');
  expect(DateTime.format(d, { timezone: 8 })).eq('2021-06-12 18:00:01');

  d = DateTime.parse('23年9月21日+8');
  expect(DateTime.format(d, { timezone: 8 })).eq('2023-09-21 00:00:00');

  d = DateTime.parse('210612+8');
  expect(DateTime.format(d, { timezone: 8 })).eq('2021-06-12 00:00:00');

  d = DateTime.parse('2021+8');
  expect(DateTime.format(d, { timezone: 8 })).eq('2021-01-01 00:00:00');
});

test('genFormatContext', function () {
  let d = new Date('2023-07-03 08:06:02.013');
  let reObj = DateTime.genFormatContext(d);
  //console.log(genFormatContext(d));
  expect(reObj.yyyy).eq(2023);
  expect(reObj.M).eq(7);
  expect(reObj.d).eq(3);
  expect(reObj.H).eq(8);
  expect(reObj.m).eq(6);
  expect(reObj.s).eq(2);
  expect(reObj.S).eq(13);

  expect(reObj.yyy).eq(2023);
  expect(reObj.yy).eq('23');
  expect(reObj.MM).eq('07');
  expect(reObj.dd).eq('03');
  expect(reObj.HH).eq('08');
  expect(reObj.mm).eq('06');
  expect(reObj.ss).eq('02');
  expect(reObj.SS).eq('013');
  expect(reObj.SSS).eq('013');

  expect(reObj.E).eq('Mon');
  expect(reObj.EE).eq('Mon');
  expect(reObj.EEEE).eq('Monday');

  expect(reObj.MMM).eq('JUL');
  expect(reObj.Mmm).eq('Jul');
  expect(reObj.MMMM).eq('July');
});

test('format', function () {
  let d: Date | null = new Date();
  d.setTime(1696663703000);
  expect(DateTime.format(d, { timezone: 8 })).eq('2023-10-07 15:28:23');
  expect(DateTime.format(d, { fmt: 'yyyy/MM/dd', timezone: 8 })).eq(
    '2023/10/07'
  );
  expect(DateTime.format(d, { fmt: 'yyyy/MM/dd/HH/mm/ss', timezone: 8 })).eq(
    '2023/10/07/15/28/23'
  );

  d = DateTime.parse('2023-09-21 00:00:00+8');
  // console.log(DateTime.format(d));
  expect(DateTime.format(d, { timezone: 8 })).eq('2023-09-21 00:00:00');
});

test('timeText', function () {
  let d = new Date();
  expect(DateTime.timeText(d)).eq('Just now');

  d.setTime(Date.now() - 5 * 60 * 1000);
  expect(DateTime.timeText(d)).eq('Just now');

  d.setTime(Date.now() - 30 * 60 * 1000);
  expect(DateTime.timeText(d)).eq('In 30 Mins');

  d.setTime(Date.now() - 23 * 3600 * 1000);
  expect(DateTime.timeText(d)).eq('In 23 Hours');

  d.setTime(Date.now() - 3 * 24 * 3600 * 1000);
  expect(DateTime.timeText(d)).eq('In 3 Days');

  d.setTime(Date.now() + 8 * 60 * 1000);
  //console.log("现在", new Date(), "测试", d)
  expect(DateTime.timeText(d)).eq('Soon');

  d.setTime(Date.now() + 30 * 60 * 1000);
  expect(DateTime.timeText(d)).eq('After 30 Mins');

  d.setTime(Date.now() + 10 * 3600 * 1000);
  expect(DateTime.timeText(d)).eq('After 10 Hours');

  d.setTime(Date.now() + 5 * 24 * 3600 * 1000);
  expect(DateTime.timeText(d)).eq('After 5 Days');

  let threeYearsBefore = DateTime.parse('2020-10-06 10:00:00');
  d.setTime(threeYearsBefore!.getTime());
  expect(DateTime.timeText(d)).eq('6 OCT 2020');
});

test('getWeekDayAbbr', function () {
  expect(DateTime.getWeekDayAbbr(0)).eq('sun');
  expect(DateTime.getWeekDayAbbr(1)).eq('mon');
  expect(DateTime.getWeekDayAbbr(2)).eq('tue');
  expect(DateTime.getWeekDayAbbr(3)).eq('wed');
  expect(DateTime.getWeekDayAbbr(4)).eq('thu');
  expect(DateTime.getWeekDayAbbr(5)).eq('fri');
  expect(DateTime.getWeekDayAbbr(6)).eq('sat');
  expect(DateTime.getWeekDayAbbr(-1)).eq('sun');
  expect(DateTime.getWeekDayAbbr(-2)).eq('sun');
  expect(DateTime.getWeekDayAbbr(7)).eq('sat');
  expect(DateTime.getWeekDayAbbr(8)).eq('sat');
  expect(DateTime.getWeekDayAbbr(108)).eq('sat');
});

test('getWeekDayName', function () {
  expect(DateTime.getWeekDayName(-100)).eq('sunday');
  expect(DateTime.getWeekDayName(-1)).eq('sunday');
  expect(DateTime.getWeekDayName(0)).eq('sunday');
  expect(DateTime.getWeekDayName(1)).eq('monday');
  expect(DateTime.getWeekDayName(2)).eq('tuesday');
  expect(DateTime.getWeekDayName(3)).eq('wednesday');
  expect(DateTime.getWeekDayName(4)).eq('thursday');
  expect(DateTime.getWeekDayName(5)).eq('friday');
  expect(DateTime.getWeekDayName(6)).eq('saturday');
  expect(DateTime.getWeekDayName(7)).eq('saturday');
  expect(DateTime.getWeekDayName(700)).eq('saturday');
});

test('getWeekDayValue', function () {
  expect(DateTime.getWeekDayValue('anythningother')).eq(-1);
  expect(DateTime.getWeekDayValue('')).eq(-1);

  expect(DateTime.getWeekDayValue('sunday')).eq(0);
  expect(DateTime.getWeekDayValue('monday')).eq(1);
  expect(DateTime.getWeekDayValue('tuesday')).eq(2);
  expect(DateTime.getWeekDayValue('wednesday')).eq(3);
  expect(DateTime.getWeekDayValue('thursday')).eq(4);
  expect(DateTime.getWeekDayValue('friday')).eq(5);
  expect(DateTime.getWeekDayValue('saturday')).eq(6);

  expect(DateTime.getWeekDayValue('sun')).eq(0);
  expect(DateTime.getWeekDayValue('mon')).eq(1);
  expect(DateTime.getWeekDayValue('tue')).eq(2);
  expect(DateTime.getWeekDayValue('wed')).eq(3);
  expect(DateTime.getWeekDayValue('thu')).eq(4);
  expect(DateTime.getWeekDayValue('fri')).eq(5);
  expect(DateTime.getWeekDayValue('sat')).eq(6);
});

test('setTime', function () {
  let d = DateTime.parse('2023-09-02 10:30:20+8');
  expect(DateTime.format(DateTime.setTime(d!, 0, 0, 0, 0), { timezone: 8 })).eq(
    '2023-09-02 00:00:00'
  );

  d = DateTime.parse('2023-09-02 10:30:20+08:00');
  expect(DateTime.format(DateTime.setTime(d!, 1, 2, 3, 4), { timezone: 8 })).eq(
    '2023-09-02 01:02:03'
  );

  d = DateTime.parse('2023-09-02 10:30:20+08:00');
  expect(
    DateTime.format(DateTime.setTime(d!, 1, 2, 3, 4), {
      fmt: 'yyyy-MM-dd HH:mm:ss.SSS',
      timezone: 8,
    })
  ).eq('2023-09-02 01:02:03.004');

  d = DateTime.parse('2023-09-02 10:30:20+08:00');
  expect(
    DateTime.format(DateTime.setTime(d!, 59, 59, 59, 4), { timezone: 8 })
  ).eq('2023-09-02 10:59:59');

  d = DateTime.parse('2023-09-02 10:30:20+8');
  expect(
    DateTime.format(DateTime.setTime(d!, 59, 60, 60, 999), { timezone: 8 })
  ).eq('2023-09-02 10:30:20');
});

test('setDayLastTime', function () {
  let d = DateTime.parse('2023-08-02 10:30:20');
  expect(DateTime.format(DateTime.setDayLastTime(d!))).eq(
    '2023-08-02 23:59:59'
  );

  d = DateTime.parse('2025-02-28 10:30:20');
  expect(DateTime.format(DateTime.setDayLastTime(d!))).eq(
    '2025-02-28 23:59:59'
  );

  d = new Date();
  expect(DateTime.format(DateTime.setDayLastTime(d))).eq(
    DateTime.format(d, { fmt: 'yyyy-MM-dd' }) + ' 23:59:59'
  );
});

test('today', function () {
  let d = new Date();
  expect(DateTime.format(DateTime.today(), { timezone: 8 })).eq(
    DateTime.format(d, { fmt: 'yyyy-MM-dd', timezone: 8 }) + ' 00:00:00'
  );
});

test('todayInMs', function () {
  let d = DateTime.parse(
    DateTime.format(new Date(), { fmt: 'yyyy-MM-dd', timezone: 8 }) +
      ' 00:00:00+8'
  );
  expect(DateTime.todayInMs()).eq(d.getTime());
});

test('countMonthDay', function () {
  let d = DateTime.parse('2023-02-28+08');
  expect(DateTime.countMonthDay(d!)).eq(28);

  d = DateTime.parse('2000-02-28');
  expect(DateTime.countMonthDay(d!)).eq(29);

  d = DateTime.parse('2023-08-31');
  expect(DateTime.countMonthDay(d!)).eq(31);

  d = DateTime.parse('2023-04-01');
  expect(DateTime.countMonthDay(d!)).eq(30);
});

test('moveToLastDateOfMonth', function () {
  let d = DateTime.parse('2023-02-26+8');
  expect(
    DateTime.format(DateTime.moveToLastDateOfMonth(d!), { timezone: 8 })
  ).eq('2023-02-28 00:00:00');

  d = DateTime.parse('2023-08-01+8');
  expect(
    DateTime.format(DateTime.moveToLastDateOfMonth(d!), { timezone: 8 })
  ).eq('2023-08-31 00:00:00');
});
