import request from '@/utils/request'

// 客户管理

// 删除客户
export function delCust(data) {
  return request({
    url: '/hly/user/del',
    method: 'post',
    params: { ...data }
  })
}

// 获取所有客户信息
export function list(query) {
  return request({
    url: '/hly/user/list',
    method: 'get'
  })
}

// 查看客户详情
export function queryCustByid(data) {
  return request({
    url: '/hly/user/queryByid',
    method: 'get',
    params: { ...data }
  })
}

// 设备关机
export function queryCustdown(data) {
  return request({
    url: '/hly/user/shutdown',
    method: 'post',
    params: { ...data }
  })
}

// 设备开机
export function queryCustup(data) {
  return request({
    url: '/hly/user/startingUp',
    method: 'post',
    params: { ...data }
  })
}

// 设备强冲
export function queryCuststrong(data) {
  return request({
    url: '/hly/user/strong',
    method: 'post',
    params: { ...data }
  })
}

