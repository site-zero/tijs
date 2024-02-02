import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import TiDemoApp from "./TiDemoApp.vue";
import PageDetail from "./components/detail/PageDetail.vue";
import NavCom from "./components/nav/NavCom.vue";
import { I18n, I18nSet, MessageMap } from "./core/ti";
import en_us from "./i18n/en-us";
import zh_cn from "./i18n/zh-cn";
import { updateInstalledComponentsLangs } from "./lib";
import "./style.scss";

let cn = zh_cn as MessageMap;
let en = en_us as MessageMap;

//
// 准备多国语言
//
const app_i18ns = {
  zh_cn: cn,
  en_us: en,
  zh_hk: cn,
  en_uk: en
} as I18nSet;
let lang = "zh-cn";
let langKey = I18n.toLangKey(lang);
I18n.putAll(app_i18ns[langKey]);
updateInstalledComponentsLangs(langKey);

// setEnv('comDefaultProps',{
//   TiLabel: {
//     value: "BBBBBB"
//   }
// })

//
// 准备路由
//
let router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/:comType?/:example?",
      components: {
        chute: NavCom,
        arena: PageDetail
      },
      props: {
        chute: (route) => ({
          current: route.params.comType || "TiUnknown"
        }),
        arena: (route) => ({
          comType: route.params.comType || "TiUnknown",
          example: route.params.example
        })
      }
    }
  ]
});

//
// 创建应用并挂载
//
let app = createApp(TiDemoApp);
//app.config.devtools = true;
app.use(router);

app.mount("#app");
