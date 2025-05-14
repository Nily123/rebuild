import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import UnoCSS from 'unocss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: 'src/pages',
      dts: './src/typed-router.d.ts', 
    }),
    UnoCSS(),
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },},
  base: '/rebuild/',
})