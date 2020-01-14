import request from '@/utils/request'
/**
 * 服务站人员管理
 */

// 添加
export function add(data) {
  return request({
    url: '/hly/waiter/add',
    method: 'post',
    params: { ...data }
  })
}

// 删除
export function del(data) {
  return request({
    url: '/hly/waiter/del',
    method: 'post',
    params: { ...data }
  })
}
// 根据id查询人员信息
export function edit(data) {
  return request({
    url: '/hly/waiter/edit',
    method: 'post',
    params: { ...data }
  })
}
// 删除菜单
export function list(data) {
  return request({
    url: '/hly/waiter/list',
    method: 'get'
  })
}
// 获取菜单树
export function queryById() {
  return request({
    url: '/hly/waiter/queryById',
    method: 'get'
  })
}

export function queryName() {
  return request({
    url: '/hly/station/queryName',
    method: 'get'
  })
}
