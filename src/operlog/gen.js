import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/tool/gen/list',
    method: 'get',
    params: data
  })
}
export function delTab(data) {
  return request({
    url: '/tool/gen/delTab',
    method: 'post',
    params: data
  })
}
export function getdbList(data) {
  return request({
    url: '/tool/gen/db/list',
    method: 'get',
    params: data
  })
}
export function importTable(data) {
  return request({
    url: '/tool/gen/importTable',
    method: 'post',
    params: { ...data }
  })
}
export function preview(data) {
  return request({
    url: '/tool/gen/preview',
    method: 'get',
    params: { ...data }
  })
}
export function genCode(data) {
  return request({
    url: '/tool/gen/genCode',
    method: 'get',
    params: { ...data }
  })
}
