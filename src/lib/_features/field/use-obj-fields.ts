import {
  FieldRefer,
  GridFieldsInput,
  I18n,
  LabelProps,
  Str,
} from '@site0/tijs';
import _ from 'lodash';

//const log = getLogger('wn.obj-fields');

export type QuickFieldInfo = {
  _key: string;
  name?: string | string[];
  title?: string;
  tip?: string;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  colStart?: number;
  colSpan?: number;
  rowStart?: number;
  rowSpan?: number;
};

//-----------------------------------------------
export type TiObjFieldsFeature = ReturnType<typeof defineObjFields>;
//-----------------------------------------------
/**
 * 定义表单管理特性
 */
function defineObjFields(featureName: string) {
  /**
   * 准备一个表单字段的集合
   */
  const _FIELDS = new Map<string, GridFieldsInput>();

  /**
   * 获取一个字段
   *
   * @param uniqKey
   * @param field
   * @returns  字段定义
   */
  function getField(
    uniqKey: string,
    field: GridFieldsInput = {}
  ): GridFieldsInput {
    let finfo = parseNameForObjField(uniqKey);
    let _fld: GridFieldsInput | undefined;
    if ('-SEP-' == finfo._key) {
      _fld = _FIELDS.get(uniqKey) ?? {
        colStart: 1,
        colSpan: 100,
      };
    } else {
      _fld = _FIELDS.get(finfo._key);
    }
    if (!_fld) {
      console.error(`Fail to found field ['${uniqKey}']`, finfo);
      throw `Fail to found field ['${uniqKey}']`;
    }
    let re = _.cloneDeep(_fld);
    _.assign(re, _.omit(field, 'comConf'));
    re.comConf = re.comConf ?? {};
    _.assign(re.comConf, field?.comConf);
    if (finfo.readonly) {
      re.readonly = true;
      re.comConf.readonly = true;
    }

    if (finfo.required) {
      re.required = true;
    }
    if (finfo.disabled) {
      re.disabled = true;
    }

    re.name = finfo.name ?? re.name ?? finfo._key;
    if ('-SEP-' == re.name) {
      re.name = undefined;
    }
    re.title = finfo.title ?? re.title;
    re.tip = finfo.tip;
    re.colStart = finfo.colStart ?? re.colStart;
    re.colSpan = finfo.colSpan ?? re.colSpan;
    re.rowStart = finfo.rowStart ?? re.rowStart;
    re.rowSpan = finfo.rowSpan ?? re.rowSpan;

    if (re.title && re.title.length > 10) {
      // 如果确定要折行，那么，自动的将后面加一个空格
      // 这样折行以后，就会右对齐
      if (_.isString(re.title) && !re.title.startsWith('i18n:')) {
        re.title = _.trim(re.title) + ' ';
      }
    }

    return re;
  }
  //---------------------------------------------
  function getFieldBy(
    fld: FieldRefer,
    field?: GridFieldsInput
  ): GridFieldsInput {
    let over = _.cloneDeep(field);
    // 简单键
    if (_.isString(fld)) {
      return getField(fld, over);
    }
    // 带定制
    if (_.isArray(fld)) {
      let [key, info] = fld;
      // 完全定制
      if (_.isFunction(info)) {
        let re = getField(key);
        return info(re) ?? re;
      }
      // 仅仅覆盖固定属性
      let override = _.defaults({}, info, over);
      return getField(key, override);
    }
    // 完整自定义
    let re = _.defaults({}, fld, over);
    return re;
  }
  //---------------------------------------------
  /**
   * 获取一个字段定义列表
   *
   * @param keys
   * @param fld
   * @returns 字段定义列表
   */
  function getFieldList(
    keys: FieldRefer[],
    fld?: GridFieldsInput
  ): GridFieldsInput[] {
    let re = [] as GridFieldsInput[];
    for (let key of keys) {
      re.push(getFieldBy(key, fld));
    }
    return re;
  }
  //---------------------------------------------
  /**
   * 获取一个字段组定义
   * @param title
   * @param keys
   * @param groupSetup
   * @returns 字段组定义
   */
  function getFieldGroup(
    title: string,
    keys: FieldRefer[],
    groupSetup: GridFieldsInput = {}
  ): GridFieldsInput {
    return {
      ...groupSetup,
      title,
      fields: getFieldList(keys),
    };
  }
  //---------------------------------------------
  /**
   * 添加一个字段定义
   *
   * @param uniqKey
   * @param field
   */
  function setField(uniqKey: string, field: GridFieldsInput) {
    if (_FIELDS.has(uniqKey)) {
      console.warn(`field '${uniqKey}' already exists!!`);
    }
    if (!field.name) {
      field.name = uniqKey;
    }
    _FIELDS.set(uniqKey, field);
  }
  //---------------------------------------------
  function setDateTimeLabelField(uniqKey: string, title: string) {
    setField(uniqKey, {
      name: uniqKey,
      title,
      comType: 'TiLabel',
      comConf: {
        placeholder: 'i18n:unknown',
        valuePiping: '$DT',
      } as LabelProps,
    });
  }
  //---------------------------------------------
  // 输出特性
  //---------------------------------------------
  return {
    getName: () => featureName,
    getField,
    getFieldBy,
    getFieldList,
    getFieldGroup,
    setField,
    setDateTimeLabelField,
  };
}
//-----------------------------------------------
const _OBJ_FIELDS_INSTANCES = new Map<string, TiObjFieldsFeature>();
//-----------------------------------------------
export function useObjFields(name = '_DEFAULT_FIELD_SET'): TiObjFieldsFeature {
  let re = _OBJ_FIELDS_INSTANCES.get(name);
  if (!re) {
    re = defineObjFields(name);
    _OBJ_FIELDS_INSTANCES.set(name, re);
  }
  return re;
}

