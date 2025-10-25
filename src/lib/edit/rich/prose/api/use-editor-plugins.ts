import _ from "lodash";
import { Util } from "../../../../../core";
import {
  RichEditorPlugin,
  RichEditorPluginReadyContext,
  RichEditorPluginSetupContext,
  TiEditRichProseProps,
} from "../ti-edit-rich-prose-types";
import { RichEditorTestPlugin } from "../plugin/test";

// 内置插件
const _BUILT_IN_PLUGINS = ((...plugins: RichEditorPlugin[]) => {
  let list: [string, RichEditorPlugin][] = [];
  for (let plug of plugins) {
    list.push([plug.name, plug]);
  }
  return new Map<string, RichEditorPlugin>(list);
})(RichEditorTestPlugin);

// 插件管理接口
export type EditorPluginsApi = ReturnType<typeof useEditorPlugins>;

// 插件管理器
export function useEditorPlugins(props: TiEditRichProseProps) {
  let _plugins = [] as RichEditorPlugin[];

  // 初始化插件列表
  for (let plug of props.plugins || []) {
    // 引用的内置插件
    if (_.isString(plug)) {
      let plugin = _BUILT_IN_PLUGINS.get(plug);
      if (plugin) {
        _plugins.push(plugin);
      }
    }
    // 直接就是插件定义
    else if (_.isFunction(plug)) {
      _plugins.push(plug);
    }
  }

  function setupEditor(context: RichEditorPluginSetupContext) {
    for (let plug of _plugins) {
      let vars = props.pluginVars?.[plug.name] || {};
      plug.setup(context, vars);
    }
  }

  function readyEditor(context: RichEditorPluginReadyContext) {
    for (let plug of _plugins) {
      if (!plug.ready) continue;
      let vars = props.pluginVars?.[plug.name] || {};
      plug.ready(context, vars);
    }
  }

  return {
    setupEditor,
    readyEditor,
  };
}
