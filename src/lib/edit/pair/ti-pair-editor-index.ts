import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiPairEditor from './TiPairEditor.vue';
import example from './example';

const en_us = {
  'com-name': 'Pair Editor',
};
const zh_cn = {
  'com-name': '名值对编辑器',
};

const COM_TYPE = COM_TYPES.PairEditor;

const TiPairEditorInfo: TiComInfo = {
  tags: ['scaffold'],
  icon: 'zmdi-view-web',
  race: TiComRace.EDIT,
  name: COM_TYPE,
  text: 'i18n:ti-pair-editor-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiPairEditor,
  install: (app: App) => {
    app.component(COM_TYPE, TiPairEditor);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-pair-editor-types';
export { TiPairEditor, TiPairEditorInfo };
