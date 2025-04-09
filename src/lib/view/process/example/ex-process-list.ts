import { ComPropExample, IconInput, Vars } from '../../../../_type';
import { ProcessProps } from '../ti-process-types';

let list = [] as Vars;
for (let i = 0; i < 100; i++) {
  list.push({
    icon:
      i < 20
        ? ({
            type: 'font',
            value: 'fas-check',
            logicType: 'success',
          } as IconInput)
        : 'fas-hourglass-start',
    text: `Demo ${i}`,
    value: `~/demo_${i}.js`,
  });
}

export default {
  name: 'list',
  text: 'i18n:ti-process-example-list',
  comConf: {
    title: 'Processing With Status',
    fillMode: 'fit',
    progress: {
      type: 'info',
      value: 0.4,
    },
    abort: {
      icon: 'fas-pause',
      type: 'warn',
    },
    listCurrentRowIndex: 0,
    listData: list,
  } as ProcessProps,
} as ComPropExample;
