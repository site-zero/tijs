import {
  CheckProps,
  InputBoxProps,
  InputDatetimeProps,
  InputNumProps,
  LabelProps,
  ToggleProps,
} from "../../";
import { useObjColumns } from "./use-obj-columns";

export function init_ti_std_columns() {
  const _ofs = useObjColumns();

  //--------------------------------------------------
  // 通用: 只读标签
  //--------------------------------------------------
  _ofs.addColumn("#ID", {
    name: "id",
    title: "ID",
    comType: "TiLabel",
    comConf: {
      placeholder: "i18n:nil",
      boxRadius: "none",
    } as LabelProps,
  });

  _ofs.addColumn("#LABEL", {
    comType: "TiLabel",
    comConf: {
      placeholder: "i18n:nil",
      boxRadius: "none",
    } as LabelProps,
  });

  _ofs.addColumn("ct", {
    name: "ct",
    title: "i18n:wn-obj-ct",
    type: "AMS",
    width: 150,
    comType: "TiLabel",
    comConf: {
      placeholder: "i18n:unknown",
      valuePiping: "$DT",
    } as LabelProps,
  });

  _ofs.addColumn("ct-txt", {
    name: "ct",
    title: "i18n:wn-obj-ct",
    type: "AMS",
    width: 130,
    comType: "TiLabel",
    comConf: {
      placeholder: "i18n:unknown",
      valuePiping: "$TIME_TEXT",
    } as LabelProps,
  });

  _ofs.addColumn("lm", {
    name: "lm",
    title: "i18n:wn-obj-lm",
    type: "AMS",
    width: 150,
    comType: "TiLabel",
    comConf: {
      placeholder: "i18n:unknown",
      valuePiping: "$DT",
    } as LabelProps,
  });

  _ofs.addColumn("lm-txt", {
    name: "lm",
    title: "i18n:wn-obj-lm",
    type: "AMS",
    width: 130,
    comType: "TiLabel",
    comConf: {
      placeholder: "i18n:unknown",
      valuePiping: "$TIME_TEXT",
    } as LabelProps,
  });

  //--------------------------------------------------
  // 通用: 文本输入
  //--------------------------------------------------
  _ofs.addColumn("#INPUT", {
    type: "String",
    activatedComType: "TiInput",
    activatedComConf: {
      trimed: true,
      hideBorder: true,
      autoSelect: true,
      autoFocus: true,
      boxFontSize: "s",
      boxPadding: "s",
      boxRadius: "none",
    } as InputBoxProps,
  });

  _ofs.addColumn("#TEXT", {
    type: "String",
    activatedComType: "TiInput",
    activatedComConf: {
      trimed: true,
      hideBorder: true,
      autoSelect: true,
      autoFocus: true,
      boxFontSize: "s",
      boxPadding: "s",
      boxRadius: "none",
    } as InputBoxProps,
  });

  _ofs.addColumn("#INPUT-UPPER", {
    type: "String",
    activatedComType: "TiInput",
    activatedComConf: {
      trimed: true,
      hideBorder: true,
      autoSelect: true,
      boxFontSize: "s",
      boxPadding: "s",
      boxRadius: "none",
      valueCase: "upperAll",
    } as InputBoxProps,
  });

  //--------------------------------------------------
  // 通用: 数字输入
  //--------------------------------------------------
  _ofs.addColumn("#INPUT-I", {
    type: "String",
    readonlyComType: "TiLabel",
    readonlyComConf: {
      align: "right",
      type: "disable",
      boxRadius: "none",
    } as LabelProps,
    activatedComType: "TiInputNum",
    activatedComConf: {
      precision: 1,
      hideBorder: true,
      boxRadius: "none",
    } as InputNumProps,
  });

  _ofs.addColumn("#INPUT-F2", {
    type: "String",
    readonlyComType: "TiLabel",
    readonlyComConf: {
      align: "right",
      valuePiping: "$F2",
      showBorder: false,
      type: "disable",
      boxRadius: "none",
    } as LabelProps,
    activatedComType: "TiInputNum",
    activatedComConf: {
      precision: 100,
      decimalPlaces: 2,
      boxRadius: "none",
    } as InputNumProps,
  });

  _ofs.addColumn("#INPUT-F3", {
    type: "String",
    readonlyComType: "TiLabel",
    readonlyComConf: {
      align: "right",
      valuePiping: "$F3",
      showBorder: false,
      type: "disable",
      boxRadius: "none",
    } as LabelProps,
    activatedComType: "TiInputNum",
    activatedComConf: {
      precision: 1000,
      decimalPlaces: 3,
      boxRadius: "none",
    } as InputNumProps,
  });

  _ofs.addColumn("#INPUT-F6", {
    type: "String",
    readonlyComType: "TiLabel",
    readonlyComConf: {
      align: "right",
      valuePiping: "$F6",
      showBorder: false,
      type: "disable",
      boxRadius: "none",
    } as LabelProps,
    activatedComType: "TiInputNum",
    activatedComConf: {
      precision: 1000000,
      decimalPlaces: 6,
      boxRadius: "none",
    } as InputNumProps,
  });

  _ofs.addColumn("#TOGGLE", {
    type: "Integer",
    readonlyComType: "TiLabel",
    readonlyComConf: {
      valuePiping: "BOOL",
      boxRadius: "none",
      pipeProcessers: {
        BOOL: (v: any) => {
          if (v && v > 0) {
            return "i18n:yes";
          }
          return "i18n:no";
        },
      },
    } as LabelProps,
    activatedComType: "TiToggle",
    activatedComConf: {
      texts: ["i18n:no", "i18n:yes"],
    } as ToggleProps,
  });

  _ofs.addColumn("#CHECK", {
    type: "Integer",
    readonlyComType: "TiLabel",
    readonlyComConf: {
      valuePiping: "BOOL",
      pipeProcessers: {
        BOOL: (v: any) => {
          if (v && v > 0) {
            return "i18n:yes";
          }
          return "i18n:no";
        },
      },
    } as LabelProps,
    activatedComType: "TiCheck",
    activatedComConf: {
      texts: ["i18n:no", "i18n:yes"],
      values: [0, 1],
    } as CheckProps,
  });

  //--------------------------------------------------
  // 通用: 日期时间
  //--------------------------------------------------
  _ofs.addColumn("#INPUT-DATE", {
    type: "String",
    readonlyComType: "TiLabel",
    readonlyComConf: {
      className: "is-nowrap",
      valuePiping: "$DATE",
      boxRadius: "none",
    } as LabelProps,
    activatedComType: "TiInputDate",
    activatedComConf: {
      hideBorder: true,
      autoSelect: true,
      boxFocused: true,
      boxRadius: "none",
      trimed: true,
    } as InputDatetimeProps,
  });

  _ofs.addColumn("#INPUT-DATETIME", {
    type: "String",
    comType: "TiLabel",
    comConf: {
      className: "is-nowrap",
      valuePiping: "DATETIME",
      boxRadius: "none",
    } as LabelProps,
    activatedComType: "TiInputDatetime",
    activatedComConf: {
      hideBorder: true,
      autoSelect: true,
      boxFocused: true,
      trimed: true,
      boxRadius: "none",
    } as InputDatetimeProps,
  });

  //--------------------------------------------------
  // 标准对象字段: 基本信息
  //--------------------------------------------------
  _ofs.addColumn("obj.id", { name: "id", title: "ID" });
  _ofs.addColumn("obj.pid", { name: "pid", title: "PID" });
  _ofs.addColumn("obj.nm-title-icon", {
    title: "i18n:wn-obj-nm",
    name: ["nm", "icon", "race", "mime", "tp", "title"],
    type: "Object",
    comType: "WnObjThumb",
  });
  _ofs.addColumn("obj.nm", { name: "nm", title: "i18n:wn-obj-nm" });
  _ofs.addColumn("obj.race", { name: "race", title: "i18n:wn-obj-race" });
  _ofs.addColumn("obj.sort", { name: "sort", title: "i18n:wn-obj-sort" });
  _ofs.addColumn("obj.title", { name: "title", title: "i18n:wn-obj-title" });
  // ----------------------------- 文件
  _ofs.addColumn("obj.tp", { name: "tp", title: "i18n:wn-obj-tp" });
  _ofs.addColumn("obj.mime", { name: "mime", title: "i18n:wn-obj-mime" });
  _ofs.addColumn("obj.len", {
    name: "len",
    title: "i18n:wn-obj-len",
    comConf: {
      valuePiping: "$SIZE_TEXT",
      align: "right",
    } as LabelProps,
  });
  _ofs.addColumn("obj.sha1", { name: "sha1", title: "i18n:wn-obj-sha1" });
  // ----------------------------- 权限
  _ofs.addColumn("obj.d0", { name: "d0", title: "D0" });
  _ofs.addColumn("obj.d1", { name: "d1", title: "D1" });
  _ofs.addColumn("obj.c", { name: "c", title: "i18n:wn-obj-c" });
  _ofs.addColumn("obj.m", { name: "m", title: "i18n:wn-obj-m" });
  _ofs.addColumn("obj.g", { name: "g", title: "i18n:wn-obj-g" });
  _ofs.addColumn("obj.md", { name: "md", title: "i18n:wn-obj-md" });
  // ----------------------------- 时间戳
  _ofs.addColumn("obj.ct", {
    name: "ct",
    title: "i18n:wn-obj-ct",
    type: "AMS",
    comType: "TiLabel",
    comConf: {
      placeholder: "i18n:unknown",
      valuePiping: "$TIME_TEXT",
    } as LabelProps,
  });
  _ofs.addColumn("obj.lm", {
    name: "lm",
    title: "i18n:wn-obj-lm",
    type: "AMS",
    comType: "TiLabel",
    comConf: {
      placeholder: "i18n:unknown",
      valuePiping: "$TIME_TEXT",
    } as LabelProps,
  });
  _ofs.addColumn("obj.expi", {
    name: "expi",
    title: "i18n:wn-obj-expi",
    type: "AMS",
    comType: "TiLabel",
    comConf: {
      placeholder: "i18n:unknown",
      valuePiping: "$TIME_TEXT",
    } as LabelProps,
  });
} // export function init_ti_std_columns() {
