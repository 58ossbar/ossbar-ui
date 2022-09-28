import axios from '@/http/axios'

/*
 * 设置
 */

/**
 * 保存
 * @param {*} data
 * @returns
 */
export const update = (data) => {
  if (data) {
    return axios({
      url: '/api/sys/settings/update',
      method: 'post',
      data
    })
  }
}

/**
 * 查询
 * @param {*} params
 * @returns
 */
export const findData = (params) => {
  return axios({
    url: '/user/querySettings',
    method: 'get',
    params
  })
}

