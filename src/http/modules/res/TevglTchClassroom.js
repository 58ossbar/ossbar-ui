import axios from '@/http/axios'

export const queryTeacherList = (params) => {
  return axios({
    url: '/api/tch/tevgltchclassroom/queryTeacherList',
    method: 'get',
    params
  })
}
