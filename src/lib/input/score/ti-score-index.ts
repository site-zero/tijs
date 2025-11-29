import { App } from 'vue';
import { TiComInfo, TiComRace } from '../../../_type';
import { COM_TYPES } from '../../lib-com-types';
import TiScore from './TiScore.vue';
import { ScoreProps } from './ti-score-types';

const en_us = {
  'com-name': 'Score Bar',
  'example-allow-half': 'Allow Half',
  'example-in-scope': 'Custom Range',
  'example-10stars': '10 Stars',
};
const zh_cn = {
  'com-name': '评分条',
  'example-allow-half': '允许半星',
  'example-in-scope': '定制范围',
  'example-10stars': '10星',
};

const COM_TYPE = COM_TYPES.Score;

const TiScoreInfo: TiComInfo = {
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
  exampleProps: [
    {
      name: 'simple',
      text: 'i18n:simple',
      comConf: {
        value: 6.8,
      } as ScoreProps,
    }, {
      name: 'allow-half',
      text: 'i18n:ti-score-example-allow-half',
      comConf: {
        value: 2.4,
        allowHalf: true,
        starColorType: 'success',
      } as ScoreProps,
    }, {
      name: 'in-scope',
      text: 'i18n:ti-score-example-in-scope',
      comConf: {
        value: 70,
        allowHalf: true,
        minValue: 40,
        maxValue: 100,
        starColorType: 'info',
        starColorSuffix: 'r',
        starBorderColorType: 'info'
      } as ScoreProps,
    }, {
      name: '10stars',
      text: 'i18n:ti-score-example-10stars',
      comConf: {
        value: 70,
        allowHalf: false,
        maxValue: 100,
        stars: 10,
        starFontSize: 't'
      } as ScoreProps,
    }
  ],
};

export * from './ti-score-types';
export { TiScore, TiScoreInfo };

