import {
  CheckProps,
  DroplistProps,
  InputBoxProps,
  InputCurrencyProps,
  InputDatetimeProps,
  InputNumProps,
  InputTextProps,
  LabelProps,
  ToggleProps,
  useObjFields,
} from '../../';

export function init_ti_std_fields() {
  const _ofs = useObjFields();

  //--------------------------------------------------
  // 通用: 分隔符
  //--------------------------------------------------
  _ofs.setField('###', {
    colStart: 1,
    colSpan: 100,
  });

  //--------------------------------------------------
  // 通用: 只读标签
  //--------------------------------------------------
  _ofs.setField('#ID', {
    name: 'id',
    title: 'ID',
    comType: 'TiLabel',
    comConf: {
      placeholder: 'i18n:nil',
    } as LabelProps,
  });

  _ofs.setField('#LABEL', {
    comType: 'TiLabel',
    comConf: {
      placeholder: 'i18n:nil',
    } as LabelProps,
  });

  _ofs.setField('#LABEL-DATE', {
    type: 'AMS',
    comType: 'TiLabel',
    comConf: {
      placeholder: 'i18n:nil',
    } as LabelProps,
  });

  _ofs.setField('#LABEL-DATETIME', {
    type: 'AMS',
    comType: 'TiLabel',
    comConf: {
      placeholder: 'i18n:nil',
    } as LabelProps,
  });

  //--------------------------------------------------
  // 通用: 文本输入
  //--------------------------------------------------
  _ofs.setField('#INPUT', {
    type: 'String',
    comType: 'TiInput',
    comConf: {
      trimed: true,
      autoSelect: true,
    } as InputBoxProps,
  });

  _ofs.setField('#TEXT', {
    type: 'String',
    comType: 'TiInputText',
    comConf: {
      trimed: true,
      height: '4.2em',
    } as InputTextProps,
  });

  _ofs.setField('#INPUT-UPPER', {
    type: 'String',
    comType: 'TiInput',
    comConf: {
      trimed: true,
      autoSelect: true,
      valueCase: 'upperAll',
    } as InputBoxProps,
  });

  //--------------------------------------------------
  // 通用: 数字输入
  //--------------------------------------------------
  _ofs.setField('#INPUT-I', {
    type: 'String',
    comType: 'TiInputNum',
    comConf: {
      precision: 1,
    } as InputNumProps,
  });

  _ofs.setField('#INPUT-F2', {
    type: 'String',
    readonlyComType: 'TiLabel',
    readonlyComConf: {
      align: 'right',
      valuePiping: '$F2',
      showBorder: true,
      type: 'disable',
    } as LabelProps,
    comType: 'TiInputNum',
    comConf: {
      precision: 100,
      decimalPlaces: 2,
    } as InputNumProps,
  });

  _ofs.setField('#INPUT-F3', {
    type: 'String',
    readonlyComType: 'TiLabel',
    readonlyComConf: {
      align: 'right',
      valuePiping: '$F3',
      showBorder: true,
      type: 'disable',
    } as LabelProps,
    comType: 'TiInputNum',
    comConf: {
      precision: 1000,
      decimalPlaces: 3,
    } as InputNumProps,
  });

  _ofs.setField('#INPUT-F6', {
    type: 'String',
    readonlyComType: 'TiLabel',
    readonlyComConf: {
      align: 'right',
      valuePiping: '$F6',
      showBorder: true,
      type: 'disable',
    } as LabelProps,
    comType: 'TiInputNum',
    comConf: {
      precision: 1000000,
      decimalPlaces: 6,
    } as InputNumProps,
  });

  _ofs.setField('#TOGGLE', {
    type: 'Integer',
    comType: 'TiToggle',
    comConf: {
      texts: ['i18n:no', 'i18n:yes'],
    } as ToggleProps,
  });

  _ofs.setField('#CHECK', {
    type: 'Integer',
    comType: 'TiCheck',
    comConf: {
      texts: ['i18n:no', 'i18n:yes'],
      values: [0, 1],
    } as CheckProps,
  });

  //--------------------------------------------------
  // 通用: 货币数值
  //--------------------------------------------------
  _ofs.setField('#INPUT-CURRENCY', {
    type: 'Object',
    comType: 'TiInputCurrency',
    comConf: {
      valueKeys: ['amount', 'currency'],
      currencies: {
        mustInOptions: true,
        options: '#Currencies',
        tipListMinWidth: '350px',
        valueCase: 'upperAll',
        useRawValue: true,
        tipFormat: 'VT',
        lookup: ['^~text', '*~value'],
      },
    } as InputCurrencyProps,
  });

  //--------------------------------------------------
  // 通用: 日期时间
  //--------------------------------------------------
  _ofs.setField('#INPUT-DATE', {
    type: 'String',
    comType: 'TiInputDate',
    comConf: {} as InputDatetimeProps,
  });

  _ofs.setField('#INPUT-DATETIME', {
    type: 'String',
    comType: 'TiInputDatetime',
    comConf: {} as InputDatetimeProps,
  });

  //--------------------------------------------------
  // 通用: 下拉列表
  //--------------------------------------------------
  _ofs.setField('#DROPLIST', {
    comType: 'TiDroplist',
    comConf: {
      placeholder: `Choose`,
      options: '#Dictionary Name',
      tipListWidth: '200px',
      showCleanOption: true,
    } as DroplistProps,
  });
}
