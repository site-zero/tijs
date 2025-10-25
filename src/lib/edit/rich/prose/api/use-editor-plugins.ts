import _ from "lodash";
import { Util } from "../../../../../core";
import {
  RichEditorPlugin,
  RichEditorPluginReadyContext,
  RichEditorPluginSetupContext,
  TiEditRichProseProps,
} from "../ti-edit-rich-prose-types";
import { InputRule } from "prosemirror-inputrules";

const _BUILT_IN_PLUGINS = Util.objToMap({} as Record<string, RichEditorPlugin>);
export type EditorPluginsApi = ReturnType<typeof useEditorPlugins>;
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
