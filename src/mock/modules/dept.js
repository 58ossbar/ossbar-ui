/* 
 * 机构管理模块
 */

// 保存
export function save() {
  return {
    url: 'dept/save',
    type: 'post',
    data: {
      "code": 200,
      "msg": null,
      "data": 1
    }
  }
}
// 批量删除
export function batchDelete() {
  return {
    url: 'dept/delete',
    type: 'post',
    data: {
      "code": 200,
      "msg": null,
      "data": 1
    }
  }
}
export function findDeptTree(params) {
  // 查询机构树
  let findTreeData = {
    "code": 200,
    "msg": null,
    "data": [{
      "orgId":444,//机构ID
      "orgSN":444,//	机构排序ID
      "orgName":"教育系统44",//机构名称
      "orgCode":"123456",//机构编号
      "orgXZQM":"145214",//行政区码
      "orgShowName":"望城教育系统444",//机构显示名称
      "parentId":1,//父机构ID
      "parentName":"",//父机构名称
      "layer":1,//层（阶次）
      "remark":"望城教育系统望城教育系统望城教育系统444",//单位简介
      "orgType":2,//机构类型:1、部门 2、公司
      "addr":"",//通讯地址
      "zip":"",//邮政编码
      "email":"",//电子邮箱
      "leader":"",//机构负责人
      "phone":"",//办公电话
      "fax":"",//传真号码
      "state":1,//	状态:1有效 2、停用
      "mobile":"",//负责人手机号码
      "JP":"",//简拼
      "QP":"",//全拼
      "ancestry":"",//排序
      "createUserId":"",
      "createTime":"",
      "updateUerId":"",
      "updateTime":"",
      "coverPic":"",//封面图
      "description":"",//机构描述
      "collegeCode":"",//学院代码
      "majorCode":"",//专业代码
      "hasChildren": true,
      "leaf":true
},
      {
        "orgId":555,//机构ID
        "orgSN":11,//	机构排序ID
        "orgName":"教育系统555",//机构名称
        "orgCode":"123456",//机构编号
        "orgXZQM":"145214",//行政区码
        "orgShowName":"望城教育系统555",//机构显示名称
        "parentId":1,//父机构ID
        "parentName":"",//父机构名称
        "layer":1,//层（阶次）
        "remark":"望城教育系统望城教育系统望城教育系统555",//单位简介
        "orgType":2,//机构类型:1、部门 2、公司
        "addr":"",//通讯地址
        "zip":"",//邮政编码
        "email":"",//电子邮箱
        "leader":"",//机构负责人
        "phone":"",//办公电话
        "fax":"",//传真号码
        "state":1,//	状态:1有效 2、停用
        "mobile":"",//负责人手机号码
        "JP":"",//简拼
        "QP":"",//全拼
        "ancestry":"",//排序
        "createUserId":"",
        "createTime":"",
        "updateUerId":"",
        "updateTime":"",
        "coverPic":"",//封面图
        "description":"",//机构描述
        "collegeCode":"",//学院代码
        "majorCode":"",//专业代码
      }
]
  }
  return {
    url: 'dept/findTree',
    type: 'get',
    data: findTreeData
  }
}

export  function findDeptChildrenTree(){
  const  deptTreeChildren={
    "code": 200,
    "msg": null,
    "data":[
      {
        "orgId":11,//机构ID
        "orgSN":11,//	机构排序ID
        "orgName":"教育系统1",//机构名称
        "orgCode":"123456",//机构编号
        "orgXZQM":"145214",//行政区码
        "orgShowName":"望城教育系统1",//机构显示名称
        "parentId":1,//父机构ID
        "parentName":"",//父机构名称
        "layer":1,//层（阶次）
        "remark":"望城教育系统望城教育系统望城教育系统",//单位简介
        "orgType":2,//机构类型:1、部门 2、公司
        "addr":"",//通讯地址
        "zip":"",//邮政编码
        "email":"",//电子邮箱
        "leader":"",//机构负责人
        "phone":"",//办公电话
        "fax":"",//传真号码
        "state":1,//	状态:1有效 2、停用
        "mobile":"",//负责人手机号码
        "JP":"",//简拼
        "QP":"",//全拼
        "ancestry":"",//排序
        "createUserId":"",
        "createTime":"",
        "updateUerId":"",
        "updateTime":"",
        "coverPic":"",//封面图
        "description":"",//机构描述
        "collegeCode":"",//学院代码
        "majorCode":"",//专业代码
      },
      {
        "orgId":21,//机构ID
        "orgSN":21,//	机构排序ID
        "orgName":"教育系统222",//机构名称
        "orgCode":"123456",//机构编号
        "orgXZQM":"145214",//行政区码
        "orgShowName":"望城教育系统22",//机构显示名称
        "parentId":1,//父机构ID
        "parentName":"",//父机构名称
        "layer":1,//层（阶次）
        "remark":"望城教育系统望城教育系统望城教育系统22",//单位简介
        "orgType":2,//机构类型:1、部门 2、公司
        "addr":"",//通讯地址
        "zip":"",//邮政编码
        "email":"",//电子邮箱
        "leader":"",//机构负责人
        "phone":"",//办公电话
        "fax":"",//传真号码
        "state":1,//	状态:1有效 2、停用
        "mobile":"",//负责人手机号码
        "JP":"",//简拼
        "QP":"",//全拼
        "ancestry":"",//排序
        "createUserId":"",
        "createTime":"",
        "updateUerId":"",
        "updateTime":"",
        "coverPic":"",//封面图
        "description":"",//机构描述
        "collegeCode":"",//学院代码
        "majorCode":"",//专业代码
      }
    ]
  }
  return {
    url: 'dept/findDeptChildrenTree',
    type: 'get',
    data: deptTreeChildren
  }
}
