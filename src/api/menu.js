import request from '@/utils/request'
/**
 * 菜单api接口
 */

// 根据角色获取菜单
export function queryMenus(name) {
  return request({
    url: '/sys/getMenus',
    method: 'get'
  })
}

// 通过ID获取菜单信息
export function queryMenuByid(data) {
  return request({
    url: '/sys/menu/queryMenuByid',
    method: 'get',
    params: { ...data }
  })
}
// 添加菜单
export function add(data) {
  return request({
    url: '/sys/menu/add',
    method: 'post',
    params: { ...data }
  })
}
// 编辑
export function editMenu(data) {
  return request({
    url: '/sys/menu/editMenu',
    method: 'post',
    params: { ...data }
  })
}
// 查询所有菜单
export function list(query) {
  return request({
    url: '/sys/menu/list',
    method: 'get',
    params: query
  })
}
// 删除菜单
export function delMenu(data) {
  return request({
    url: '/sys/menu/delMenu',
    method: 'post',
    params: { ...data }
  })
}
// 获取菜单树
export function getAllMenuName() {
  return request({
    url: '/sys/menu/getAllMenuName',
    method: 'get'
  })
}

