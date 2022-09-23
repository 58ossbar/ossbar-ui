/*
 * 接口统一集成模块，导出的变量名，约束为驼峰命名风格
 */
// 登录
import * as login from './modules/sys/login'
// 系统设置
import * as settings from './modules/sys/settings'
// 机构管理
import * as dept from './modules/sys/dept'
// 用户管理
import * as user from './modules/sys/user'
// 角色管理
import * as role from './modules/sys/role'
// 岗位管理
import * as post from './modules/sys/post'
// 字典管理
import * as dict from './modules/sys/dict'
// 登录日志
import * as loginLog from './modules/sys/login-log'
// 菜单管理
import * as menu from './modules/sys/menu'
// 定时任务
import * as job from './modules/sys/job'
// 附件管理
import * as attach from './modules/sys/attach'
// 参数管理
import * as parameter from './modules/sys/parameter'
// 操作日志
import * as log from './modules/sys/log'

// TODO 在下面累加你自己的业务js即可
// 友情社区
import * as tevglforumfriend from './modules/site/TevglForumFriend'
// 友情分类
import * as tevglforumfriendtype from './modules/site/TevglForumFriendType'
// 栏目图片:轮播图等
import * as tevglsiteavd from './modules/site/TevglSiteAvd'
// 新闻资讯
import * as tevglsitenews from './modules/site/TevglSiteNews'
// 站点栏目
import * as tevglsiteresourceext from './modules/site/TevglSiteResourceext'
// 更新日志
import * as tevglsiteupdatelog from './modules/site/TevglSiteUpdateLog'
// 视频管理
import * as tevglSiteVideo from './modules/site/TevglSiteVideo'
// 职业课程路径
import * as tevglbookmajor from './modules/res/TevglBookMajor'
// 课程
import * as tevglbooksubject from './modules/res/TevglBookSubject'
// 课程
import * as tevglbooksubperiod from './modules/res/TevglBookSubperiod'
// 班级管理
import * as tevgltchclass from './modules/res/TevglTchClass'
// 课堂
import * as tevgltchclassroom from './modules/res/TevglTchClassroom'
// 班级学员管理
import * as tevgltchclasstrainee from './modules/res/TevglTchClasstrainee'
// 教师管理
import * as tevgltchteacher from './modules/res/TevglTchTeacher'
// 布道师小程序广告轮播
import * as tmedumediaavd from './modules/medu/TmeduMediaAvd'
// 学员
import * as tevgltraineeinfo from './modules/res/TevglTraineeInfo'

// 默认全部导出
export default {
  login, settings, dept, user, role, post, dict, loginLog, menu, job, attach, parameter, log,
  // TODO 在这累加上面你自己定义的名称即可
  tevglforumfriend,
  tevglforumfriendtype,
  tevglsiteavd,
  tevglsitenews,
  tevglsiteresourceext,
  tevglsiteupdatelog,
  tevglSiteVideo,
  tevglbookmajor,
  tevglbooksubject,
  tevglbooksubperiod,
  tevgltchclass,
  tevgltchclassroom,
  tevgltchclasstrainee,
  tevgltchteacher,
  tmedumediaavd,
  tevgltraineeinfo
}
