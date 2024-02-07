import { expect, test } from 'vitest';
import { DateTime, setEnv } from '../../core';

test('parse_format', () => {
  let d = DateTime.parse('2021-12-23T13:14:27.981');
  expect(d?.getMilliseconds()).eq(981);
  expect('2021-12-23 13:14:27').eq(DateTime.format(d));
});

test('parse_undefined', function () {
  let reval = DateTime.parse(undefined);
  expect(true).eq(reval != null);
  let nowTs = new Date().getTime();
  let interval = nowTs - reval!.getTime();
  expect(true).eq(interval >= 0 && interval < 1000);
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
  expect(reval).eq(null);
  reval = DateTime.parse([]);
  expect(reval).eq(null);
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
  let d = DateTime.parse('2023-06-01 08:00:01.126');
  expect(d?.getMilliseconds()).eq(126);
  expect(DateTime.format(d)).eq('2023-06-01 08:00:01');

  d = DateTime.parse('21-06-12 18:00:01');
  expect(DateTime.format(d)).eq('2021-06-12 18:00:01');

  d = DateTime.parse('21-6-12 18:0:1');
  expect(DateTime.format(d)).eq('2021-06-12 18:00:01');

  d = DateTime.parse('21\\06\\12 18:00:01');
  expect(DateTime.format(d)).eq('2021-06-12 18:00:01');

  d = DateTime.parse('21/06/12 18:00:01');
  expect(DateTime.format(d)).eq('2021-06-12 18:00:01');

  d = DateTime.parse('21/06/12T18:00:01');
  expect(DateTime.format(d)).eq('2021-06-12 18:00:01');

  d = DateTime.parse('23年9月21日');
  expect(DateTime.format(d)).eq('2023-09-21 00:00:00');

  d = DateTime.parse('210612');
  expect(DateTime.format(d)).eq('2106-12-01 00:00:00');

  d = DateTime.parse('20210612180001');
  expect(d?.toJSON()).eq('2610-06-14T02:56:20.001Z');
  expect(DateTime.format(d)).eq('2610-06-14 10:56:20');

  // TODO 时区的还没测试用例, 上面注释掉的 case 解决后再补充。
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

  expect(reObj.MMM).eq('cal.abbr.Jul');
  expect(reObj.MMMM).eq('Jul');
});

test('format', function () {
  let d: Date | null = new Date();
  d.setTime(1696663703000);
  expect(DateTime.format(d)).eq('2023-10-07 15:28:23');
  expect(DateTime.format(d, { fmt: 'yyyy/MM/dd' })).eq('2023/10/07');
  expect(DateTime.format(d, { fmt: 'yyyy/MM/dd/HH/mm/ss' })).eq(
    '2023/10/07/15/28/23',
  );

  setEnv('TIMEZONE_DIFF', 3600 * 1000);
  expect(DateTime.format(d)).eq('2023-10-07 16:28:23');
  setEnv('TIMEZONE_DIFF', 0);

  d = DateTime.parse('2023-09-21 00:00:00');
  // console.log(DateTime.format(d));
  expect(DateTime.format(d)).eq('2023-09-21 00:00:00');
});

