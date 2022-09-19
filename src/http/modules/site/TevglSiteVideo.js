import axios from '@/http/axios'

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/site/tevglsitevideo/query',
    method: 'get',
    params
  })
}

// 保存
export const save = (data) => {
  return axios({
    url: '/api/site/tevglsitevideo/saveorupdate',
    method: 'post',
    data
  })
}

// 删除
export const doDelete = (data) => {
  return axios({
    url: '/api/site/tevglsitevideo/deletes',
    method: 'post',
    data
  })
}

// 查看明细
export const view = (id) => {
  return axios({
    url: '/api/site/tevglsitevideo/view/' + id,
    method: 'get'
  })
}
