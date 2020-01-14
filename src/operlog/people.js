import request from '@/utils/request'

// 服务站人员管理

// 添加服务站人员
export function add(data) {
  return request({
    url: '/hly/waiter/add',
    method: 'post',
    params: { ...data }
  })
}

// 删除服务站
export function del(data) {
  return request({
    url: '/hly/waiter/del',
    method: 'post',
    params: { ...data }
  })
}

// 获取服务站列表信息
export function list(query) {
  return request({
    url: '/hly/waiter/list',
    method: 'get'
  })
}

// 根据id查询服务站信息
export function queryById(query) {
  return request({
    url: '/hly/waiter/queryById',
    method: 'get',
    params: { ...query }
  })
}

// 根据id查询服务站人员信息
export function edit(data) {
  return request({
    url: '/hly/waiter/edit',
    method: 'post',
    params: { ...data }
  })
}

export function queryName(data) {
  return request({
    url: '/hly/station/queryName',
    method: 'get',
    params: { ...data }
  })
}
