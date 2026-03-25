import _ from "lodash";
import { ref } from "vue";
import { FieldStatus, Vars } from "../../../_type";
import { FieldValidateResult } from "./data-validate-types";
import { DataValidation, ValidateOptions } from "./use-data-validate";

export type ValidateResultsOptions = {
  getValidation: () => DataValidation | undefined;
  getId: (item: Vars) => string | null | undefined;
};

export function useValidateResults(options: ValidateResultsOptions) {
  const { getValidation, getId } = options;
  //-----------------------------------------------------
  // 数据模型
  //-----------------------------------------------------
  // 每个对象（数据行）都对应一个字段检查结果集
  const _results = ref<Record<string, FieldValidateResult>>({});
  //-----------------------------------------------------
  // 获取函数
  //-----------------------------------------------------
  function getVarifyResult(id?: string | null | undefined) {
    if (_.isNil(id)) {
      return {};
    }
    return _results.value[id] || {};
  }
  //-----------------------------------------------------
  // 数据校验
  //-----------------------------------------------------
  async function validate(item?: Vars) {
    if (!item || _.isEmpty(item)) return;
    let id = getId(item);
    if (_.isNil(id)) return;

    clearVarifyResult(id);

    const vali = getValidation();
    if (!vali) return;

    let result = await vali.validateData(item, {
      checkRequired: true,
    });
    updateVarifyResult(id, result);
  }
  //-----------------------------------------------------
  async function validateDelta(
    item: Vars,
    delta: Vars,
    options: ValidateOptions = {}
  ): Promise<Record<string, FieldStatus | null>> {
    if (!item || _.isEmpty(item)) return {};
    let id = getId(item);
    if (_.isNil(id)) return {};

    clearVarifyResult(id);

    const vali = getValidation();
    if (!vali) return {};

    return await vali.validateChange(delta, item, {
      checkRequired: true,
      okAs: "null",
      ...options,
    });
  }
  //-----------------------------------------------------
  // 帮助函数
  //-----------------------------------------------------
  function setVarifyResult(id: string, result: Record<string, FieldStatus>) {
    _results.value[id] = result;
  }
  //-----------------------------------------------------
  function assignVarifyResult(id: string, result: Record<string, FieldStatus>) {
    if (!_results.value[id]) {
      _results.value[id] = {};
    }
    _.assign(_results.value[id], result);
  }
  //-----------------------------------------------------
  function updateVarifyResult(
    id: string,
    result: Record<string, FieldStatus | null>,
    prefix?: string
  ) {
    if (!_results.value[id]) {
      _results.value[id] = {};
    }
    for (let [key, status] of Object.entries(result)) {
      let name = prefix ? `${prefix}.${key}` : key;
      if (!status) {
        delete _results.value[id][name];
      } else {
        setVarifyField(id, name, status);
      }
    }
  }
  //-----------------------------------------------------
  function setVarifyField(id: string, name: string, status: FieldStatus) {
    if (!_results.value[id]) {
      _results.value[id] = {};
    }
    if ("ok" == status.type) {
      delete _results.value[id][name];
    } else {
      //console.log("setVarifyField", name, status);
      _results.value[id][name] = status;
    }
  }
  //-----------------------------------------------------
  function clearVarifyResult(id: string, name?: string | string[]) {
    if (!_results.value[id]) {
      _results.value[id] = {};
    }
    if (!name) {
      _results.value[id] = {};
    } else {
      let names = _.concat(name);
      _results.value[id] = _.omit(_results.value[id], names);
    }
  }
  //-----------------------------------------------------
  // 返回接口
  //-----------------------------------------------------
  return {
    getVarifyResult,
    validate,
    validateDelta,
    setVarifyResult,
    assignVarifyResult,
    updateVarifyResult,
    setVarifyField,
    clearVarifyResult,
  };
}
