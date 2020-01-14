import request from '@/utils/request'

// 获取所有设备信息
export function list(query) {
  return request({
    url: '/hly/equipment/list',
    method: 'get',
    params: query
  })
}

// 添加设备
export function addEquipment(data) {
  return request({
    url: '/hly/equipment/addEquipment',
    method: 'post',
    params: { ...data }
  })
}

// 删除设备
export function delEquipment(data) {
  return request({
    url: '/hly/equipment/delEquipment',
    method: 'post',
    params: { ...data }
  })
}

// 编辑设备
export function editEqu(data) {
  return request({
    url: '/hly/equipment/editEqu',
    method: 'post',
    params: { ...data }
  })
}

// 通过ID查询设备
export function queryEquipByid(data) {
  return request({
    url: '/hly/equipment/queryEquipByid',
    method: 'get',
    params: { ...data }
  })
}

// 查询所有设备名称
export function queryname(data) {
  return request({
    url: '/hly/equipment/queryname',
    method: 'get'
  })
}

export function getname(data) {
  return request({
    url: '/hly/fliter/getname',
    method: 'get'
  })
}
