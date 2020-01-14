import request from '@/utils/request'
/**
 * 订单管理接口
 */

// 获取所有订单
export function list(query) {
  return request({
    url: '/hly/order/list',
    method: 'get'
  })
}

