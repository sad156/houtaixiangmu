import request from '@/utils/request'
/**
 * 预约订单管理
 */

// 获取退机管理列表
export function list(query) {
  return request({
    url: '/hly/subscribe/list',
    method: 'get'
  })
}
