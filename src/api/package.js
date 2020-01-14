import request from '@/utils/request'
/**
 * 套餐管理
 */

// 添加套餐
export function addcombo(data) {
  return request({
    url: '/hly/package/addcombo',
    method: 'post',
    params: { ...data }
  })
}

// 编辑套餐
export function editcombo(data) {
  return request({
    url: '/hly/package/editcombo',
    method: 'post',
    params: { ...data }
  })
}
// 获取所有套餐列表
export function list(data) {
  return request({
    url: '/hly/package/list',
    method: 'get'
  })
}
// 删除滤芯
export function del(data) {
  return request({
    url: '/hly/package/del',
    method: 'post',
    params: { ...data }
  })
}
// 根据ID查询套餐
export function queryById(data) {
  return request({
    url: '/hly/package/queryById',
    method: 'get',
    params: { ...data }
  })
}

export function queryname(data) {
  return request({
    url: '/hly/equipment/queryname',
    method: 'get',
    params: { ...data }
  })
}
