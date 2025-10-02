import _ from "lodash";
import { FieldComProps, TiCom, TiRawCom, Vars } from "../../../_type";
import { Util, tiCheckComponent } from "../../../core";
export type FieldMode = {
  readonly?: boolean;
  actived?: boolean;
};

export type FieldCom = {
  rawCom: TiRawCom;
  comType: TiCom;
  comConf: Vars;
};

/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
export type FieldComFeature = {
  getComType: () => TiCom;
  getComConf: (context: Vars, val?: any) => Vars;
  getReadonlyComType: () => TiCom;
  getReadonlyComConf: (context: Vars, val?: any) => Vars;
  getActivatedComType: () => TiCom;
  getActivatedComConf: (context: Vars, val?: any) => Vars;
  autoGetComType: (status: FieldMode) => TiCom;
  autoGetComConf: (status: FieldMode, context: Vars, val?: any) => Vars;
  autoGetCom: (status: FieldMode, context: Vars, val?: any) => FieldCom;
};

export type FieldComOptions = {
  defaultComType?: string;
  defaultComConf?: Vars;
};
/*-------------------------------------------------------

                   Use Feature

-------------------------------------------------------*/
export function useFieldCom(
  props: FieldComProps,
  options: FieldComOptions = {}
): FieldComFeature {
  let { defaultComType = "TiLabel", defaultComConf = {} } = options;
  //
  //             Normal Com
  //
  function getComType() {
    return tiCheckComponent(props.comType || defaultComType);
  }
  function getComConf(context: Vars, val?: any): Vars {
    let comConf = _.cloneDeep(props.comConf ?? defaultComConf);
    if (props.dynamic) {
      comConf = Util.explainObj(context, comConf, props.explainOptions);
    }
    // 自动为控件添加值属性
    let valueKey = Util.fallback(props.autoValue, "value");
    if (valueKey && _.isUndefined(comConf[valueKey])) {
      comConf[valueKey] = val;
    }
    return comConf;
  }

  function getReadonlyComType() {
    return tiCheckComponent(props.readonlyComType || defaultComType);
  }
  function getReadonlyComConf(context: Vars, val?: any): Vars {
    let comConf = _.cloneDeep(
      props.readonlyComConf ?? props.comConf ?? defaultComConf
    );
    if (props.dynamic) {
      comConf = Util.explainObj(context, comConf);
    }

    // TODO 自动分析 comConf ，构建一个自己对应的  comConf

    // 自动为控件添加值属性
    let valueKey = Util.fallback(props.autoValue, "value");
    if (valueKey && _.isUndefined(comConf[valueKey])) {
      comConf[valueKey] = val;
    }

    // 尽量确保只读
    comConf.readonly = true;

    // 搞定
    return comConf;
  }

  function getActivatedComType() {
    return tiCheckComponent(props.activatedComType || "TiInput");
  }
  function getActivatedComConf(context: Vars, val?: any): Vars {
    let comConf = _.cloneDeep(
      props.activatedComConf ?? props.comConf ?? defaultComConf
    );
    if (props.dynamic) {
      comConf = Util.explainObj(context, comConf);
    }

    // 自动为控件添加值属性
    if (!_.isNull(props.autoValue) && _.isUndefined(comConf.value)) {
      let valueKey = props.autoValue ?? "value";
      comConf[valueKey] = val;
    }
    return comConf;
  }

  function autoGetComType(status: FieldMode = {}) {
    if (status.readonly) {
      if (props.readonlyComType) {
        return getReadonlyComType();
      }
    }
    if (status.actived) {
      if (props.activatedComType) {
        return getActivatedComType();
      }
    }
    return getComType();
  }

  function autoGetComConf(status: FieldMode, context: Vars, val?: any): Vars {
    if (status.readonly) {
      if (props.readonlyComConf) {
        return getReadonlyComConf(context, val);
      }
    }
    if (status.actived) {
      if (props.activatedComConf) {
        return getActivatedComConf(context, val);
      }
    }
    let comConf = getComConf(context, val);
    if (status.readonly) {
      comConf.readonly = true;
    }
    return comConf;
  }

  function autoGetCom(status: FieldMode, context: Vars, val?: any): FieldCom {
    let comType = autoGetComType(status);
    return {
      rawCom: comType.com,
      comType,
      comConf: autoGetComConf(status, context, val),
    };
  }

  return {
    getComType,
    getComConf,
    getReadonlyComType,
    getReadonlyComConf,
    getActivatedComType,
    getActivatedComConf,
    autoGetComType,
    autoGetComConf,
    autoGetCom,
  };
}
