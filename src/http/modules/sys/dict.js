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

/**
 * 查看明细
 * @param {*} id 岗位id
 * @returns
 */
export const view = (id) => {
  return axios({
    url: '/api/sys/dict/view/' + id,
    method: 'get'
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

export const updateType = (data) => {
  return axios({
    url: '/api/sys/dict/updateType',
    method: 'post',
    data
  })
}

export const save = (data) => {
  return axios({
    url: '/api/sys/dict/save',
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
    url: '/api/sys/dict/deletes',
    method: 'delete',
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
