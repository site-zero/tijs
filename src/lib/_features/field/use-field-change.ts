import _ from 'lodash';
import { computed } from 'vue';
import {
  AbstractField,
  FieldChange,
  FieldStatus,
  FieldStatusType,
  FieldValueChange,
  getFieldTypeByValue,
  getFieldUniqKey,
  LinkFieldChange,
  makeFieldUniqKey,
  mergeFieldChanges,
  ValidateResult,
  Vars,
} from '../../../_type';
import { I18n, Util } from '../../../core';
import { getLogger } from '../../../core/log/ti-log';
import { Alert } from '../../_modal';

const log = getLogger('ti.use-field-change');

export type FieldChangeValidateEvent = FieldStatus &
  Pick<AbstractField, 'name'>;

export type FieldChangeEmitter = {
  (eventName: 'change', payload: Vars): void;
  (eventName: 'change-fields', payload: FieldChange[]): void;
  (eventName: 'change-validate', payload: FieldChangeValidateEvent): void;
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

  // 检查字段的时候，如果字段未定义，则无视，全当 OK
  allowUndefinedFields?: boolean;

  /**
   * 如果字段检查失败，将不通知 chang 事件
   */
  blockInvalid?: boolean;

  /**
   * 在 applyFieldChange 的时候，总是需要一个字段定义的
   * 如果，未能找到某个字段定义，那么可以通过这个方法临时生成一个虚拟的字段
   * 如果没有提供这个函数，在没有找到字段定义的时候，则会抛错
   *
   * 如果仅仅设置为 true，则会自动创建一个默认的虚拟字段
   */
  makeVirtualField?: true | ((change: FieldValueChange) => T);

  // 数据联动
  // [uniqKey] : callback
  linkFields?: Record<string, LinkFieldLoader<T>>;
};

/**
 * 这是一个回调函数，指定了当一个字段修改后，还应该同时改动哪些字段
 *
 * 这是一个异步函数，返回如果是一个非空对象，则表示还需要修改的字段（不包括触发的字段）
 * 如果返回 `undefine` 则表示无需修改额外字段
 */
export type LinkFieldLoader<T extends AbstractField> = {
  (value: any, data: Vars, field: T): Promise<LinkFieldChange[] | undefined>;
};

/**
 * 当记录修改后，怎么向外通知改动
 *
 * > 譬如，如果你修改了一个字段 `{name:'age', value: 40, oldVal:38}`
 *  - `diff` 只传递差异 `{age: 40}`
 *  - `all` 传递合并后的数据 `{... age:40 ...}`
 *  - `pair` 传递原始明值对列表: `[ {name:'age', value: 40, oldVal:38} ...]`
 */
