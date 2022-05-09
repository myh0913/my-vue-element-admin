import request from '@/utils/request'

export function getArticleList(query) {
  return request({
    url: '/vue-element-admin/test/list',
    method: 'get',
    params: query
  })
}
