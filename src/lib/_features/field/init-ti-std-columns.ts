import {
  CheckProps,
  DroplistProps,
  InputBoxProps,
  InputDatetimeProps,
  InputNumProps,
  LabelProps,
  ToggleProps,
} from '../../';
import { DateTime, tiGetDefaultComPropValue } from '../../../';
import { useObjColumns } from './use-obj-columns';

export function init_ti_std_columns() {
  const _ofs = useObjColumns();

  //--------------------------------------------------
  // 通用: 只读标签
  //--------------------------------------------------
  _ofs.addColumn('#ID', {
    name: 'id',
    title: 'ID',
    comType: 'TiLabel',
    comConf: {
      placeholder: 'i18n:nil',
    } as LabelProps,
  });

  _ofs.addColumn('#LABEL', {
    comType: 'TiLabel',
    comConf: {
      placeholder: 'i18n:nil',
    } as LabelProps,
  });

  //--------------------------------------------------
  // 通用: 文本输入
  //--------------------------------------------------
  _ofs.addColumn('#INPUT', {
    type: 'String',
    activatedComType: 'TiInput',
    activatedComConf: {
      trimed: true,
      hideBorder: true,
      autoSelect: true,
      autoFocus: true,
      boxFontSize: 's',
      boxPadding: 's',
      boxRadius: 'none',
    } as InputBoxProps,
  });

  _ofs.addColumn('#TEXT', {
    type: 'String',
    activatedComType: 'TiInput',
    activatedComConf: {
      trimed: true,
      hideBorder: true,
      autoSelect: true,
      autoFocus: true,
      boxFontSize: 's',
      boxPadding: 's',
      boxRadius: 'none',
    } as InputBoxProps,
  });

  _ofs.addColumn('#INPUT-UPPER', {
    type: 'String',
    activatedComType: 'TiInput',
    activatedComConf: {
      trimed: true,
      hideBorder: true,
      autoSelect: true,
      boxFontSize: 's',
      boxPadding: 's',
      boxRadius: 'none',
      valueCase: 'upperAll',
    } as InputBoxProps,
  });

  //--------------------------------------------------
  // 通用: 数字输入
  //--------------------------------------------------
  _ofs.addColumn('#INPUT-I', {
    type: 'String',
    readonlyComType: 'TiLabel',
    readonlyComConf: {
      align: 'right',
      type: 'disable',
    } as LabelProps,
    comType: 'TiInputNum',
    comConf: {
      precision: 1,
    } as InputNumProps,
  });

  _ofs.addColumn('#INPUT-F2', {
    type: 'String',
    readonlyComType: 'TiLabel',
    readonlyComConf: {
      align: 'right',
      valuePiping: '$F2',
      showBorder: false,
      type: 'disable',
    } as LabelProps,
    comType: 'TiInputNum',
    comConf: {
      precision: 100,
      decimalPlaces: 2,
    } as InputNumProps,
  });

  _ofs.addColumn('#INPUT-F3', {
    type: 'String',
    readonlyComType: 'TiLabel',
    readonlyComConf: {
      align: 'right',
      valuePiping: '$F3',
      showBorder: false,
      type: 'disable',
    } as LabelProps,
    comType: 'TiInputNum',
    comConf: {
      precision: 1000,
      decimalPlaces: 3,
    } as InputNumProps,
  });

  _ofs.addColumn('#INPUT-F6', {
    type: 'String',
    readonlyComType: 'TiLabel',
    readonlyComConf: {
      align: 'right',
      valuePiping: '$F6',
      showBorder: false,
      type: 'disable',
    } as LabelProps,
    comType: 'TiInputNum',
    comConf: {
      precision: 1000000,
      decimalPlaces: 6,
    } as InputNumProps,
  });

  _ofs.addColumn('#TOGGLE', {
    type: 'Integer',
    readonlyComType: 'TiLabel',
    readonlyComConf: {
      valuePiping: 'BOOL',
      pipeProcessers: {
        BOOL: (v: any) => {
          if (v && v > 0) {
            return 'i18n:yes';
          }
          return 'i18n:no';
        },
      },
    } as LabelProps,
    comType: 'TiToggle',
    comConf: {
      texts: ['i18n:no', 'i18n:yes'],
    } as ToggleProps,
  });

  _ofs.addColumn('#CHECK', {
    type: 'Integer',
    readonlyComType: 'TiLabel',
    readonlyComConf: {
      valuePiping: 'BOOL',
      pipeProcessers: {
        BOOL: (v: any) => {
          if (v && v > 0) {
            return 'i18n:yes';
          }
          return 'i18n:no';
        },
      },
    } as LabelProps,
    comType: 'TiCheck',
    comConf: {
      texts: ['i18n:no', 'i18n:yes'],
      values: [0, 1],
    } as CheckProps,
  });

  //--------------------------------------------------
  // 通用: 日期时间
  //--------------------------------------------------
  _ofs.addColumn('#INPUT-DATE', {
    type: 'String',
    comType: 'TiLabel',
    comConf: {
      className: 'is-nowrap',
      valuePiping: 'DATE',
      pipeProcessers: {
        DATETIME: (v: any) => {
          let format = tiGetDefaultComPropValue(
            'TiInputDatetime',
            'format',
            'yyyy-MM-dd'
          );
          if (v) {
            return DateTime.format(v, { fmt: format });
          }
          return '';
        },
      },
    } as LabelProps,
    activatedComType: 'TiInputDate',
    activatedComConf: {
      hideBorder: true,
      autoSelect: true,
      boxFocused: true,
      trimed: true,
    } as InputDatetimeProps,
  });

  _ofs.addColumn('#INPUT-DATETIME', {
    type: 'String',
    comType: 'TiLabel',
    comConf: {
      className: 'is-nowrap',
      valuePiping: 'DATETIME',
      pipeProcessers: {
        DATETIME: (v: any) => {
          let format = tiGetDefaultComPropValue(
            'TiInputDatetime',
            'format',
            'yyyy-MM-dd HH:mm'
          );
          if (v) {
            return DateTime.format(v, { fmt: format });
          }
          return '';
        },
      },
    } as LabelProps,
    activatedComType: 'TiInputDatetime',
    activatedComConf: {
      hideBorder: true,
      autoSelect: true,
      boxFocused: true,
      trimed: true,
    } as InputDatetimeProps,
  });
}
