import _ from "lodash";
import { App } from "vue";
import {
  ComPropExample,
  I18nSet,
  TiCom,
  TiComExampleModelTarget,
  TiComInfo,
  TiComRace,
  TiRawCom,
  Vars,
} from "../../_type";
import * as I18n from "../text/ti-i18n";

export class TiComImpl implements TiCom {
  icon: string;
  race: TiComRace;
  name: string;
  text: string;
  i18n: I18nSet;
  tags: string[];
  liveStyle: Vars;
  com: TiRawCom;
  events: string[];
  asInner: boolean;
  install: (app: App) => void;
  defaultProps: string;
  exampleProps: ComPropExample[];
  exampleModel:
    | Record<string, TiComExampleModelTarget | TiComExampleModelTarget[]>
    | ((eventName: string, payload: any) => void);

  constructor(info: TiComInfo) {
    this.icon = info.icon || "fas-question";
    this.race = info.race;
    this.name = info.name;
    this.text = info.text ?? info.name;
    this.i18n = info.i18n ?? {
      zh_cn: {},
      zh_hk: {},
      en_uk: {},
      en_us: {},
    };
    this.tags = info.tags || [];
    this.liveStyle = info.liveStyle ?? {};
    this.com = info.com;
    this.asInner = info.asInner ?? false;
    this.install = info.install;
    this.defaultProps = info.defaultProps ?? "_auto_";
    this.exampleProps = _.cloneDeep(info.exampleProps ?? []);
    this.exampleModel = _.cloneDeep(info.exampleModel) ?? { change: "value" };

    this.events = [];
    if (this.com.emits) {
      _.forEach(this.com.emits, (eventName) => this.events.push(eventName));
    }
  }

  getProps(name?: string): Vars | undefined {
    if (!name) {
      name = this.defaultProps;
    }
    //console.log('getProps',name)
    let it = _.find(this.exampleProps, (it) => it.name == name);
    if (_.isFunction(it?.comConf)) {
      return it?.comConf() as Vars;
    }
    return _.cloneDeep(it?.comConf);
  }

  checkProps(name?: string) {
    let props = this.getProps(name);
    if (!props) {
      throw new Error(`Fail to found props: ${name}`);
    }
    return props;
  }

  toString(): string {
    let text = I18n.text(this.text);
    return `[${this.race}] <${text}> #${this.name}`;
  }
}
