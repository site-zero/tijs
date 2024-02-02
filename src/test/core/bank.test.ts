import _ from "lodash";
import { expect, test } from "vitest";
import { Bank } from "../../core";

test("exchange", function () {
  expect(Bank.exchange(10)).eq(10);
  expect(
    Bank.exchange(10, {
      from: "USD",
      to: "RMB",
      exrs: {
        USD_RMB: 7.2
      }
    })
  ).eq(72);

  expect(
    Bank.exchange(12, {
      from: "USD",
      to: "RMB",
      exrs: {
        RMB_USD: 0.15
      }
    })
  ).eq(80);

  expect(
    Bank.exchange(10, {
      from: "USD",
      to: "RMB",
      bridge: "EUR",
      exrs: {
        USD_EUR: 1.2,
        EUR_RMB: 6
      }
    })
  ).eq(72);

  expect(
    Bank.exchange("10USD", {
      from: "USD",
      to: "RMB",
      bridge: "EUR",
      exrs: {
        USD_EUR: 1.2,
        EUR_RMB: 6
      }
    })
  ).eq(7200);

  expect(
    Bank.exchange("nihao", {
      from: "USD",
      to: "RMB",
      exrs: {
        USD_RMB: 7.2
      }
    })
  ).eq(undefined);
});

test("getCurrencyChar", function () {
  expect(Bank.getCurrencyChar()).eq("¥");
  expect(Bank.getCurrencyChar("RMB")).eq("¥");
  expect(Bank.getCurrencyChar("USD")).eq("$");
  expect(Bank.getCurrencyChar("EUR")).eq("€");
  expect(Bank.getCurrencyChar("JPY")).eq("¥");
});

test("getCurrencyToken", function () {
  expect(Bank.getCurrencyToken()).eq("¥");
  expect(Bank.getCurrencyToken("RMB")).eq("¥");
  expect(Bank.getCurrencyToken("USD")).eq("$");
  expect(Bank.getCurrencyToken("EUR")).eq("€");
  expect(Bank.getCurrencyToken("JPY")).eq("¥");
});

test("getCurrencyText", function () {
  expect(Bank.getCurrencyText()).eq("i18n:currency-RMB");
  expect(Bank.getCurrencyText("RMB")).eq("i18n:currency-RMB");
  expect(Bank.getCurrencyText("USD")).eq("i18n:currency-USD");
  expect(Bank.getCurrencyText("EUR")).eq("i18n:currency-EUR");
  expect(Bank.getCurrencyText("JPY")).eq("i18n:currency-JPY");
});

test("getCurrencyIcon", function () {
  expect(Bank.getCurrencyIcon()).eq("fas-yen-sign");
  expect(Bank.getCurrencyIcon("RMB")).eq("fas-yen-sign");
  expect(Bank.getCurrencyIcon("USD")).eq("fas-dollar-sign");
  expect(Bank.getCurrencyIcon("EUR")).eq("fas-euro-sign");
  expect(Bank.getCurrencyIcon("JPY")).eq("fas-yen-sign");
});

test("getCurrencyList", function () {
  expect(Bank.getCurrencyList() instanceof Array).eq(true);
  expect(Bank.getCurrencyList().length > 0).eq(true);
});

test("parseCurrency", function () {
  // 测试数字
  expect(Bank.parseCurrency(NaN)).toStrictEqual({
    cent: NaN,
    yuan: NaN,
    currency: "RMB"
  });

  expect(Bank.parseCurrency(10)).toStrictEqual({
    cent: 1000,
    yuan: 10,
    currency: "RMB"
  });

  expect(Bank.parseCurrency(10, { unit: 10 })).toStrictEqual({
    cent: 100,
    yuan: 1,
    currency: "RMB"
  });

  expect(Bank.parseCurrency(10, { unit: 10, currency: "USD" })).toStrictEqual({
    cent: 100,
    yuan: 1,
    currency: "USD"
  });

  // 测试字符串
  expect(Bank.parseCurrency("haha")).toStrictEqual({
    cent: NaN,
    yuan: NaN,
    currency: "RMB"
  });

  expect(Bank.parseCurrency("10")).toStrictEqual({
    cent: 1000,
    yuan: 10,
    currency: "RMB"
  });

  expect(Bank.parseCurrency("10USD")).toStrictEqual({
    cent: 1000,
    yuan: 10,
    currency: "USD"
  });

  expect(Bank.parseCurrency("10EUR", { unit: 10 })).toStrictEqual({
    cent: 100,
    yuan: 1,
    currency: "EUR"
  });

  expect(Bank.parseCurrency("10EURA", { unit: 10 })).toStrictEqual({
    cent: NaN,
    yuan: NaN,
    currency: "RMB"
  });

  // 测试对象
  expect(
    Bank.parseCurrency({ value: 12, currency: "USD" }, { unit: 10 })
  ).toStrictEqual({
    cent: 120,
    yuan: 1.2,
    currency: "USD"
  });

  expect(Bank.parseCurrency({ value: 12, currency: "RMB" })).toStrictEqual({
    cent: 1200,
    yuan: 12,
    currency: "RMB"
  });

  expect(
    Bank.parseCurrency({ value: 12, currency: "RMB" }, { unit: 10 })
  ).toStrictEqual({
    cent: 120,
    yuan: 1.2,
    currency: "RMB"
  });
});

