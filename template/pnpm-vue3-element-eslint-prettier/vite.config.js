import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import autoprefixer from 'autoprefixer'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'],
      resolvers: [
        // 导入 element-plus 相关函数
        ElementPlusResolver(),
      ],
      eslintrc: {
        enabled: true,
        filepath: resolve(__dirname, 'ignore/.eslintrc-auto-import.json'),
      },
      dts: resolve(__dirname, 'ignore/auto-imports.d.ts'),
    }),
    Components({
      resolvers: [
        // 自动注册组件
        ElementPlusResolver(),
      ],
      dts: resolve(__dirname, 'ignore/components.d.ts'),
    }),
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, 'src/assets/svg')],
      symbolId: 'svg_[dir]_[name]',
    }),
    viteCompression({
      // 对于大于 10KB 的文件进行打包压缩
      threshold: 10 * 1000,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    proxy: {
      '/api-v1': {
        target: 'http://192.168.0.1:80',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api-v1/, ''),
      },
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
})
