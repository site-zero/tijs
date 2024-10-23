import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js',
      '@ti-sass': path.resolve(__dirname, 'src/assets/style'),
    },
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `
  //         @use "src/assets/style/_all.scss" as *;
  //       `
  //     }
  //   }
  // },
  build: {
    // 单位是 KB
    chunkSizeWarningLimit: 800,
    outDir: 'dist',
    assetsDir: './assert',
    lib: {
      entry: 'index.d.ts',
      name: 'Ti',
      fileName: (format) => `tijs.${format}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: ['vue'],
      output: {
        // 提供全局变量到外部依赖
        globals: {
          vue: 'Vue',
        },
        // 配置样式输出
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.scss')) {
            return 'style.scss';
          }
          return assetInfo.name;
        },
      },
    },
  },
});
