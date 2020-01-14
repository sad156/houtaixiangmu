import request from '@/utils/request'
/**
 * 退机接口
 */

// 获取退机管理列表
export function list(query) {
  return request({
    url: '/hly/refund/list',
    method: 'get'
  })
}
