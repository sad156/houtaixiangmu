import request from '@/utils/request'
// 日志查看
export function list() {
  return request({
    url: '/sys/operlog/list',
    method: 'get'
  })
}
