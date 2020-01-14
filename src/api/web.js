import request from '@/utils/request'
/**
 * 佣金月结接口
 */

// 获取所有物联网卡
export function list(query) {
  return request({
    url: '/hly/web/list',
    method: 'get',
    params: query
  })
}

// 添加物联网卡
export function add(data) {
  return request({
    url: '/hly/web/add',
    method: 'post',
    params: { ...data }
  })
}
