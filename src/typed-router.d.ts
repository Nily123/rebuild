/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'vue-router'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/activity': RouteRecordInfo<'/activity', '/activity', Record<never, never>, Record<never, never>>,
    '/explore': RouteRecordInfo<'/explore', '/explore', Record<never, never>, Record<never, never>>,
    '/login': RouteRecordInfo<'/login', '/login', Record<never, never>, Record<never, never>>,
    '/products/': RouteRecordInfo<'/products/', '/products', Record<never, never>, Record<never, never>>,
    '/products/[special_code]': RouteRecordInfo<'/products/[special_code]', '/products/:special_code', { special_code: ParamValue<true> }, { special_code: ParamValue<false> }>,
    '/rebuild': RouteRecordInfo<'/rebuild', '/rebuild', Record<never, never>, Record<never, never>>,
    '/user/[section]': RouteRecordInfo<'/user/[section]', '/user/:section', { section: ParamValue<true> }, { section: ParamValue<false> }>,
    '/user/manage': RouteRecordInfo<'/user/manage', '/user/manage', Record<never, never>, Record<never, never>>,
    '/vendor/': RouteRecordInfo<'/vendor/', '/vendor', Record<never, never>, Record<never, never>>,
    '/vendor/[VendorName]': RouteRecordInfo<'/vendor/[VendorName]', '/vendor/:VendorName', { VendorName: ParamValue<true> }, { VendorName: ParamValue<false> }>,
  }
}
