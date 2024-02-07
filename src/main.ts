import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import TiDemoApp from './TiDemoApp.vue';
import PageDetail from './components/detail/PageDetail.vue';
import NavCom from './components/nav/NavCom.vue';
import { installTiCoreI18n } from './lib';
import './style.scss';

//
// 准备多国语言
//
installTiCoreI18n('zh-cn');

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
      path: '/:comType?/:example?',
      components: {
        chute: NavCom,
        arena: PageDetail,
      },
      props: {
        chute: (route) => ({
          current: route.params.comType || 'TiUnknown',
        }),
        arena: (route) => ({
          comType: route.params.comType || 'TiUnknown',
          example: route.params.example,
        }),
      },
    },
  ],
});

//
// 创建应用并挂载
//
let app = createApp(TiDemoApp);
//app.config.devtools = true;
app.use(router);

app.mount('#app');
