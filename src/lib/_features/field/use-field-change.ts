import _ from 'lodash';
import { FieldChange, FieldValueChange, I18n, Vars } from '../../../core';
import { getLogger } from '../../../core/log/ti-log';
import { Alert } from '../../_modal';
import {
  AbstractField,
  ValidateResult,
  makeFieldUniqKey,
  setFieldValue,
} from '../../_top';

const log = getLogger('ti.lib.use-record');

export type FieldChangeEmitter = {
  (eventName: 'change', payload: Vars | FieldChange[]): void;
};

/**
 * 这里集合了对一条记录的所有的相关处理逻辑，
 * 以便再控件或者数据模型中使用。 这些处理逻辑包括：
 * 1. 数据检查:
 *    a. 检查数据是否都填写了必填项目
 *    b. 检查数据格式是否符合要求
 * 2. 数据联动
 *    a. 如果某个字段的修改，自动按照设定逻辑修改关联字段
 * 3. 数据传递
 *    a. 只传递差异
 *    b. 传递合并后的数据
 *    c. 传递原始明值对列表
 */
export type FieldChangeProps<T extends AbstractField> = {
  // 通知模式
  changeMode?: DataChangeMode;

  // 数据联动
  // [uniqKey] : callback
  linkFields?: Record<string, LinkFieldLoader<T>>;

  // 提供所有字段,每个字段都定义了是否必填，以及如何检测数据合法性
  fields?: T[];
};

/**
 * 这是一个回调函数，指定了当一个字段修改后，还应该同时改动哪些字段
 *
 * 这是一个异步函数，返回如果是一个非空对象，则表示还需要修改的字段（不包括触发的字段）
 * 如果返回 `undefine` 则表示无需修改额外字段
 */
export type LinkFieldLoader<T extends AbstractField> = {
  (value: any, field: T, data: Vars): Promise<FieldValueChange[] | undefined>;
};

/**
 * 当记录修改后，怎么向外通知改动
 *
 * > 譬如，如果你修改了一个字段 `{name:'age', value: 40, oldVal:38}`
 *  - `diff` 只传递差异 `{age: 40}`
 *  - `all` 传递合并后的数据 `{... age:40 ...}`
 *  - `pair` 传递原始明值对列表: `[ {name:'age', value: 40, oldVal:38} ...]`
 */
export type DataChangeMode = 'diff' | 'all' | 'pair';

