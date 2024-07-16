import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiCodeEditor from './TiCodeEditor.vue';
import example from './example';

const en_us = {
  'com-name': 'Code Editor',
  'example-js': 'JS',
  'example-css': 'CSS',
  'example-json': 'JSON',
  'example-html': 'HTML',
  'example-markdown': 'MARKDOWN',
};
const zh_cn = {
  'com-name': '代码编辑器',
  'example-js': 'JS',
  'example-css': 'CSS',
  'example-json': 'JSON',
  'example-html': 'HTML',
  'example-markdown': 'MARKDOWN',
};

const COM_TYPE = COM_TYPES.CodeEditor;

const TiCodeEditorInfo: TiComInfo = {
  icon: 'fas-code',
  race: TiComRace.EDIT,
  name: COM_TYPE,
  text: 'i18n:ti-code-editor-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiCodeEditor,
  install: (app: App) => {
    app.component(COM_TYPE, TiCodeEditor);
  },
  defaultProps: 'simple',
  exampleProps: [
    example.simple,
    example.html,
    example.css,
    example.js,
    example.json,
    example.markdown,
  ],
};

export * from './ti-code-editor-types';
export { TiCodeEditor, TiCodeEditorInfo };
