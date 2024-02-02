import JSON5 from "json5";
import _ from "lodash";
import { ComputedRef, Ref, watch } from "vue";
import {
  AppEvents,
  ComPropExample,
  CommonProps,
  TiAppBus,
  TiAppEvent,
  TiCom,
  TiEvent
} from "../../";
import {
  BusMsg,
  Callback,
  DateTime,
  I18n,
  Store,
  Tmpl,
  Util,
  Vars
} from "../../../core";
/*-------------------------------------------------------

                   Event & bus

-------------------------------------------------------*/
export type SubComEvent = {
  listenName: string;
  event: TiEvent<any>;
};

export function buildBusEventMessage(evt?: TiEvent<SubComEvent>): string {
  if (evt) {
    let { created, name, payload } = evt;
    let ss = [DateTime.format(created, { fmt: "HH:mm:ss.SSS" }), name];
    ss.push(`<${typeof payload}>`);
    if (payload) {
      ss.push(JSON.stringify(payload));
    }
    return ss.join(":");
  }
  return "";
}

export function listenInnerBus(
  PlayCom: ComputedRef<TiCom>,
  ex: ExampleState,
  updateViewMeasure: Callback,
  _bus_event: Ref<SubComEvent | undefined>,
  inner_bus: TiAppBus,
  outer_bus?: TiAppBus
) {
  const playground_any_event_handler = (msg: BusMsg<TiAppEvent>) => {
    let { name, data } = msg;

    // 全局总线传递下来的任务，就无视了
    if (AppEvents.APP_RESIZE == name) {
      updateViewMeasure();
      return;
    }

    console.log("playground.inner_bus", msg);
    _bus_event.value = {
      listenName: name,
      event: data
    };
    let eventName = `playground:${name}`;
    outer_bus?.emit(eventName, data.payload);
    // if ("change" == k) {
    //   play.assignExampleConf({ value: v.payload });
    // }
    // 准备更新 comConf
    let model = PlayCom.value.exampleModel ?? { change: "value" };
    let target = model[name];
    // {"change": "value"}
    if (target) {
      if (_.isString(target)) {
        let key = Tmpl.exec(target, data.payload);
        _.set(ex.comConf, key, data.payload);
      }
      // {"field-change": {key:"data.${name}", value:"=value"}}
      else if (target) {
        let key = Tmpl.exec(target.key, data.payload);
        let val = Util.explainObj(data.payload, target.val);
        _.set(ex.comConf, key, val);
      }
      // 更新一下显示
      formatExampleText(ex);
      saveLocalSetting(PlayCom.value, ex);
    }
  };
  inner_bus.on("*", playground_any_event_handler);
}
/*-------------------------------------------------------

                     State

-------------------------------------------------------*/
export type ExampleState = {
  name?: string; // 示例名称
  text: string; // 示例的名称文本
  comConf: Vars; // 示例的控件配置
  syntaxErr: string;
};
/*-------------------------------------------------------

                   Props

-------------------------------------------------------*/
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
/*-------------------------------------------------------

                   Methods

-------------------------------------------------------*/
function getExampleStoreKey(com: TiCom, exampleName?: string) {
  let keys = ["Ti-Demo-Config", com.name];
  if (exampleName) {
    keys.push(exampleName);
  }
  return keys.join("-");
}

export function getExampleList(example: ExampleState, com: TiCom) {
  let currentName = example.name || com.defaultProps;
  let list = [] as ComPropExampleDisplay[];
  for (let it of com.exampleProps) {
    let href = [com.name];
    if (it.name != com.defaultProps) {
      href.push(it.name);
    }
    let it2 = _.cloneDeep(it) as ComPropExampleDisplay;
    it2.href = `/${href.join("/")}`;
    it2.highlight = it.name == currentName;
    it2.className = {
      "is-highlight": it2.highlight
    };
    it2.text = I18n.textOrKey(it.text || it.name);
    list.push(it2);
  }
  return list;
}

export function getExample(com: TiCom, exName?: string) {
  let name = exName || com.defaultProps || "";
  for (let it of com.exampleProps) {
    if (it.name === name) {
      return it;
    }
  }
}

export function loadLocalSetting(com: TiCom, exName?: string) {
  let key = getExampleStoreKey(com, exName);
  let comConf = com.checkProps(exName);
  if (key) {
    return Store.local.getObject(key, comConf);
  }
  return _.cloneDeep(comConf);
}

export function selectExample(com: TiCom, ex: ExampleState, name?: string) {
  ex.name = name;
  ex.comConf = loadLocalSetting(com, ex.name);
  formatExampleText(ex);
}

export function formatExampleText(ex: ExampleState) {
  ex.text = JSON5.stringify(ex.comConf, null, 2);
}

export function parseExampleComConf(ex: ExampleState) {
  try {
    ex.comConf = JSON5.parse(ex.text);
    ex.syntaxErr = "";
  } catch (err) {
    ex.syntaxErr = err as string;
  }
}

export function saveLocalSetting(com: TiCom, ex: ExampleState) {
  let key = getExampleStoreKey(com, ex.name);
  if (key) {
    Store.local.setObject(key, ex.comConf);
  }
}

export function removeLocalSetting(com: TiCom, ex: ExampleState) {
  let key = getExampleStoreKey(com, ex.name);
  if (key) {
    Store.local.remove(key);
  }
}

export function watchProps(
  props: PlaygroundProps,
  PlayCom: ComputedRef<TiCom>,
  ex: ExampleState
) {
  watch(
    () => props.example,
    function (exampleName) {
      let com = PlayCom.value;
      selectExample(com, ex, exampleName);
    },
    {
      immediate: true
    }
  );
  watch(
    () => ex.text,
    function () {
      parseExampleComConf(ex);
    }
  );
  watch(
    () => PlayCom.value,
    function (com) {
      ex.comConf = loadLocalSetting(com, props.example);
      ex.name = props.example;
      formatExampleText(ex);
    }
  );
}
