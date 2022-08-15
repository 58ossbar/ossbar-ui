/*
 * 字典管理模块
 */

// 保存
export function save() {
  return {
    url: 'dict/save',
    type: 'post',
    data: {
      'code': 200,
      'msg': null,
      'data': 1
    }
  }
}
// 批量删除
export function batchDelete() {
  return {
    url: 'dict/delete',
    type: 'post',
    data: {
      'code': 200,
      'msg': null,
      'data': 1
    }
  }
}
// 分页查询
export function findPage(params) {
  const findPageData = {
    'code': 200,
    'msg': null,
    'data': {}
  }
  const pageNum = 1
  const pageSize = 8
  if (params !== null) {
    // pageNum = params.pageNum
  }
  if (params !== null) {
    // pageSize = params.pageSize
  }
  const content = this.getContent(pageNum, pageSize)
  findPageData.data.pageNum = pageNum
  findPageData.data.pageSize = pageSize
  findPageData.data.totalSize = 50
  findPageData.data.content = content
  return {
    url: 'dict/findPage',
    type: 'post',
    data: findPageData
  }
}
export function getContent(pageNum, pageSize) {
  const content = []
  for (let i = 0; i < pageSize; i++) {
    const obj = {}
    const index = ((pageNum - 1) * pageSize) + i + 1
    obj.id = index
    obj.value = 'value' + index
    obj.label = 'label' + index
    obj.type = 'type' + index
    obj.description = 'description' + index
    obj.sort = 0
    obj.name = 'dict' + index
    obj.name = 'dict' + index
    obj.name = 'dict' + index
    obj.name = 'dict' + index
    obj.remarks = 'remarks' + index
    if (i % 2 === 0) {

    }
    obj.createBy = 'admin'
    obj.createTime = '2018-08-14 11:11:11'
    obj.createBy = 'admin'
    obj.createTime = '2018-09-14 12:12:12'
    content.push(obj)
  }
  return content
}
