import axios from '@/http/axios'

/*
 * 角色管理模块
 */

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/sys/role/query',
    method: 'get',
    params
  })
}

/**
 * 查看明细
 * @param {*} id 角色id
 * @returns
 */
export const view = (id) => {
  return axios({
    url: '/api/sys/role/view/' + id,
    method: 'get'
  })
}

// 保存
export const save = (data) => {
  return axios({
    url: '/api/sys/role/save',
    method: 'post',
    data
  })
}

export const update = (data) => {
  return axios({
    url: '/api/sys/role/update',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/api/sys/role/deletes',
    method: 'post',
    data
  })
}

// 查询全部
export const findAll = () => {
  return axios({
    url: '/api/sys/role/queryAll',
    method: 'get'
  })
}
// 查询角色菜单集合
export const findRoleMenus = (params) => {
  return axios({
    url: '/api/sys/role/findRoleMenus',
    method: 'get',
    params
  })
}
// 保存角色菜单集合
export const saveRoleMenus = (data) => {
  return axios({
    url: '/api/sys/role/saveRoleMenus',
    method: 'post',
    data
  })
}

/**
 * 获取用于回显用户的数据
 * @param {*} data
 * @returns
 */
export const setUser = (data) => {
  return axios({
    url: '/api/sys/role/setUser',
    method: 'post',
    data
  })
}

// 分配用户---保存
export const saveRoleUser = (data) => {
  return axios({
    url: '/api/sys/role/saveRoleUser',
    method: 'post',
    data
  })
}