test('timeText', function () {
  let d = new Date();
  expect(DateTime.timeText(d)).eq('Just now');

  d.setTime(Date.now() - 5 * 60 * 1000);
  expect(DateTime.timeText(d)).eq('Just now');

  d.setTime(Date.now() - 30 * 60 * 1000);
  expect(DateTime.timeText(d)).eq('In 30mins');

  d.setTime(Date.now() - 23 * 3600 * 1000);
  expect(DateTime.timeText(d)).eq('In 23hours');

  d.setTime(Date.now() - 3 * 24 * 3600 * 1000);
  expect(DateTime.timeText(d)).eq('In 3days');

  d.setTime(Date.now() + 8 * 60 * 1000);
  //console.log("现在", new Date(), "测试", d)
  expect(DateTime.timeText(d)).eq('Soon');

  d.setTime(Date.now() + 30 * 60 * 1000);
  expect(DateTime.timeText(d)).eq('After 30mins');

  d.setTime(Date.now() + 10 * 3600 * 1000);
  expect(DateTime.timeText(d)).eq('After 10hours');

  d.setTime(Date.now() + 5 * 24 * 3600 * 1000);
  expect(DateTime.timeText(d)).eq('After 5days');

  let threeYearsBefore = DateTime.parse('2020-10-06 10:00:00');
  d.setTime(threeYearsBefore!.getTime());
  expect(DateTime.timeText(d)).eq('2020-10-06');
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
  let d = DateTime.parse('2023-09-02 10:30:20');
  expect(DateTime.format(DateTime.setTime(d!, 0, 0, 0, 0))).eq(
    '2023-09-02 00:00:00',
  );

  d = DateTime.parse('2023-09-02 10:30:20');
  expect(DateTime.format(DateTime.setTime(d!, 1, 2, 3, 4))).eq(
    '2023-09-02 01:02:03',
  );

  d = DateTime.parse('2023-09-02 10:30:20');
  expect(
    DateTime.format(DateTime.setTime(d!, 1, 2, 3, 4), {
      fmt: 'yyyy-MM-dd HH:mm:ss.SSS',
    }),
  ).eq('2023-09-02 01:02:03.004');

  d = DateTime.parse('2023-09-02 10:30:20');
  expect(DateTime.format(DateTime.setTime(d!, 59, 59, 59, 4))).eq(
    '2023-09-02 10:59:59',
  );

  d = DateTime.parse('2023-09-02 10:30:20');
  expect(DateTime.format(DateTime.setTime(d!, 59, 60, 60, 999))).eq(
    '2023-09-02 10:30:20',
  );
});

test('setDayLastTime', function () {
  let d = DateTime.parse('2023-08-02 10:30:20');
  expect(DateTime.format(DateTime.setDayLastTime(d!))).eq(
    '2023-08-02 23:59:59',
  );

  d = DateTime.parse('2025-02-28 10:30:20');
  expect(DateTime.format(DateTime.setDayLastTime(d!))).eq(
    '2025-02-28 23:59:59',
  );

  d = new Date();
  expect(DateTime.format(DateTime.setDayLastTime(d))).eq(
    DateTime.format(d, { fmt: 'yyyy-MM-dd' }) + ' 23:59:59',
  );
});

test('today', function () {
  let d = new Date();
  expect(DateTime.format(DateTime.today())).eq(
    DateTime.format(d, { fmt: 'yyyy-MM-dd' }) + ' 00:00:00',
  );
});

test('todayInMs', function () {
  let d = DateTime.parse(
    DateTime.format(new Date(), { fmt: 'yyyy-MM-dd' }) + ' 00:00:00',
  );
  expect(DateTime.todayInMs()).eq(d!.getTime());
});

test('countMonthDay', function () {
  let d = DateTime.parse('2023-02-28');
  expect(DateTime.countMonthDay(d!)).eq(28);

  d = DateTime.parse('2000-02-28');
  expect(DateTime.countMonthDay(d!)).eq(29);

  d = DateTime.parse('2023-08-31');
  expect(DateTime.countMonthDay(d!)).eq(31);

  d = DateTime.parse('2023-04-01');
  expect(DateTime.countMonthDay(d!)).eq(30);
});

test('moveToLastDateOfMonth', function () {
  let d = DateTime.parse('2023-02-26');
  expect(DateTime.format(DateTime.moveToLastDateOfMonth(d!))).eq(
    '2023-02-28 00:00:00',
  );

  d = DateTime.parse('2023-08-01');
  expect(DateTime.format(DateTime.moveToLastDateOfMonth(d!))).eq(
    '2023-08-31 00:00:00',
  );
});
