import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      //'vue': 'vue/dist/vue.esm-bundler.js',
      "@site0/tijs/sass": path.resolve(__dirname, "src/assets/style"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // or "modern"
      },
    },
  },
  optimizeDeps: {
    include: ["@vue/compiler-dom", "@vue/server-renderer"],
    exclude: ["vitest"],
  },
  build: {
    // 单位是 KB
    chunkSizeWarningLimit: 800,
    outDir: "dist",
    assetsDir: "./assert",
    lib: {
      entry: "index.d.ts",
      name: "Ti",
      fileName: (format) => `tijs.${format}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        "vue",
        "tinymce",
        /^tinymce\/plugins\//,
        /^tinymce\/themes\//,
        /^tinymce\/icons\//,
        /^tinymce\/models\//,
      ],
      output: {
        // 提供全局变量到外部依赖
        globals: {
          vue: "Vue",
        },
        // 配置样式输出
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith(".scss")) {
            return "style.scss";
          }
          return assetInfo.name;
        },
      },
    },
  },
});
