/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />
declare module '*.vue'{
    import { ComponentOptions } from 'vue'
    const componentOptions: ComponentOptions
    export default componentOptions
  }