import axios from '@/http/axios'

/*
 * 角色管理模块
 */

// 保存
export const save = (data) => {
  return axios({
    url: '/role/save',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/role/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/sys/role/query',
    method: 'get',
    params
  })
}
// 查询全部
export const findAll = () => {
  return axios({
    url: '/role/findAll',
    method: 'get'
  })
}
// 查询角色菜单集合
export const findRoleMenus = (params) => {
  return axios({
    url: '/role/findRoleMenus',
    method: 'get',
    params
  })
}
// 保存角色菜单集合
export const saveRoleMenus = (data) => {
  return axios({
    url: '/role/saveRoleMenus',
    method: 'post',
    data
  })
}
