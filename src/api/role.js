import request from '@/utils/request'

export function getAllRoleName() {
  return request({
    url: '/sys/role/getAllRoleName',
    method: 'get'
  })
}
// 获取全部角色信息
export function list(query) {
    return request({
      url: '/sys/role/list',
      method: 'get',
      params: query
    })
}
// 删除
export function delRole(data){
  return request({
    url: '/sys/role/delRole',
    method: 'post',
    params: {...data }
  })
}
// 增加角色
export function addRole(data){
  return request({
    url: '/sys/role/addRole',
    method: 'post',
    params: {...data }
  })
}
// 通过ID查询用户信息
export function queryRoleById(data){
  return request({
    url: '/sys/role/queryRoleById',
    method: 'get',
    params: {...data }
  })
}

export function getUserRole(data){
  return request({
    url: '/sys/role/getUserRole',
    method: 'get',
    params: {...data }
  })
}

export function autoUser(data){
  return request({
    url: '/sys/role/autoUser',
    method: 'post',
    params: {...data }
  })
}
// 编辑角色
export function editRole(data){
  return request({
    url: '/sys/role/editRole',
    method: 'post',
    params: {...data }
  })
}
