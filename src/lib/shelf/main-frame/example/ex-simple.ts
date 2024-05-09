import { MainFrameProps } from '../use-main-frame';

export default {
  name: 'simple',
  text: 'i18n:simple',
  comConf: {
    style: {
      backgroundColor: 'var(--ti-color-bar)',
    },
    keepFrame: {
      keepAt: 'Ti-Demo-MainFrame-Example-Simple',
      keepMode: 'session',
    },
  } as MainFrameProps,
};
