import request from '@/utils/request'
/**
 * 滤芯管理
 */

// 添加滤芯
export function addfliter(data) {
  return request({
    url: '/hly/fliter/addfliter',
    method: 'post',
    params: { ...data }
  })
}

// 通过ID查询滤芯
export function queryFliter(data) {
  return request({
    url: '/hly/fliter/queryFliter',
    method: 'get',
    params: { ...data }
  })
}
// 获取所有滤芯列表
export function list(data) {
  return request({
    url: '/hly/fliter/list',
    method: 'get'
  })
}
// 删除滤芯
export function delfliter(data) {
  return request({
    url: '/hly/fliter/delfliter',
    method: 'post',
    params: { ...data }
  })
}
