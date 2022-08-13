/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */

<<<<<<< HEAD
 // 后台管理系统服务器地址
//export const baseUrl = 'https://frp.creatorblue.com/console'
 export const baseUrl = 'http://localhost:9082'
//export const baseUrl = 'http://139.196.87.48:8001'

 // 系统数据备份还原服务器地址
export const backupBaseUrl = 'http://localhost:9082'
// export const backupBaseUrl = 'http://localhost:8002'
=======
export const tokenKeyName = 'token'
// 域名
export const domain = process.env.domain
// 后台管理系统服务器地址
export const baseUrl = process.env.baseUrl

 // 系统数据备份还原服务器地址
export const backupBaseUrl = 'http://ip:8002'
>>>>>>> 3936e3f68e29a82b54306249256c8f4ba1ddbc33

export default {
  domain,
  baseUrl,
  backupBaseUrl
}