export type HandleValueChangeOptions = {
  emit: FieldChangeEmitter;
  data: Vars;
  checkEquals?: boolean;
};
/*
--------------------------------------------------------------

                       Use Feature

--------------------------------------------------------------
*/
export function useFieldChange<T extends AbstractField>(
  props: FieldChangeProps<T>
) {
  console.log('useFieldChange', props.fields);
  // 建立一个根据字段 uniqKey 对于字段的映射
  let fieldMapping = __build_fields_map(props.fields);

  //...................................................
  /**
   * 获取一个字段
   *
   * @param uniqKey 字段的唯一键
   * @returns  字段对象
   */
  function getField(uniqKey: string): T | undefined {
    return fieldMapping.get(uniqKey);
  }

  //...................................................
  async function verifyFieldChange(
    change: FieldValueChange,
    data: Vars
  ): Promise<ValidateResult> {
    let { uniqKey, value } = change;
    // 得到字段
    let field = getField(uniqKey);

    // 防守: 字段未定义
    if (!field) {
      return { type: 'FIELD_UNDEFINED' };
    }

    // 必选字段
    let val_is_nil = _.isNil(value) || (_.isString(value) && !value);
    if (val_is_nil && field.required) {
      if (field.required(data)) {
        return { type: 'VALUE_NIL' };
      }
    }

    // 指定了检查方法
    if (field.validate) {
      let re = field.validate(value, field, data);
      if (re && re.type != 'OK') {
        return re;
      }
    }

    // 指定了异步检查方法
    if (field.asyncValidate) {
      let re = await field.asyncValidate(value, field, data);
      if (re && re.type != 'OK') {
        return re;
      }
    }

    // 检查成功
    return { type: 'OK' };
  }

  //...................................................
  async function applyFieldChange(
    change: FieldValueChange,
    data: Vars
  ): Promise<FieldChange[]> {
    let { uniqKey, value, oldVal } = change;

    // 得到字段
    let field = getField(uniqKey);

    // 防守: 字段未定义
    if (!field) {
      Alert(`Field '${uniqKey}' is undefined`, { type: 'error' });
      return [];
    }

    // 准备返回值
    let reChanges = [__gen_change(change, field)];

    // 动态获取连接字段
    let loader = (props.linkFields ?? {})[uniqKey];
    if (loader) {
      let load = loader as LinkFieldLoader<T>;
      let moreChanges = await load(value, field, data);
      if (moreChanges) {
        for (let more of moreChanges) {
          let moreField = fieldMapping.get(more.uniqKey);
          if (!moreField) {
            log.warn(`Fail to found field defination [${more.uniqKey}]`, more);
            continue;
          }
          reChanges.push(__gen_change(more, moreField));
        }
      }
    }
    // 默认就是原始修改
    return reChanges;
  }

  //...................................................
  function makeChangeData(
    changes: FieldChange[],
    data?: Vars
  ): Vars | FieldChange[] {
    // 差异
    if ('diff' == props.changeMode) {
      return __merge_changed(changes, {});
    }
    // 合并数据
    else if ('all' == props.changeMode) {
      return __merge_changed(changes, data);
    }
    // 原始明值对列表
    return changes;
  }

  //...................................................
  /**
   * 根据改动列表获取与原始数据的差异数据
   *
   * @param data 原始数据
   * @param change 改动列表
   * @returns 差异数据
   */
  function getDiffData(data: Vars, change: Vars | FieldChange[]): Vars {
    let diff: Vars = {};
    let meta: Vars;

    // 原始修改数组
    if (_.isArray(change)) {
      meta = makeChangeData(change);
    }
    // 以及合并的改动
    else {
      meta = change;
    }

    _.forEach(meta, (v0, k) => {
      let vOld = _.get(data, k);
      if (!_.isEqual(vOld, v0)) {
        _.set(diff, k, v0);
      }
    });

    return diff;
  }

  //...................................................
  /**
   * 处理值的修改
   *
   * @param change 修改的值
   */
  async function handleValueChange(
    change: FieldValueChange,
    options: HandleValueChangeOptions
  ) {
    let { emit, data, checkEquals } = options;
    let msg_vars: Vars = { key: change.uniqKey, val: change.value };
    // 获取字段定义
    let field = getField(change.uniqKey);
    if (!field) {
      let msg = I18n.textf('i18n:e-field-undefined', msg_vars);
      await Alert(msg, { type: 'error' });
      return;
    }

    // 转换字段值
    if (field.serializer) {
      change.value = field.serializer(change.value, data, field.name);
    }

    // 检查一下改动
    let validation = await verifyFieldChange(change, data);
    if (validation.type != 'OK') {
      if (!field || validation.type == 'FIELD_UNDEFINED') {
        let msg =
          validation.message ?? I18n.textf('i18n:e-field-undefined', msg_vars);
        await Alert(msg, { type: 'error' });
        return;
      }
      msg_vars.title = _.get(field, 'title');
      msg_vars.tip = _.get(field, 'tip');
      if (validation.type == 'VALUE_NIL') {
        let msg = validation.message ?? I18n.textf('i18n:e-val-nil', msg_vars);
        await Alert(msg, { type: 'error' });
        return;
      }
      if (validation.type == 'VALUE_INVALID') {
        let msg =
          validation.message ??
          I18n.textf('i18n:e-field-val-invalid', msg_vars);
        await Alert(msg, { type: 'error' });
        return;
      }
    }

    // 应用连接字段
    let changes = await applyFieldChange(change, data);

    // 生成数据
    let changedData = makeChangeData(changes, data);

    // 通知改动: 防守检查相同
    if (checkEquals && !_.isEmpty(data)) {
      let diff = getDiffData(data, changedData);
      if (_.isEmpty(diff)) {
        return;
      }
    }
    // 通知改动
    emit('change', changedData);
  }

  //...................................................
  // 返回特性
  return {
    fieldMapping,
    getField, // 获取一个字段
    applyFieldChange, // 应用字段的改动，会联动连接字段
    verifyFieldChange, // 检查字段的改动是否合法
    makeChangeData, // 根据传入的模式制作需要传递的值
    getDiffData, // 根据改动列表获取与原始数据的差异数据
    handleValueChange,
  };
}

function __build_fields_map<T extends AbstractField>(
  fields?: T[]
): Map<string, T> {
  // 建立一个根据字段 uniqKey 对于字段的列表
  let map = new Map<string, T>();

  if (fields) {
    for (let i = 0; i < fields.length; i++) {
      let field = fields[i];
      let uniqKey = makeFieldUniqKey([i], field.name, field.uniqKey);
      map.set(uniqKey, field);
    }
  }

  return map;
}

function __merge_changed(changes: FieldChange[], data?: Vars): Vars {
  let meta = _.cloneDeep(data) || {};
  for (let change of changes) {
    let { name, value } = change;
    setFieldValue(name, value, meta);
  }
  return meta;
}

function __gen_change(
  change: FieldValueChange,
  field: AbstractField
): FieldChange {
  return {
    uniqKey: change.uniqKey,
    name: field.name,
    value: change.value,
    oldVal: change.oldVal,
  };
}
