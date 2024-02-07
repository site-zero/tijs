/// <reference types="vite/client" />
declare module '*.vue' {
  import { App, DefineComponent, defineProps } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
