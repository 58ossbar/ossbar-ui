import axios from '@/http/axios'

/*
 * 字典管理模块
 */

/**
 * 根据条件分页查询字典列表
 * @param {*} params
 * @returns
 */
export const findPage = (params) => {
  return axios({
    url: '/api/sys/dict/query',
    method: 'get',
    params
  })
}

// 保存
export const saveType = (data) => {
  return axios({
    url: '/api/sys/dict/saveType',
    method: 'post',
    data
  })
}

export const update = (data) => {
  return axios({
    url: '/api/sys/dict/update',
    method: 'post',
    data
  })
}

// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/dict/delete',
    method: 'post',
    data
  })
}

export const findTree = (params) => {
  return axios({
    url: '/api/sys/dict/dicttree',
    method: 'get',
    params
  })
}
