
import { baseUrl } from '@/utils/global'

/**
 * 将原生数据转换为树形数据
 * @param {*} arr 具有父子关系的扁平数据
 * @param {*} idKey 选传参数，默认为id
 * @param {*} parentIdKey 选传参数，默认parentId，你的可能是pId或者其它的
 * @returns []
 */
export function convertTreeData(arr, idKey = 'id', parentIdKey = 'parentId') {
  //  删除所有 children,以防止多次调用
  arr.forEach(function(item) {
    delete item.children
  })
  const map = {} // 构建map
  arr.forEach(i => {
    map[i[idKey]] = i // 构建以id为键 当前数据为值
  })
  const treeData = []
  arr.forEach((child, index) => {
    const mapItem = map[child[parentIdKey]] // 判断当前数据的parentId是否存在map中
    if (mapItem) { // 存在则表示当前数据不是最顶层数据
      // 注意: 这里的map中的数据是引用了arr的它的指向还是arr，当mapItem改变时arr也会改变,踩坑点
      (mapItem.children || (mapItem.children = [])).push(child) // 这里判断mapItem中是否存在children, 存在则插入当前数据, 不存在则赋值children为[]然后再插入当前数据
    } else { // 不存在则是组顶层数据
      treeData.push(child)
    }
  })
  return treeData
}

/**
 * 处理图片地址
 * @param {*} str
 * @param {*} needDefaultHead 布尔值，为true返回默认头像
 * @returns 示例结果：
 * http://thirdqq.qlogo.cn/g?b=oidb&k=Rhqd4feUicVicFSp07uO637g&s=40&t=1557039707
 * https://frp.creatorblue.com/console/uploads/teacher-img/67fcfbaea3d4476187e2e4279cea5e24.jpeg
 */
export function handleImagePath(str, needDefaultHead = false) {
  if (!str) {
    // 如果没有图片，需要返回图片的话
    if (needDefaultHead) {
      str = require('@/assets/user.png')
    }
    return str
  }
  // 如果是网络头像，不需要额外拼接
  if (str.indexOf('https') !== -1 || str.indexOf('http') !== -1) {
    return str
  }
  // 去掉中间多余的斜杠
  if (baseUrl) {
    // 如果最后一位有斜杠
    const v = baseUrl.substring(baseUrl.length - 1, baseUrl.length)
    if (v && v === '/') {
      // 如果传入的值，第一个也是斜杠
      const s = str.substring(0, 1)
      if (s && s === '/') {
        str = str.substring(1)
      }
    }
  }
  return baseUrl + str
}
