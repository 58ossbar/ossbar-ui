import axios from '@/http/axios'

/*
 * 机构管理模块
 */

// 保存
export const save = (data) => {
  return axios({
    url: '/dept/save',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/dept/delete',
    method: 'post',
    data
  })
}
// 查询机构树
export const getOrgTree = () => {
  return axios({
    url: '/api/sys/org/getOrgTree',
    method: 'get'
  })
}

// 根据Id获取子数据
export const findDeptChildrenTree = () => {
  return axios({
    url: '/dept/findDeptChildrenTree',
    method: 'get'
  })
}

export const findTree = (params) => {
  return axios({
    url: '/api/sys/org/query',
    method: 'get',
    params
  })
}
