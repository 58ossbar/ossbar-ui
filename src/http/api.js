/*
 * 接口统一集成模块
 */
// 登录
import * as login from './modules/sys/login'
// 用户管理
import * as user from './modules/sys/user'
// 机构管理
import * as dept from './modules/sys/dept'
// 角色管理
import * as role from './modules/sys/role'
// 菜单管理
import * as menu from './modules/sys/menu'
// 字典管理
import * as dict from './modules/sys/dict'
// 日志管理
import * as log from './modules/sys/log'
// 系统设置
import * as settings from './modules/sys/settings'

// TODO 在下面累加你自己的业务js即可

// 默认全部导出
export default {
  login, user, dept, role, menu, dict, log, settings
  // TODO 在这累加上面你自己定义的名称即可
}
