import JSON5 from 'json5';
import _ from 'lodash';
import { ComPropExample, CommonProps, TiCom } from '../../';
import { I18n, TiStore, Vars } from '../../../core';

export type PlaygroundProps = CommonProps & {
  comType: string;
  example?: string;
  exampleAsRouterLink?: boolean;
};

export type ComPropExampleDisplay = ComPropExample & {
  highlight?: boolean;
  className?: any;
  href: string;
};

export type ExampleState = {
  name?: string; // 示例名称
  comConf: Vars; // 示例的控件配置
};

export function selectExample(com: TiCom, ex: ExampleState, name?: string) {
  ex.name = name;
  ex.comConf = loadLocalSetting(com, ex.name);
}

export function getExampleList(com: TiCom, currentName?: string) {
  if (!currentName) {
    currentName = com.defaultProps;
  }
  let list = [] as ComPropExampleDisplay[];
  for (let it of com.exampleProps) {
    let href = [com.name];
    if (it.name != com.defaultProps) {
      href.push(it.name);
    }
    let it2 = _.cloneDeep(it) as ComPropExampleDisplay;
    it2.href = `/${href.join('/')}`;
    it2.highlight = it.name == currentName;
    it2.className = {
      'is-highlight': it2.highlight,
    };
    it2.text = I18n.textOrKey(it.text || it.name);
    list.push(it2);
  }
  return list;
}

function getExampleStoreKey(com: TiCom, exampleName?: string) {
  let keys = ['Ti-Demo-Config', com.name];
  if (exampleName) {
    keys.push(exampleName);
  }
  return keys.join('-');
}

export function loadLocalSetting(com: TiCom, exName?: string) {
  let key = getExampleStoreKey(com, exName);
  let comConf = com.checkProps(exName);
  if (key) {
    return TiStore.local.getObject(key, comConf);
  }
  return _.cloneDeep(comConf);
}

export function saveLocalSetting(com: TiCom, state: ExampleState) {
  let { name, comConf } = state;
  let key = getExampleStoreKey(com, name);
  if (key) {
    let json = formatExampleConfData(comConf || {});
    TiStore.local.set(key, json);
  }
}

export function formatExampleConfData(data: any) {
  return JSON5.stringify(data, null, 2);
}
