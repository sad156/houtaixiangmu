import request from '@/utils/request'
/**
 * 充值接口
 */

// 反馈维修信息
export function editFeedInfo(data) {
  return request({
    url: '/hly/maintain/editFeedInfo',
    method: 'post',
    params: { ...data }
  })
}
// 获取所有设备维修信息
export function list(query) {
  return request({
    url: '/hly/maintain/list',
    method: 'get'
  })
}
// 根据ID查询维修信息
export function queryMaintainByid(data) {
  return request({
    url: '/hly/maintain/queryMaintainByid',
    method: 'get',
    params: { ...data }
  })
}
