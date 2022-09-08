import axios from '@/http/axios'

// 查询左侧树
export const findTree = (params) => {
  return axios({
    url: '/api/sys/parameter/paraTree',
    method: 'get',
    params
  })
}

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/sys/parameter/query',
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
    url: '/api/sys/parameter/view/' + id,
    method: 'get'
  })
}

export const save = (data) => {
  return axios({
    url: '/api/sys/parameter/save',
    method: 'post',
    data
  })
}

export const update = (data) => {
  return axios({
    url: '/api/sys/parameter/update',
    method: 'post',
    data
  })
}
