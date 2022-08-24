import axios from '@/http/axios'

/*
 * 系统登录模块
 */

/**
 *
 * @param {*} data
 * @returns
 */
export const getPublicKey = data => {
  return axios({
    url: 'user/getPublicKey',
    method: 'post',
    data
  })
}

// 登录
export const login = data => {
  return axios({
    url: 'user/login',
    method: 'post',
    data
  })
}

// 登出
export const logout = () => {
  return axios({
    url: 'user/logout',
    method: 'get'
  })
}
