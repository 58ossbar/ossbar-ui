import axios from '@/http/axios'

// 查看明细
export const view = (id) => {
  return axios({
    url: '/api/trainee/tevgltraineeinfo/view/' + id,
    method: 'get'
  })
}
