import request from '@/utils/request'

// 服务站管理

// 添加服务站
export function addStation(data) {
  return request({
    url: '/hly/station/addStation',
    method: 'post',
    params: { ...data }
  })
}

// 删除服务站
export function delStation(data) {
  return request({
    url: '/hly/station/delStation',
    method: 'post',
    params: { ...data }
  })
}

// 编辑服务站
export function editStation(data) {
  return request({
    url: '/hly/station/editStation',
    method: 'post',
    params: { ...data }
  })
}

// 注销服务站
export function issue(data) {
  return request({
    url: '/hly/station/issue',
    method: 'post',
    params: { ...data }
  })
}

// 获取服务站列表信息
export function list(query) {
  return request({
    url: '/hly/station/list',
    method: 'get'
  })
}

// 恢复服务站
export function pause(data) {
  return request({
    url: '/hly/station/pause',
    method: 'post',
    params: { ...data }
  })
}

// 根据id查询服务站信息
export function queryById(query) {
  return request({
    url: '/hly/station/queryById',
    method: 'get',
    params: { ...query }
  })
}

// 获取服务站名称列表
export function queryName(data) {
  return request({
    url: '/hly/station/queryName',
    method: 'get',
    params: { ...data }
  })
}
