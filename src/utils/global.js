/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */

export const tokenKeyName = 'token'
// 域名
export const domain = process.env.domain
// 后台管理系统服务器地址
export const baseUrl = process.env.baseUrl

// 系统数据备份还原服务器地址
export const backupBaseUrl = 'http://ip:8002'

export default {
  domain,
  baseUrl,
  backupBaseUrl
}
