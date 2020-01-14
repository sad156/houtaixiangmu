import request from '@/utils/request'

export function getDeptName() {
  return request({
    url: '/sys/dept/getDeptName',
    method: 'get'
  })
}
export function list(query) {
  return request({
    url: '/sys/dept/list',
    method: 'get',
    params: query
  })
}
export function addDept(data) {
  return request({
    url: '/sys/dept/addDept',
    method: 'post',
    params: { ...data }
  })
}
export function queryDeptByid(data) {
  return request({
    url: '/sys/dept/queryDeptByid',
    method: 'get',
    params: data
  })
}
// 编辑菜单
export function editDept(data) {
  return request({
    url: '/sys/dept/editDept',
    method: 'post',
    params: { ...data }
  })
}
// 删除菜单
export function delDeptByid(data) {
  return request({
    url: '/sys/dept/delDeptByid',
    method: 'get',
    params: data
  })
}
