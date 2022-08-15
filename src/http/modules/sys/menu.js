import axios from '@/http/axios'

/*
 * 菜单管理模块
 */

// 保存
export const save = (data) => {
  return axios({
    url: '/menu/save',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/menu/delete',
    method: 'post',
    data
  })
}
// 查找导航菜单树
/* export const findNavTree = (params) => {
    return axios({
        url: '/api/menu/findNavTree',
        method: 'get',
        params
    })
}*/
export const findNavTree = (params) => {
  return axios({
    url: '/menu/findNavTree',
    method: 'get',
    params
  })
}
// 查找菜单树
export const findMenuTree = () => {
  return axios({
    url: '/menu/findMenuTree',
    method: 'get'
  })
}
// 根据menuId获取子数据
export const findMenuTreeByMenuId = () => {
  return axios({
    url: '/menu/findMenuTreeByMenuId',
    method: 'get'
  })
}
