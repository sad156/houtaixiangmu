import request from '@/utils/request'

// 获取所有设备信息
export function list(query) {
  return request({
    url: '/hly/equipment/list',
    method: 'get',
    params: query
  })
}
