import request from '@/utils/request'

// 反馈信息管理

// 逻辑删除反馈信息
export function delfeedback(data) {
  return request({
    url: '/hly/feedback/delfeedback',
    method: 'post',
    params: { ...data }
  })
}

// 删除服务站
export function list(data) {
  return request({
    url: '/hly/feedback/list',
    method: 'get',
    params: { ...data }
  })
}