export type DataChangeMode = 'diff' | 'all';

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
  props: FieldChangeProps<T>,
  fields?: T[]
) {
  //console.log('useFieldChange', props.fields);
  // 建立一个根据字段 uniqKey 对于字段的映射
  let fieldMapping = __build_fields_map(fields);

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
      if (props.allowUndefinedFields) {
        return { type: 'OK' };
      }
      return { type: 'FIELD_UNDEFINED' };
    }

    // 必选字段
    let val_is_nil = _.isNil(value) || (_.isString(value) && !value);
    if (val_is_nil && field.isRequired) {
      if (field.isRequired(data)) {
        return { type: 'VALUE_NIL' };
      }
    }

    // 指定了检查方法
    if (field.validate) {
      // 异步检查
      let re = await field.validate(value, field, data);
      if (re && re.type != 'OK') {
        return re;
      }
    }

    // 检查成功
    return { type: 'OK' };
  }

  //...................................................
  const MakeVirtualField = computed(() => {
    let re: ((change: FieldValueChange) => T) | undefined;
    if (true === props.makeVirtualField) {
      re = (change: FieldValueChange) => {
        return {
          name: change.uniqKey,
          type: getFieldTypeByValue(change.value),
        } as T;
      };
    } else if (props.makeVirtualField) {
      re = props.makeVirtualField;
    }

    return re;
  });

  //...................................................
  async function applyFieldChange(
    change: FieldValueChange,
    data: Vars
  ): Promise<FieldChange[]> {
    let { uniqKey, value, oldVal } = change;
    // console.log(
    //   '>>>>>>>>>>>>>>>>>>>>>>applyFieldChange',
    //   uniqKey,
    //   value,
    //   oldVal
    // );

    // 得到字段
    let field = getField(uniqKey);

    // 防守: 字段未定义
    if (!field) {
      if (MakeVirtualField.value) {
        field = MakeVirtualField.value(change);
      }
      // 那么就警告并退出处理
      else {
        Alert(`Field '${uniqKey}' is undefined`, { type: 'danger' });
        return [];
      }
    }

    // 准备返回值
    let reChanges = [__gen_change(change, field)];

    // 动态获取连接字段
    let loader = (props.linkFields ?? {})[uniqKey];
    if (loader) {
      let load = loader as LinkFieldLoader<T>;
      let moreChanges = await load(value, data, field);
      if (moreChanges) {
        for (let more of moreChanges) {
          let morUniqKey = more.uniqKey ?? getFieldUniqKey(more.name);
          let morFld = {
            ...more,
            uniqKey: morUniqKey,
          } as FieldChange;
          let moreField = fieldMapping.get(morUniqKey);

          // 检查一下字段
          if (!moreField) {
            if (MakeVirtualField.value) {
              moreField = MakeVirtualField.value(morFld);
            }
            if (!props.allowUndefinedFields) {
              log.trace(`Fail to found field defination [${morUniqKey}]`, more);
              continue;
            }
          }

          // 推入修改
          reChanges.push(
            __gen_change(
              morFld,
              moreField ??
                ({
                  uniqKey: morUniqKey,
                  name: morFld.name,
                } as AbstractField)
            )
          );
        }
      }
    }
    //console.log('<<<<<<<<<<<<<<<<<< applyFieldChange', reChanges);

    // 默认就是原始修改
    return reChanges;
  }

  //...................................................
  function makeChangeData(changes: FieldChange[], data?: Vars): Vars {
    // 差异
    if ('diff' == props.changeMode) {
      return mergeFieldChanges(changes, {});
    }
    // 合并数据
    return mergeFieldChanges(changes, data);
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
    let meta: Vars;

    // 原始修改数组
    if (_.isArray(change)) {
      meta = makeChangeData(change);
    }
    // 以及合并的改动
    else {
      meta = change;
    }

    return Util.getRecordDiff(data, meta);
  }

  //...................................................
  async function tidyValueChange(
    change: FieldValueChange,
    options: Omit<HandleValueChangeOptions, 'emit'>,
    notifyChange: (changeData: Vars, pairs: FieldChange[], field: T) => void,
    notifyValidation?: (
      valiResult: ValidateResult,
      change: FieldValueChange,
      orgData: Vars,
      field?: T
    ) => void
  ) {
    let { data, checkEquals } = options;
    // 获取字段定义
    let field = getField(change.uniqKey);
    if (!field) {
      if (notifyValidation) {
        notifyValidation({ type: 'FIELD_UNDEFINED' }, change, data);
      }
      return;
    }
    log.debug('field=', field);

    // 转换字段值
    if (field.serializer) {
      // 无值
      if (!_.isUndefined(field.defaultAs) && _.isNil(change.value)) {
        change.value =
          '~~undefined~~' == field.defaultAs ? undefined : field.defaultAs;
      }
      // 空值
      else if (
        !_.isUndefined(field.emptyAs) &&
        !_.isBoolean(change.value) &&
        !_.isNumber(change.value) &&
        !_.isDate(change.value) &&
        !_.isRegExp(change.value) &&
        _.isEmpty(change.value)
      ) {
        change.value =
          '~~undefined~~' == field.emptyAs ? undefined : field.emptyAs;
      }
      // 正常值
      else {
        change.value = field.serializer(change.value, data, field.name);
      }
    }

    // 检查一下改动
    let validation = await verifyFieldChange(change, data);
    if (validation.type != 'OK') {
      if (notifyValidation) {
        notifyValidation(validation, change, data, field);
      }
      if (props.blockInvalid) {
        return;
      }
    }
    // 通知字段值通过检查
    else if (notifyValidation) {
      notifyValidation({ type: 'OK' }, change, data, field);
    }

    // 应用连接字段
    let changes = await applyFieldChange(change, data);
    log.debug('changes=', changes);

    // 生成数据
    let changedData = makeChangeData(changes, data);
    log.debug('changedData=', changedData);

    // 通知改动: 防守检查相同
    if (checkEquals && !_.isEmpty(data)) {
      let diff = getDiffData(data, changedData);
      if (_.isEmpty(diff)) {
        log.debug('Empty Diff then return');
        return;
      }
      log.debug('notify diff=', diff);
      notifyChange(changedData, changes, field);
    }
    // 通知改动
    else {
      log.debug('notify change', changedData);
      notifyChange(changedData, changes, field);
    }
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
    let { emit } = options;
    //console.log('handleValueChange', change);
    await tidyValueChange(
      change,
      options,
      (data, changes) => {
        emit('change', data);
        emit('change-fields', changes);
      },
      async (validation, change, data, field) => {
        let msg_vars: Vars = {
          key: change.uniqKey,
          val: change.value,
          title: _.get(field, 'title') ?? field?.uniqKey,
          tip: _.get(field, 'tip'),
          data,
        };
        let msg: string | undefined = undefined;
        let type: FieldStatusType = 'ok';
        // 字段未定义： 似乎不太可能出现
        if (!field || validation.type == 'FIELD_UNDEFINED') {
          type = 'error';
          msg =
            validation.message ??
            I18n.textf('i18n:e-field-undefined', msg_vars);
        }
        // 必选值为空
        else if (validation.type == 'VALUE_NIL') {
          type = 'error';
          msg = validation.message ?? I18n.textf('i18n:e-val-nil', msg_vars);
        }
        // 值非法
        else if (validation.type == 'VALUE_INVALID') {
          type = 'error';
          msg =
            validation.message ??
            I18n.textf('i18n:e-field-val-invalid', msg_vars);
        }
        emit('change-validate', {
          name: field?.name ?? '-unknown-',
          type,
          text: msg,
        });
      }
    );
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
    tidyValueChange,
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
