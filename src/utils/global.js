/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */

export const appNames = '实训云平台'
// 系统按钮大小，可选 medium small mini
// export const buttonSize = 'medium'
// token名称
export const tokenKeyName = 'token'
// 域名
export const evglUrl = process.env.evglUrl
// 后台管理系统服务器地址
export const baseUrl = process.env.baseUrl
// 系统数据备份还原服务器地址
export const backupBaseUrl = 'http://ip:8002'
// 接口错误时的提示语
export const interfaceFailMessage = '接口调用失败'

export default {
  evglUrl,
  baseUrl,
  backupBaseUrl
}
