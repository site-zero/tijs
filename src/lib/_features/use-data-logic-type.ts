import _ from 'lodash';
import { LogicType, TiMatch, Vars } from '../../_type';
import { Match } from '../../core';

export type GetDataLogicTypeMatcher = {
  test?: any;
  type: LogicType;
};

export type GetDataLogicTypeOptions =
  | ((data: Vars) => LogicType | undefined)
  | GetDataLogicTypeMatcher[];

export type GetDataRowLogicType = {
  test: TiMatch;
  type: LogicType;
};

export type GetDataLogicTypeFeature = ReturnType<typeof useDataLogicType>;

export function useDataLogicType(getLogicType?: GetDataLogicTypeOptions) {
  // 未指定逻辑类型获取方法
  if (!getLogicType) {
    return;
  }
  // 直接指定了定制方法
  if (_.isFunction(getLogicType)) {
    return getLogicType;
  }
  // 采用了配置
  const cans = [] as GetDataRowLogicType[];
  for (let tester of getLogicType) {
    let { test, type } = tester;
    let am = Match.parse(test, true);
    cans.push({ test: am, type });
  }
  return (data: Vars) => {
    for (let { test, type } of cans) {
      if (test.test(data)) {
        return type;
      }
    }
  };
}
