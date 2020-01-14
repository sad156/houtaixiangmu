import request from '@/utils/request'

// 经销商管理

// 添加经销商
export function addDis(data) {
  return request({
    url: '/hly/dealer/add',
    method: 'post',
    params: { ...data }
  })
}

// 删除经销商
export function delDis(data) {
  return request({
    url: '/hly/dealer/deldealer',
    method: 'post',
    params: { ...data }
  })
}

// 编辑经销商
export function editDis(data) {
  return request({
    url: '/hly/dealer/editdealer',
    method: 'post',
    params: { ...data }
  })
}

// 注销经销商
export function issDis(data) {
  return request({
    url: '/hly/dealer/issue',
    method: 'post',
    params: { ...data }
  })
}

// 获取经销商列表信息
export function list(query) {
  return request({
    url: '/hly/dealer/list',
    method: 'get'
  })
}

// 恢复经销商
export function pauDis(data) {
  return request({
    url: '/hly/dealer/pause',
    method: 'post',
    params: { ...data }
  })
}

// 根据id查询经销商
export function queryDis(data) {
  return request({
    url: '/hly/dealer/queryByid',
    method: 'get',
    params: { ...data }
  })
}
