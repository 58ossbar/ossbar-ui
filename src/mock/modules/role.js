/*
 * 角色管理模块
 */

// 保存
export function save() {
  return {
    url: 'role/save',
    type: 'post',
    data: {
      'code': 200,
      'msg': null,
      'data': 1
    }
  }
}
// 批量删除
export function batchDelete() {
  return {
    url: 'role/delete',
    type: 'post',
    data: {
      'code': 200,
      'msg': null,
      'data': 1
    }
  }
}
// 查询全部
export function findAll() {
  const findAllData = {
    'code': 200,
    'msg': null,
    'data': [
      {
        'id': 1,
        'createBy': 'admin',
        'createTime': '2018-08-14T03:11:11.000+0000',
        'lastUpdateBy': 'admin',
        'lastUpdateTime': '2018-08-14T03:11:11.000+0000',
        'name': 'admin',
        'remark': '超级管理员',
        'delFlag': 0
      },
      {
        'id': 2,
        'createBy': 'admin',
        'createTime': '2018-08-14T03:11:11.000+0000',
        'lastUpdateBy': 'admin',
        'lastUpdateTime': '2018-08-14T03:11:11.000+0000',
        'name': 'dev',
        'remark': '开发人员',
        'delFlag': 0
      },
      {
        'id': 3,
        'createBy': 'admin',
        'createTime': '2018-08-14T03:11:11.000+0000',
        'lastUpdateBy': 'admin',
        'lastUpdateTime': '2018-08-14T03:11:11.000+0000',
        'name': 'test',
        'remark': '测试人员',
        'delFlag': 0
      }
    ]
  }
  return {
    url: 'role/findAll',
    type: 'get',
    data: findAllData
  }
}
// 分页查询
export function findPage(params) {
  const findPageData = {
    'code': 200,
    'msg': null,
    'data': {}
  }
  const pageNum = 1
  const pageSize = 8
  if (params !== null) {
    // pageNum = params.pageNum
  }
  if (params !== null) {
    // pageSize = params.pageSize
  }
  const content = this.getContent(pageNum, pageSize)
  findPageData.data.pageNum = pageNum
  findPageData.data.pageSize = pageSize
  findPageData.data.totalSize = 50
  findPageData.data.content = content
  return {
    url: 'role/findPage',
    type: 'post',
    data: findPageData
  }
}
export function getContent(pageNum, pageSize) {
  const content = []
  for (let i = 0; i < pageSize; i++) {
    const obj = {}
    const index = ((pageNum - 1) * pageSize) + i + 1
    obj.id = index
    obj.name = 'role' + index
    obj.remark = 'remark role' + index
    if (i % 2 === 0) {

    }
    obj.createBy = 'admin'
    obj.createTime = '2018-08-14 11:11:11'
    obj.createBy = 'admin'
    obj.createTime = '2018-09-14 12:12:12'
    content.push(obj)
  }
  return content
}
// 查询角色菜单集合
export function findRoleMenus(params) {
  const findRoleMenuData = {
    'code': 200,
    'msg': null,
    'data': {}
  }
  return {
    url: 'role/findRoleMenus',
    type: 'get',
    data: findRoleMenuData
  }
}
