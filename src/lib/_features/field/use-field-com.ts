import _ from 'lodash';
import { tiCheckComponent } from '../../';
import { ComRef, FuncA0, FuncA2, TiRawCom, Util, Vars } from '../../../core';

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
   * 只读模式时的显示控件。如果未指定，则采用 `TiLabel`
   * 不过会自动为 `comConf` 附加 `readonly` 属性
   *
   * @default `TiLabel`
   */
  readonlyComType?: string;
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
  activatedComType?: string;
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
  getComType: FuncA0<TiRawCom>;
  getComConf: FuncA2<Vars, any, Vars>;
  getReadonlyComType: FuncA0<TiRawCom>;
  getReadonlyComConf: FuncA2<Vars, any, Vars>;
  getActivatedComType: FuncA0<TiRawCom>;
  getActivatedComConf: FuncA2<Vars, any, Vars>;
};
/*-------------------------------------------------------

                   Use Feature

-------------------------------------------------------*/
export function useFieldCom(props: FieldComProps): FieldComFeature {
  return {
    //
    //             Normal Com
    //
    getComType() {
      return tiCheckComponent(props.comType || 'TiLabel').com;
    },
    getComConf(context, val?) {
      let comConf = Util.explainObj(context, props.comConf) ?? {};
      // 自动为控件添加值属性
      if (!_.isNull(props.autoValue) && _.isUndefined(comConf.value)) {
        let valueKey = props.autoValue ?? 'value';
        comConf[valueKey] = val;
      }
      return comConf;
    },
    //
    //             Readonly Com
    //
    getReadonlyComType() {
      return tiCheckComponent(props.readonlyComType || 'TiLabel').com;
    },
    getReadonlyComConf(context, val) {
      let comConf = Util.explainObj(context, props.readonlyComConf) || {};
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
    },
    //
    //             Activated Com
    //
    getActivatedComType() {
      return tiCheckComponent(props.activatedComType || 'TiInput').com;
    },
    getActivatedComConf(context, val) {
      let comConf = props.activatedComConf ?? props.comConf ?? {};
      comConf = Util.explainObj(context, comConf);

      // 自动为控件添加值属性
      if (!_.isNull(props.autoValue) && _.isUndefined(comConf.value)) {
        let valueKey = props.autoValue ?? 'value';
        comConf[valueKey] = val;
      }
      return comConf;
    },
  };
}
