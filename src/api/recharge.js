import request from '@/utils/request'
/**
 * 充值接口
 */

// 根据设备ID查询用户信息
export function getUseInfo(data) {
  return request({
    url: '/hly/recharge/getUseInfo',
    method: 'get',
    params: { ...data }
  })
}
// 获取充值所有列表信息
export function list(query) {
  return request({
    url: '/hly/recharge/list',
    method: 'get'
  })
}
// 充值
export function rechargeInfo(data) {
  return request({
    url: '/hly/recharge/rechargeInfo',
    method: 'post',
    params: { ...data }
  })
}
// 驳回
export function reject(data) {
  return request({
    url: '/hly/recharge/reject',
    method: 'post',
    params: { ...data }
  })
}

// 同意
export function agree(data) {
  return request({
    url: '/hly/recharge/agree',
    method: 'post',
    params: { ...data }
  })
}
