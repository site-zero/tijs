import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiScore from './TiScore.vue';
import example from './example';

const en_us = {
  'com-name': 'Score Bar',
};
const zh_cn = {
  'com-name': '评分条',
};

const COM_TYPE = COM_TYPES.Score;

const TiScoreInfo: TiComInfo = {
  tags: ['scaffold'],
  icon: 'zmdi-star-half',
  race: TiComRace.INPUT,
  name: COM_TYPE,
  text: 'i18n:ti-score-com-name',
  i18n: {
    en_us: en_us,
    en_uk: en_us,
    zh_cn: zh_cn,
    zh_hk: zh_cn,
  },
  com: TiScore,
  install: (app: App) => {
    app.component(COM_TYPE, TiScore);
  },
  defaultProps: 'simple',
  exampleProps: [example.simple],
};

export * from './ti-score-types';
export { TiScore, TiScoreInfo };
