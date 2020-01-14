import request from '@/utils/request'
/**
 * 佣金月结接口
 */

// 获取所有佣金月结明细
export function list(query) {
  return request({
    url: '/hly/mounthy/list',
    method: 'get',
    params: query
  })
}

// 查看佣金月结明细详情
export function QueryInfo(query) {
  return request({
    url: '/hly/mounthy/QueryInfo',
    method: 'get',
    params: query
  })
}