test("autoYuanTokenText", function () {
  expect(Bank.autoYuanTokenText()).eq("¥0");
  expect(
    Bank.autoYuanTokenText(0, {
      auto: false
    })
  ).eq("¥0.00");

  expect(
    Bank.autoYuanTokenText(321, {
      currency: "USD",
      precision: 3,
      auto: false
    })
  ).eq("$3.210");

  expect(
    Bank.autoYuanTokenText(325, {
      precision: 1,
      auto: false
    })
  ).eq("¥3.3");
});

test("toYuanText", function () {
  expect(Bank.toYuanText(105)).eq("¥1.05");
  expect(Bank.toYuanText(-202)).eq("-¥2.02");
  expect(Bank.toYuanText(156)).eq("¥1.56");
  expect(Bank.toYuanText(6122)).eq("¥61.22");
});

test("toYuanTokenText", function () {
  expect(Bank.toYuanTokenText(105)).eq("¥1.05");
  expect(Bank.toYuanTokenText(105, "USD")).eq("$1.05");
  expect(Bank.toYuanTokenText(-5, "USD")).eq("-$0.05");
  expect(Bank.toYuanTokenText(6122, "EUR", 1)).eq("€61.2");
});

test("toYuanTokenText2", function () {
  expect(Bank.toYuanTokenText2(105)).eq("¥1.05RMB");
  expect(Bank.toYuanTokenText2(105, "USD")).eq("$1.05USD");
  expect(Bank.toYuanTokenText2(6122, "EUR", 1)).eq("€61.2EUR");
});

test("toZeroText", function () {
  expect(Bank.toZeroText(0)).eq("---");
  expect(Bank.toZeroText(0, { placeholder: "--" })).eq("--");
  expect(Bank.toZeroText(-5)).eq("-¥0.05");
  expect(Bank.toZeroText(105)).eq("¥1.05");
});

test("toZeroTokenText", function () {
  expect(Bank.toZeroTokenText(0)).eq("---");
  expect(Bank.toZeroTokenText(0, { placeholder: "**" })).eq("**");
  expect(Bank.toZeroTokenText(-5)).eq("-¥0.05");
  expect(Bank.toZeroTokenText(105)).eq("¥1.05");
  expect(Bank.toZeroTokenText(-5, { currency: "USD" })).eq("-$0.05");
  expect(Bank.toZeroTokenText(105, { currency: "EUR" })).eq("€1.05");
  expect(Bank.toZeroTokenText(105, { currency: "EUR", precision: 1 })).eq(
    "€1.1"
  );
});

test("toZeroTokenText2", function () {
  expect(Bank.toZeroTokenText2(0)).eq("---");
  expect(Bank.toZeroTokenText2(0, { placeholder: "**" })).eq("**");
  expect(Bank.toZeroTokenText2(-5)).eq("-¥0.05RMB");
  expect(Bank.toZeroTokenText2(105)).eq("¥1.05RMB");
  expect(Bank.toZeroTokenText2(-5, { currency: "USD" })).eq("-$0.05USD");
  expect(Bank.toZeroTokenText2(105, { currency: "EUR" })).eq("€1.05EUR");
  expect(Bank.toZeroTokenText2(105, { currency: "EUR", precision: 1 })).eq(
    "€1.1EUR"
  );
});

test("toChineseText", function () {
  expect(Bank.toChineseText(10)).eq("零元一角");
  expect(Bank.toChineseText(1000)).eq("十元整");
  expect(Bank.toChineseText(1030)).eq("十元三角");
  expect(Bank.toChineseText(10000030)).eq("一十万元三角");
});

test("toBankText", function () {
  expect(Bank.toBankText("10")).eq("10");
  expect(Bank.toBankText("1001")).eq("1,001");
  expect(Bank.toBankText("1001.12345")).eq("1,001.12345");
  expect(Bank.toBankText("821034121001.5")).eq("821,034,121,001.5");
  expect(Bank.toBankText("1001", { to: "right" })).eq("100,1");
  expect(Bank.toBankText("1001.1315", { to: "right" })).eq("100,1.1315");
});

test("isValidPayType", function () {
  expect(Bank.isValidPayType("wx.qrcode")).eq(true);
  expect(Bank.isValidPayType("wx.qrcode2")).eq(false);
  expect(Bank.isValidPayType("zfb.qrcode")).eq(true);
  expect(Bank.isValidPayType("paypal")).eq(true);
  expect(Bank.isValidPayType("paypals")).eq(false);
  expect(Bank.isValidPayType("true")).eq(false);
});

test("getPayTypeText", function () {
  expect(Bank.getPayTypeText("wx.qrcode")).eq("pay-by-wx-qrcode");
  expect(Bank.getPayTypeText("zfb.qrcode")).eq("pay-by-zfb-qrcode");
  expect(Bank.getPayTypeText("paypal")).eq("pay-by-paypal");
  expect(Bank.getPayTypeText("true")).eq("pay-by-true");
});
