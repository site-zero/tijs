import _ from 'lodash';
import { ComRef, TiRawCom, Util, Vars, tiCheckComponent } from '../../../core';

export type FieldMode = {
  readonly?: boolean;
  actived?: boolean;
};

export type FieldCom = {
  comType: TiRawCom;
  comConf: Vars;
};

/*-------------------------------------------------------

                     Props

-------------------------------------------------------*/
export type FieldComProps = ComRef & {
  /**
   * 指定了控件的那个属性用来接收“值”。
   * 如果未指定，则相当于 `value`。
   * 如果指定为 `null` 则表示不要为控件自动设置值。
   *
   * @default `"value"`
   */
  autoValue?: string | null;

  /**
   * 动态解释字段
   */
  dynamic?: boolean;

  /**
   * 动态解释字段时，默认上下文就是 data
   * 这里可以额外补充一个 vars
   *
   * ```
   * {
   *   value : any   // 字段值
   *   data  : {..}  // 对象
   *   vars  : {..}  // 额外补充变量
   * }
   * ```
   */
  vars?: Vars;

  /**
   * 只读模式时的显示控件。如果未指定，则采用 `TiLabel`
   * 不过会自动为 `comConf` 附加 `readonly` 属性
   *
   * @default `TiLabel`
   */
  readonlyComType?: string | null;
  /**
   * 只读模式时的控件属性，默认的，会自动分析 `comType/comConf`
   * 提取必要的属性
   */
  readonlyComConf?: Vars;

  /**
   * 激活式时的显示控件。如果未指定，则采用 `TiInput`
   *
   * @default `TiLabel`
   */
  activatedComType?: string | null;
  /**
   * 激活模式时的控件属性，如果未指定，则默认采用 `comConf`
   */
  activatedComConf?: Vars;

  /**
   * 捕获字段控件修改事件的名称，默认的，如果你声明了 `activatedComType`
   * 那么这个属性就是 "change"，否则将不会捕获子控件的修改事件。
   * 当然，像 TiForm 这样的控件会有自己的定制，它无论是否有 `activatedComType`
   * 都会捕获 "change" 事件
   */
  changeEventName?: string;
};
/*-------------------------------------------------------

                     Feature

-------------------------------------------------------*/
export type FieldComFeature = {
  getComType: () => TiRawCom;
  getComConf: (context: Vars, val?: any) => Vars;
  getReadonlyComType: () => TiRawCom;
  getReadonlyComConf: (context: Vars, val?: any) => Vars;
  getActivatedComType: () => TiRawCom;
  getActivatedComConf: (context: Vars, val?: any) => Vars;
  autoGetComType: (status: FieldMode) => TiRawCom;
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
  let { defaultComType = 'TiLabel', defaultComConf = {} } = options;
  //
  //             Normal Com
  //
  function getComType() {
    return tiCheckComponent(props.comType || defaultComType).com;
  }
  function getComConf(context: Vars, val?: any): Vars {
    let comConf = _.cloneDeep(props.comConf ?? defaultComConf);
    if (props.dynamic) {
      console.log('explain', comConf);
      comConf = Util.explainObj(context, comConf);
    }
    // 自动为控件添加值属性
    let valueKey = props.autoValue ?? 'value';
    if (!_.isNull(props.autoValue) && _.isUndefined(comConf[valueKey])) {
      comConf[valueKey] = val;
    }
    return comConf;
  }

  function getReadonlyComType() {
    return tiCheckComponent(props.readonlyComType || defaultComType).com;
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
    if (!_.isNull(props.autoValue) && _.isUndefined(comConf.value)) {
      let valueKey = props.autoValue ?? 'value';
      comConf[valueKey] = val;
    }

    // 尽量确保只读
    comConf.readonly = true;

    // 搞定
    return comConf;
  }

  function getActivatedComType() {
    return tiCheckComponent(props.activatedComType || 'TiInput').com;
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
      let valueKey = props.autoValue ?? 'value';
      comConf[valueKey] = val;
    }
    return comConf;
  }

  function autoGetComType(status: FieldMode = {}): TiRawCom {
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
    return getComConf(context, val);
  }

  function autoGetCom(status: FieldMode, context: Vars, val?: any): FieldCom {
    return {
      comType: autoGetComType(status),
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
