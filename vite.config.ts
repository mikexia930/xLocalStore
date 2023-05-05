import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from 'path';


const config = {
  web: {
    outDir: './docs',
  },
  lib: {
    outDir: './dist',
    lib: {
      entry: path.resolve(__dirname, 'packages/xLocalStore/src/index.ts'),
      name: 'xlocalstore',
      fileName: (format) => `xlocalstore.${format}.js`
    }
  },
};

const currentConfig = config[process.env.LIB_NAME];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    'process.env': {}
  },
  build: {
    ...currentConfig,
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
});
