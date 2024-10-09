import JSON5 from 'json5';
import _ from 'lodash';
import { computed, ref } from 'vue';
import { Vars, WindowTheme } from '../../../_type';
import { Dom } from '../../../core';
import { CodeEditorEmitter, CodeEditorProps } from './ti-code-editor-types';

declare const ace: any;

const MODE_MAPPING = {
  'txt': 'text',
  'md': 'markdown',
  'js': 'javascript',
  'htm': 'html',
  'json': 'json',
  'json5': 'javascript',
  'html': 'html',
  'xml': 'xml',
  'css': 'css',
  'text/json': 'json',
  'text/html': 'html',
  'text/css': 'css',
  'text/xml': 'xml',
  'text/json5': 'javascript',
  'text/markdown': 'markdown',
  'application/json': 'json',
} as Vars;

export function useCodeAce(props: CodeEditorProps, emit: CodeEditorEmitter) {
  //-----------------------------------------------------
  // 计算主题
  //-----------------------------------------------------
  const _sys_theme = computed(() => {
    return Dom.RootThemeClass.value;
  });
  //-----------------------------------------------------
  const _std_theme = computed(() => {
    if ('light' == props.theme || 'dark' == props.theme) {
      return props.theme as WindowTheme;
    }
    return _sys_theme.value;
  });
  //-----------------------------------------------------
  /*
  Light 主题
    | chrome | clouds | crayon | dawn | dreamweaver   
    | eclipse | github | iplastic | solarized_light   
    | sqlserver| textmate | tomorrow | xcode  
  Dark 主题
    | ambiance | chaos | clouds_midnight | cobalt 
    | dracula  | gruvbox | gob | idle_fingers  | kr_theme 
    | merbivore  | merbivore_soft | mono_industrial  | monokai 
    | pastel_on_dark  | solarized_dark  | terminal | tomorrow_night
    | tomorrow_night_blue | tomorrow_night_bright 
    | tomorrow_night_eighties | twilight | vibrant_ink 
  */
  const EditorTheme = computed(() => {
    let _editor_theme = _.assign(
      {
        light: 'chrome',
        dark: 'terminal',
      },
      props.editorTheme
    );
    if ('dark' == _std_theme.value) {
      return _editor_theme.dark;
    }
    return _editor_theme.light;
  });
  //-----------------------------------------------------
  const EditorIsLoading = computed(() => _.isUndefined(props.value));
  //-----------------------------------------------------
  const EditorMode = computed(() => {
    return (
      MODE_MAPPING[props.mime ?? ''] ||
      MODE_MAPPING[props.type ?? ''] ||
      props.type ||
      'text'
    );
  });
  //-----------------------------------------------------
  const EditorInputValue = computed(() => {
    let val = props.value;

    if (val && !_.isString(val)) {
      val = JSON.stringify(val, null, '  ');
    }

    if (props.format) {
      if ('JSON' == props.format) {
        let obj = JSON5.parse(val);
        val = JSON.stringify(obj, null, '  ');
      } else if ('JSON5' == props.format) {
        let obj = JSON5.parse(val);
        val = JSON5.stringify(obj, null, '  ');
      } else if (_.isFunction(props.format)) {
        val = props.format(val);
      }
    }

    return val || '';
  });
  //-----------------------------------------------------
  const _editor = ref<any>();
  //-----------------------------------------------------
  function setupEditor($main: HTMLElement) {
    // Create editor
    _editor.value = ace.edit($main);
    updateEditorTheme();
    updateEditorOptions();
    updateEditorMode();
    updateEditorValue();

    // Readonly Mode
    if (props.readonly) {
      _editor.value.setReadOnly(true);
    }
    // Events
    else {
      _editor.value.session.on('change', (_delta: any) => {
        //console.log('editor change::', _delta);
        let str = _editor.value.getValue() || '';
        //let str = _delta[0];
        emit('change', str);
      });
    }
  }
  //-----------------------------------------------------
  function updateEditorTheme() {
    _editor.value?.setTheme(`ace/theme/${EditorTheme.value}`);
  }
  //-----------------------------------------------------
  function updateEditorOptions() {
    _editor.value.setOptions(props.editorOptions || {});
  }
  //-----------------------------------------------------
  function updateEditorMode() {
    _editor.value?.session.setMode(`ace/mode/${EditorMode.value}`);
  }
  //-----------------------------------------------------
  function updateEditorValue() {
    // 防守
    if(!_editor.value) return;

    // 获取当前光标位置
    let cursorPosition = _editor.value.getCursorPosition();

    // 准备比较内容
    let current_val = _editor.value.getValue() || '';

    // 设置新的内容
    if (current_val != EditorInputValue.value) {
      //console.log('!!!!!!!!!!!!! update value');
      _editor.value.session.setValue(EditorInputValue.value);
    }

    // 恢复光标位置
    _editor.value.moveCursorToPosition(cursorPosition);
  }
  //-----------------------------------------------------
  //-----------------------------------------------------
  // 输出特性
  //-----------------------------------------------------
  return {
    //................................................
    _sys_theme,
    version: ace.version,
    //................................................
    EditorTheme,
    EditorIsLoading,
    EditorMode,
    //................................................
    setupEditor,
    updateEditorTheme,
    updateEditorOptions,
    updateEditorMode,
    updateEditorValue,
    //................................................
  };
}
