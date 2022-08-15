/*
 * 菜单管理模块
 */

// 获取导航菜单树
export function findNavTree() {
  const navTreeData = {
    'code': 200,
    'msg': null,
    'data': [
      {
        'createTime': null,
        'createUserId': '',
        'delFlag': null,
        'display': null,
        'icon': 'el-icon-setting',
        'menuId': '1',
        'name': '系统管理',
        'open': null,
        'orderNum': 1,
        'orgId': '1',
        'orgName': '1',
        'parentId': '19c786f2bfbf46398e3b495f6c7014b1',
        'parentName': null,
        'perms': '',
        'remark': null,
        'resourceClass': null,
        'sqlMap': {},
        'type': 0,
        'updateTime': '2017-08-12 15:45:18',
        'updateUserId': '系统管理员',
        'url': '',
        'list': [
          {
            'createTime': null,
            'createUserId': '',
            'delFlag': null,
            'display': 1,
            'icon': 'el-icon-news',
            'menuId': '99c786f2bfbf46399e3b495f6c7014bc',
            'name': '机构管理',
            'open': null,
            'orderNum': 1,
            'orgId': '11',
            'orgName': '11',
            'parentId': '1',
            'parentName': '系统管理1',
            'perms': 'sys:tsysorg:query,sys:tsysorg:view',
            'remark': null,
            'resourceClass': null,
            'sqlMap': {},
            'type': 1,
            'updateTime': '2018-03-28 11:20:19',
            'updateUserId': '系统管理员',
            'url': '/sys/dept',
            'list': []
          },
          {
            'createTime': null,
            'createUserId': '',
            'delFlag': null,
            'display': 1,
            'icon': 'el-icon-service',
            'menuId': '92c786f2bfbf46398e3b495f6c70156c',
            'name': '用户管理',
            'open': null,
            'orderNum': 2,
            'orgId': '12',
            'orgName': '12',
            'parentId': '1',
            'parentName': '系统管理1',
            'perms': 'sys:tsysuserinfo:query,sys:tsysuserinfo:view,sys:tsysuserinfo:list',
            'remark': null,
            'resourceClass': null,
            'sqlMap': {},
            'type': 1,
            'updateTime': '2018-03-28 11:20:19',
            'updateUserId': '系统管理员',
            'url': '/sys/user',
            'list': []
          },
          {
            'createTime': null,
            'createUserId': '',
            'delFlag': null,
            'display': 1,
            'icon': 'el-icon-view',
            'menuId': '93d786f2bfbf46398e3b495f6c70156c',
            'name': '角色管理',
            'open': null,
            'orderNum': 2,
            'orgId': '13',
            'orgName': '13',
            'parentId': '1',
            'parentName': null,
            'perms': 'sys:role:list',
            'remark': null,
            'resourceClass': null,
            'sqlMap': {},
            'type': 1,
            'updateTime': '2018-03-28 11:20:19',
            'updateUserId': '系统管理员',
            'url': '/sys/role',
            'list': []
          },
          {
            'createTime': null,
            'createUserId': '',
            'delFlag': null,
            'display': 1,
            'icon': 'el-icon-edit-outline',
            'menuId': 'f9e8bed5cf6a485db552e0602741564c',
            'name': '字典管理',
            'open': null,
            'orderNum': 6,
            'orgId': '14',
            'orgName': '14',
            'parentId': '1',
            'parentName': null,
            'perms': 'sys:tsysdict:query',
            'remark': null,
            'resourceClass': null,
            'sqlMap': {},
            'type': 1,
            'updateTime': '2018-03-28 11:20:19',
            'updateUserId': '系统管理员',
            'url': '/sys/dict',
            'list': []
          },
          {
            'createTime': null,
            'createUserId': '',
            'delFlag': null,
            'display': 1,
            'icon': 'el-icon-menu',
            'menuId': '83d796f2bf2f46398e3b487f6c99156c',
            'name': '岗位管理',
            'open': null,
            'orderNum': 7,
            'orgId': '15',
            'orgName': '15',
            'parentId': '1',
            'parentName': null,
            'perms': 'sys:tsyspost:query',
            'remark': null,
            'resourceClass': null,
            'sqlMap': {},
            'type': 1,
            'updateTime': '2018-03-28 11:20:19',
            'updateUserId': '系统管理员',
            'url': 'sys/tsyspost/list',
            'list': []
          }
        ]
      },
      {
        'createTime': null,
        'createUserId': '',
        'delFlag': null,
        'display': null,
        'icon': 'glyphicon glyphicon-list-alt',
        'menuId': 'cc3e5f98fb9d4c83bbb29332f4b0d85e',
        'name': '开发管理',
        'open': null,
        'orderNum': 2,
        'orgId': '2',
        'orgName': '2',
        'parentId': '19c786f2bfbf46398e3b495f6c7014b1',
        'parentName': null,
        'perms': '',
        'remark': null,
        'resourceClass': null,
        'sqlMap': {},
        'type': 0,
        'updateTime': '2017-08-12 15:45:18',
        'updateUserId': '系统管理员',
        'url': '',
        'list': [
          {
            'createTime': null,
            'createUserId': '',
            'delFlag': null,
            'display': 1,
            'icon': 'glyphicon glyphicon-th',
            'menuId': 'f9e8bed5cf6a485db552e0602741894c',
            'name': '资源管理',
            'open': null,
            'orderNum': 1,
            'orgId': '21',
            'orgName': '21',
            'parentId': 'cc3e5f98fb9d4c83bbb29332f4b0d85e',
            'parentName': null,
            'perms': 'sys:tsysloginlog:query,sys:tsysloginlog:remove',
            'remark': null,
            'resourceClass': null,
            'sqlMap': {},
            'type': 1,
            'updateTime': '2018-03-28 11:20:19',
            'updateUserId': '系统管理员',
            'url': '/sys/menu'
          /*, "list":[]*/
          },
          {
            'createTime': null,
            'createUserId': '',
            'delFlag': null,
            'display': 1,
            'icon': 'glyphicon glyphicon-th',
            'menuId': 'f9e8bed5cf6a485db552e0602741894c',
            'name': '登录日志2',
            'open': null,
            'orderNum': 1,
            'orgId': '22',
            'orgName': '22',
            'parentId': 'cc3e5f98fb9d4c83bbb29332f4b0d85e',
            'parentName': null,
            'perms': 'sys:tsysloginlog:query,sys:tsysloginlog:remove',
            'remark': null,
            'resourceClass': null,
            'sqlMap': {},
            'type': 1,
            'updateTime': '2018-03-28 11:20:19',
            'updateUserId': '系统管理员',
            'url': 'sys/tsysloginlog/list'
          /*, "list":[]*/
          },
          {
            'createTime': null,
            'createUserId': '',
            'delFlag': null,
            'display': 1,
            'icon': 'glyphicon glyphicon-th',
            'menuId': 'f9e8bed5cf6a485db552e0602741894c',
            'name': '登录日志3',
            'open': null,
            'orderNum': 1,
            'orgId': '23',
            'orgName': '23',
            'parentId': 'cc3e5f98fb9d4c83bbb29332f4b0d85e',
            'parentName': null,
            'perms': 'sys:tsysloginlog:query,sys:tsysloginlog:remove',
            'remark': null,
            'resourceClass': null,
            'sqlMap': {},
            'type': 1,
            'updateTime': '2018-03-28 11:20:19',
            'updateUserId': '系统管理员',
            'url': 'sys/tsysloginlog/list'
            /* ,
          "list":[]*/
          },
          {
            'createTime': null,
            'createUserId': '',
            'delFlag': null,
            'display': 1,
            'icon': 'glyphicon glyphicon-th',
            'menuId': 'f9e8bed5cf6a485db552e0602741894c',
            'name': '登录日志4',
            'open': null,
            'orderNum': 1,
            'orgId': '24',
            'orgName': '24',
            'parentId': 'cc3e5f98fb9d4c83bbb29332f4b0d85e',
            'parentName': null,
            'perms': 'sys:tsysloginlog:query,sys:tsysloginlog:remove',
            'remark': null,
            'resourceClass': null,
            'sqlMap': {},
            'type': 1,
            'updateTime': '2018-03-28 11:20:19',
            'updateUserId': '系统管理员',
            'url': 'sys/tsysloginlog/list'
            /* ,
          "list":[]*/
          }
        ]
      }
    ]
  }
  return {
    url: 'menu/findNavTree',
    type: 'get',
    data: navTreeData
  }
}
// 根据menuId获取子数据
export function findMenuTreeByMenuId() {
  const menuTreeChildren = {
    'code': 200,
    'msg': null,
    'data': [
      {
        'createTime': null,
        'createUserId': '',
        'delFlag': null,
        'display': 1,
        'icon': 'el-icon-news',
        'menuId': '99c786f2bfbf46399e3b495f6c7014bc',
        'name': '机构管理',
        'open': null,
        'orderNum': 1,
        'orgId': '11',
        'orgName': '11',
        'parentId': '1',
        'parentName': '系统管理',
        'perms': 'sys:tsysorg:query,sys:tsysorg:view',
        'remark': null,
        'resourceClass': 1,
        'sqlMap': {},
        'type': 1,
        'updateTime': '2018-03-28 11:20:19',
        'updateUserId': '系统管理员',
        'url': '/sys/dept'
      },
      {
        'createTime': null,
        'createUserId': '',
        'delFlag': null,
        'display': 1,
        'icon': 'el-icon-service',
        'menuId': '92c786f2bfbf46398e3b495f6c70156c',
        'name': '用户管理3',
        'open': null,
        'orderNum': 2,
        'orgId': '12',
        'orgName': '12',
        'parentId': '1',
        'parentName': '系统管理',
        'perms': 'sys:tsysuserinfo:query,sys:tsysuserinfo:view,sys:tsysuserinfo:list',
        'remark': null,
        'resourceClass': 1,
        'sqlMap': {},
        'type': 1,
        'updateTime': '2018-03-28 11:20:19',
        'updateUserId': '系统管理员',
        'url': '/sys/user'
      },
      {
        'createTime': null,
        'createUserId': '',
        'delFlag': null,
        'display': 1,
        'icon': 'el-icon-view',
        'menuId': '93d786f2bfbf46398e3b495f6c70156c',
        'name': '角色管理',
        'open': null,
        'orderNum': 2,
        'orgId': '13',
        'orgName': '13',
        'parentId': '1',
        'parentName': null,
        'perms': 'sys:role:list',
        'remark': null,
        'resourceClass': 1,
        'sqlMap': {},
        'type': 1,
        'updateTime': '2018-03-28 11:20:19',
        'updateUserId': '系统管理员',
        'url': '/sys/role'
      },
      {
        'createTime': null,
        'createUserId': '',
        'delFlag': null,
        'display': 1,
        'icon': 'el-icon-edit-outline',
        'menuId': 'f9e8bed5cf6a485db552e0602741564c',
        'name': '字典管理',
        'open': null,
        'orderNum': 6,
        'orgId': '14',
        'orgName': '14',
        'parentId': '1',
        'parentName': null,
        'perms': 'sys:tsysdict:query',
        'remark': null,
        'resourceClass': 1,
        'sqlMap': {},
        'type': 1,
        'updateTime': '2018-03-28 11:20:19',
        'updateUserId': '系统管理员',
        'url': '/sys/dict'
      },
      {
        'createTime': null,
        'createUserId': '',
        'delFlag': null,
        'display': 1,
        'icon': 'el-icon-menu',
        'menuId': '83d796f2bf2f46398e3b487f6c99156c',
        'name': '岗位管理',
        'open': null,
        'orderNum': 7,
        'orgId': '15',
        'orgName': '15',
        'parentId': '1',
        'parentName': null,
        'perms': 'sys:tsyspost:query',
        'remark': null,
        'resourceClass': 1,
        'sqlMap': {},
        'type': 1,
        'updateTime': '2018-03-28 11:20:19',
        'updateUserId': '系统管理员',
        'url': 'sys/tsyspost/list'
      }
    ]
  }
  /*
  for(let i=0;i<menuTreeChildren.data.length;i++){
    if(menuTreeChildren.data[i].parentId){
      menuTreeChildren.data[i].
    }
  }
*/

  return {
    url: 'menu/findMenuTreeByMenuId',
    type: 'get',
    data: menuTreeChildren
  }
}
// 获取菜单树
export function findMenuTree() {
  const menuTreeData =
    {
      'code': 200,
      'msg': null,
      'data': [
        {
          'createTime': null,
          'createUserId': '',
          'delFlag': null,
          'display': null,
          'icon': 'el-icon-setting',
          'menuId': '1',
          'name': '系统管理',
          'open': null,
          'orderNum': 1,
          'orgId': '1',
          'orgName': '1',
          'parentId': '19c786f2bfbf46398e3b495f6c7014b1',
          'parentName': null,
          'perms': '',
          'remark': null,
          'resourceClass': 0,
          'sqlMap': {},
          'type': 0,
          'updateTime': '2017-08-12 15:45:18',
          'updateUserId': '系统管理员',
          'url': '',
          'hasChildren': true,
          'leaf': true
        },
        {
          'createTime': null,
          'createUserId': '',
          'delFlag': null,
          'display': null,
          'icon': 'glyphicon glyphicon-list-alt',
          'menuId': 'cc3e5f98fb9d4c83bbb29332f4b0d85e',
          'name': '开发管理',
          'open': null,
          'orderNum': 2,
          'orgId': '2',
          'orgName': '2',
          'parentId': '19c786f2bfbf46398e3b495f6c7014b1',
          'parentName': null,
          'perms': '',
          'remark': null,
          'resourceClass': 0,
          'sqlMap': {},
          'type': 0,
          'updateTime': '2017-08-12 15:45:18',
          'updateUserId': '系统管理员',
          'url': ''
        }
      ]
    }

    /* {
    "code": 200,
    "msg": null,
    "data": [
      {
      "id": 1,
      "createBy": null,
      "createTime": null,
      "lastUpdateBy": null,
      "lastUpdateTime": null,
      "parentId": 0,
      "name": "系统管理",
      "url": null,
      "perms": null,
      "type": 0,
      "icon": "el-icon-setting",
      "orderNum": 0,
      "delFlag": 0,
      "parentName": null,
      "level": 0,
      "children": [
        {
        "id": 2,
        "createBy": null,
        "createTime": null,
        "lastUpdateBy": null,
        "lastUpdateTime": null,
        "parentId": 1,
        "name": "用户管理",
        "url": "/sys/user",
        "perms": null,
        "type": 1,
        "icon": "el-icon-service",
        "orderNum": 1,
        "delFlag": 0,
        "parentName": "系统管理",
        "level": 1,
        "children": [{
          "id": 9,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 2,
          "name": "查看",
          "url": null,
          "perms": "sys:user:view",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "用户管理",
          "level": 2,
          "children": []
        }, {
          "id": 10,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 2,
          "name": "新增",
          "url": null,
          "perms": "sys:user:add",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "用户管理",
          "level": 2,
          "children": []
        }, {
          "id": 11,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 2,
          "name": "修改",
          "url": null,
          "perms": "sys:user:edit",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "用户管理",
          "level": 2,
          "children": []
        }, {
          "id": 12,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 2,
          "name": "删除",
          "url": null,
          "perms": "sys:user:delete",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "用户管理",
          "level": 2,
          "children": []
        }]
      },
        {
        "id": 3,
        "createBy": null,
        "createTime": null,
        "lastUpdateBy": null,
        "lastUpdateTime": null,
        "parentId": 1,
        "name": "机构管理",
        "url": "/sys/dept",
        "perms": null,
        "type": 1,
        "icon": "el-icon-news",
        "orderNum": 2,
        "delFlag": 0,
        "parentName": "系统管理",
        "level": 1,
        "children": [{
          "id": 13,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 3,
          "name": "查看",
          "url": null,
          "perms": "sys:dept:view",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "机构管理",
          "level": 2,
          "children": []
        }, {
          "id": 14,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 3,
          "name": "新增",
          "url": null,
          "perms": "sys:dept:add",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "机构管理",
          "level": 2,
          "children": []
        }, {
          "id": 15,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 3,
          "name": "修改",
          "url": null,
          "perms": "sys:dept:edit",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "机构管理",
          "level": 2,
          "children": []
        }, {
          "id": 16,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 3,
          "name": "删除",
          "url": null,
          "perms": "sys:dept:delete",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "机构管理",
          "level": 2,
          "children": []
        }]
      }, {
        "id": 4,
        "createBy": null,
        "createTime": null,
        "lastUpdateBy": null,
        "lastUpdateTime": null,
        "parentId": 1,
        "name": "角色管理",
        "url": "/sys/role",
        "perms": null,
        "type": 1,
        "icon": "el-icon-view",
        "orderNum": 4,
        "delFlag": 0,
        "parentName": "系统管理",
        "level": 1,
        "children": [{
          "id": 17,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 4,
          "name": "查看",
          "url": null,
          "perms": "sys:role:view",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "角色管理",
          "level": 2,
          "children": []
        }, {
          "id": 18,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 4,
          "name": "新增",
          "url": null,
          "perms": "sys:role:add",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "角色管理",
          "level": 2,
          "children": []
        }, {
          "id": 19,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 4,
          "name": "修改",
          "url": null,
          "perms": "sys:role:edit",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "角色管理",
          "level": 2,
          "children": []
        }, {
          "id": 20,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 4,
          "name": "删除",
          "url": null,
          "perms": "sys:role:delete",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "角色管理",
          "level": 2,
          "children": []
        }]
      }, {
        "id": 5,
        "createBy": null,
        "createTime": null,
        "lastUpdateBy": null,
        "lastUpdateTime": null,
        "parentId": 1,
        "name": "菜单管理",
        "url": "/sys/menu",
        "perms": null,
        "type": 1,
        "icon": "el-icon-menu",
        "orderNum": 5,
        "delFlag": 0,
        "parentName": "系统管理",
        "level": 1,
        "children": [{
          "id": 21,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 5,
          "name": "查看",
          "url": null,
          "perms": "sys:menu:view",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "菜单管理",
          "level": 2,
          "children": []
        }, {
          "id": 22,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 5,
          "name": "新增",
          "url": null,
          "perms": "sys:menu:add",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "菜单管理",
          "level": 2,
          "children": []
        }, {
          "id": 23,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 5,
          "name": "修改",
          "url": null,
          "perms": "sys:menu:edit",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "菜单管理",
          "level": 2,
          "children": []
        }, {
          "id": 24,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 5,
          "name": "删除",
          "url": null,
          "perms": "sys:menu:delete",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "菜单管理",
          "level": 2,
          "children": []
        }]
      }, {
        "id": 7,
        "createBy": null,
        "createTime": null,
        "lastUpdateBy": null,
        "lastUpdateTime": null,
        "parentId": 1,
        "name": "字典管理",
        "url": "/sys/dict",
        "perms": null,
        "type": 1,
        "icon": "el-icon-edit-outline",
        "orderNum": 7,
        "delFlag": 0,
        "parentName": "系统管理",
        "level": 1,
        "children": [{
          "id": 31,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 7,
          "name": "查看",
          "url": null,
          "perms": "sys:dict:view",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "字典管理",
          "level": 2,
          "children": []
        }, {
          "id": 32,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 7,
          "name": "新增",
          "url": null,
          "perms": "sys:dict:add",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "字典管理",
          "level": 2,
          "children": []
        }, {
          "id": 33,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 7,
          "name": "修改",
          "url": null,
          "perms": "sys:dict:edit",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "字典管理",
          "level": 2,
          "children": []
        }, {
          "id": 34,
          "createBy": null,
          "createTime": null,
          "lastUpdateBy": null,
          "lastUpdateTime": null,
          "parentId": 7,
          "name": "删除",
          "url": null,
          "perms": "sys:dict:delete",
          "type": 2,
          "icon": null,
          "orderNum": 0,
          "delFlag": 0,
          "parentName": "字典管理",
          "level": 2,
          "children": []
        }]
      }, {
        "id": 8,
        "createBy": null,
        "createTime": null,
        "lastUpdateBy": "admin",
        "lastUpdateTime": "2018-09-23T11:32:28.000+0000",
        "parentId": 1,
        "name": "系统日志",
        "url": "/sys/log",
        "perms": "sys:log:view",
        "type": 1,
        "icon": "el-icon-info",
        "orderNum": 8,
        "delFlag": 0,
        "parentName": "系统管理",
        "level": 1,
        "children": []
      }]
    }, {
      "id": 43,
      "createBy": "admin",
      "createTime": "2018-12-27T02:57:29.000+0000",
      "lastUpdateBy": "admin",
      "lastUpdateTime": "2018-12-27T03:02:26.000+0000",
      "parentId": 0,
      "name": "系统监控",
      "url": "",
      "perms": "",
      "type": 0,
      "icon": "el-icon-info",
      "orderNum": 1,
      "delFlag": 0,
      "parentName": null,
      "level": 0,
      "children": [{
        "id": 6,
        "createBy": null,
        "createTime": null,
        "lastUpdateBy": "admin",
        "lastUpdateTime": "2018-12-27T03:03:45.000+0000",
        "parentId": 43,
        "name": "数据监控",
        "url": "http://139.196.87.48:8001/druid/login.html",
        "perms": null,
        "type": 1,
        "icon": "el-icon-warning",
        "orderNum": 0,
        "delFlag": 0,
        "parentName": "系统监控",
        "level": 1,
        "children": []
      }, {
        "id": 38,
        "createBy": "admin",
        "createTime": "2018-11-02T12:02:15.000+0000",
        "lastUpdateBy": "admin",
        "lastUpdateTime": "2018-12-27T03:03:53.000+0000",
        "parentId": 43,
        "name": "服务监控",
        "url": "http://139.196.87.48:8000/",
        "perms": "",
        "type": 1,
        "icon": "el-icon-view",
        "orderNum": 1,
        "delFlag": 0,
        "parentName": "系统监控",
        "level": 1,
        "children": []
      }]
    }, {
      "id": 44,
      "createBy": "admin",
      "createTime": "2018-12-27T03:05:48.000+0000",
      "lastUpdateBy": "admin",
      "lastUpdateTime": "2018-12-27T03:06:39.000+0000",
      "parentId": 0,
      "name": "服务治理",
      "url": "",
      "perms": "",
      "type": 0,
      "icon": "el-icon-service",
      "orderNum": 2,
      "delFlag": 0,
      "parentName": null,
      "level": 0,
      "children": [{
        "id": 41,
        "createBy": "admin",
        "createTime": "2018-11-03T03:06:48.000+0000",
        "lastUpdateBy": "admin",
        "lastUpdateTime": "2018-12-27T03:08:11.000+0000",
        "parentId": 44,
        "name": "注册中心",
        "url": "http://139.196.87.48:8500",
        "perms": "",
        "type": 1,
        "icon": " el-icon-view",
        "orderNum": 0,
        "delFlag": 0,
        "parentName": "服务治理",
        "level": 1,
        "children": []
      }]
    }, {
      "id": 35,
      "createBy": null,
      "createTime": null,
      "lastUpdateBy": "admin",
      "lastUpdateTime": "2018-12-27T03:04:18.000+0000",
      "parentId": 0,
      "name": "接口文档",
      "url": "http://139.196.87.48:8001/swagger-ui.html",
      "perms": null,
      "type": 1,
      "icon": "el-icon-document",
      "orderNum": 3,
      "delFlag": 0,
      "parentName": null,
      "level": 0,
      "children": []
    }, {
      "id": 42,
      "createBy": "admin",
      "createTime": "2018-11-15T06:39:30.000+0000",
      "lastUpdateBy": "admin",
      "lastUpdateTime": "2018-11-15T06:56:18.000+0000",
      "parentId": 0,
      "name": "代码生成",
      "url": "/generator/generator",
      "perms": "",
      "type": 1,
      "icon": "el-icon-star-on",
      "orderNum": 5,
      "delFlag": 0,
      "parentName": null,
      "level": 0,
      "children": []
    }, {
      "id": 28,
      "createBy": null,
      "createTime": null,
      "lastUpdateBy": "admin",
      "lastUpdateTime": "2018-11-15T06:39:43.000+0000",
      "parentId": 0,
      "name": "使用案例",
      "url": null,
      "perms": null,
      "type": 0,
      "icon": "el-icon-picture-outline",
      "orderNum": 6,
      "delFlag": 0,
      "parentName": null,
      "level": 0,
      "children": [{
        "id": 29,
        "createBy": null,
        "createTime": null,
        "lastUpdateBy": null,
        "lastUpdateTime": null,
        "parentId": 28,
        "name": "国际化",
        "url": "/demo/i18n",
        "perms": null,
        "type": 1,
        "icon": "el-icon-edit",
        "orderNum": 1,
        "delFlag": 0,
        "parentName": "使用案例",
        "level": 1,
        "children": []
      }, {
        "id": 30,
        "createBy": null,
        "createTime": null,
        "lastUpdateBy": null,
        "lastUpdateTime": null,
        "parentId": 28,
        "name": "换皮肤",
        "url": "/demo/theme",
        "perms": null,
        "type": 1,
        "icon": "el-icon-picture",
        "orderNum": 2,
        "delFlag": 0,
        "parentName": "使用案例",
        "level": 1,
        "children": []
      }]
    }]
  }*/
  return {
    url: 'menu/findMenuTree',
    type: 'get',
    data: menuTreeData
  }
}

export function setParentName(data) {
  if (data == null) {
    return
  }
  const len = data.length
  for (let i = 0; i < len; i++) {
    const menu = data[i]
    menu.parentName = 'menu' + menu.parentId
    if (menu.list != null) {
      setParentName(menu.list)
    }
  }
}

