import axios from '@/http/axios'

// TODO 栏目图片

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/api/site/tevglsiteavd/query',
    method: 'get',
    params
  })
}

// 保存
export const save = (data) => {
  return axios({
    url: '/api/site/tevglsiteavd/saveorupdate?attachId=' + data.avdPicurlPcAttachId + '&attachIdForMobile=' + data.avdPicurlMobileAttachId,
    method: 'post',
    data
  })
}

// 删除
export const doDelete = (data) => {
  return axios({
    url: '/api/site/tevglsiteavd/deletes',
    method: 'post',
    data
  })
}

// 查看明细
export const view = (id) => {
  return axios({
    url: '/api/site/tevglsiteavd/view/' + id,
    method: 'get'
  })
}

export const updateState = (data) => {
  return axios({
    url: '/api/site/tevglsiteavd/updateStatus',
    method: 'post',
    data
  })
}
