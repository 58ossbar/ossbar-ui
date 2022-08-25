import axios from '@/http/axios'

/*
 * 用户管理模块
 */

// 保存
export const save = (data) => {
  return axios({
    url: '/user/save',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/user/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/sys/user/findPage',
    method: 'get',
    params
  })
}
// 查找用户的菜单权限标识集合
export const findPermissions = (params) => {
  return axios({
    url: '/api/sys/user/findPermissions',
    method: 'get',
    params
  })
}
