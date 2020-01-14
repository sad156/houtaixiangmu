import request from '@/utils/request'
/**
 * 客户反馈信息管理
 */

// 获取客户反馈列表
export function list(data) {
  return request({
    url: '/hly/feedback/list',
    method: 'get'
  })
}
// 删除反馈信息
export function delfeedback(data) {
  return request({
    url: '/hly/feedback/delfeedback',
    method: 'post',
    params: { ...data }
  })
}