//-----------------------------------------------
/**
 * 根据下面的规则获取字段，主要通过 `uniqKey` 可以很简明的创建字段
 *
 * ```bash
 * uniqKey = 'type=Hello'
 * > {name:'type', title:'Hello'}
 *
 * uniqKey = 'type=hello/Hello'
 * > {name:'hello', title:'Hello'}
 *
 * uniqKey = '*type'
 * > {name:'type', required:true}
 *
 * uniqKey = 'type:2'
 * > {name:'type', colSpan:2}
 *
 * uniqKey = 'type:1/2'
 * > {name:'type', colStart:1, colSpan:2}
 *
 * uniqKey = 'type:1/2:3'
 * > {name:'type', colStart:1, colSpan:2, rowSpan:3}
 *
 * uniqKey = '!type:1/2:3'
 * > {name:'type', comConf: {readonly:true}}
 *
 * uniqKey = '~!type:1/2:3'
 * > {name:'type', disabled:true, comConf: {readonly:true}}
 * ```
 *
 * @param key 字段键
 */
export function parseNameForObjField(key: string) {
  let re: QuickFieldInfo;
  let cols: string;
  let rows: string;

  let m = /^([!*~]+)(.+)$/.exec(key);
  let required = false;
  let readonly = false;
  let disabled = undefined;
  if (m) {
    required = m[1].indexOf('*') >= 0;
    readonly = m[1].indexOf('!') >= 0;
    if (m[1].indexOf('~') >= 0) {
      disabled = true;
    }
    key = m[2].trim();
  }

  let parts = key.split(':');
  let name = parts[0];
  cols = _.nth(parts, 1) ?? '';
  rows = _.nth(parts, 2) ?? '';
  re = { _key: name, required, readonly, disabled };

  // name/title
  m = /^([^=]+)(=(.+))?/.exec(name);
  if (m) {
    re._key = m[1] ?? name;
    let title = m[3];
    re.title = title;
    if (title) {
      let m2 = /^([^/]*)(\/([^>]+)(>(.+))?)?/.exec(title);
      if (m2) {
        re.name = m2[1] || undefined;
        re.title = m2[3];
        re.tip = m2[5];
      }
    }
    // 这里翻译一下，可以支持 '#{key}' 或者 'i18n:{key}'
    if (re.title) {
      let m = /^(#|i18n:)(.+)$/.exec(re.title);
      if (m) {
        re.title = I18n.get(m[2]);
      }
    }
  }

  // 对于包括 , 的名称，需要变成数组
  if (_.isString(re.name) && re.name.indexOf(',') >= 0) {
    re.name = Str.splitIgnoreBlank(re.name);
  }

  const __grid_info = function (input: string) {
    let start: number | undefined;
    let span: number | undefined;
    let m = /^(\d*)(\/(\d+))?/.exec(input);
    if (m) {
      start = m[1] ? parseInt(m[1]) : undefined;
      if (m[3]) {
        span = parseInt(m[3]);
      }
    }
    return { start, span };
  };

  // cols
  if (cols) {
    let { start, span } = __grid_info(cols);
    re.colStart = start;
    re.colSpan = span;
  }

  // rows
  if (rows) {
    let { start, span } = __grid_info(rows);
    re.rowStart = start;
    re.rowSpan = span;
  }

  // 某种分隔符表示 FieldLabel
  if (/^[=#.-]{3,}/.test(re._key)) {
    re._key = '-SEP-';
  }

  return re;
}
