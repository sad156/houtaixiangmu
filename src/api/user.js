import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: 'sys/login',
    method: 'post',
    params: { ...data }
  })
}

// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/sys/info',
    method: 'get',
    params: { token }
  })
}

// 添加用户
export function addUser(data) {
  return request({
    url: '/sys/user/addUser',
    method: 'post',
    params: {...data }
  })
}

// 删除用户
export function delUser(data){
  return request({
    url: '/sys/user/delUser',
    method: 'post',
    params: {...data }
  })
}

// 冻结用户
export function frostUser(data){
  return request({
    url: '/sys/user/frostUser',
    method: 'post',
    params: {...data }
  })
}
// 解除冻结
export function unfreezeUser(data){
  return request({
    url: '/sys/user/unfreezeUser',
    method: 'post',
    params: {...data }
  })
}
// 获取所有用户
export function list(query) {
  return request({
    url: '/sys/user/list',
    method: 'get',
    params: query
  })
}
// 通过ID查询用户信息
export function queryUserByid(data){
  return request({
    url: '/sys/user/queryUserByid',
    method: 'get',
    params: {...data }
  })
}
//编辑用户信息
export function updateUser(data) {
  return request({
    url: '/sys/user/updateUser',
    method: 'post',
    params: {...data }
  })
}

export function getAllUser(){
  return request({
    url: '/sys/user/getAllUser',
    method: 'get'
  })
}
// 退出
export function logout() {
  return request({
    url: '/sys/logout',
    method: 'post'
  })
}
