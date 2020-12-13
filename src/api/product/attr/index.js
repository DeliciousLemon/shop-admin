import request from '@/utils/request'

const api_name = '/admin/product'

export default {
  //获取所有属性
  getAllAttr({category1Id, category2Id, category3Id}) {
    return request({
      method: "GET",
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    })
  },
  //删除属性
  delAttr(attrId) {
    return request({
      method: "DELETE",
      url: `${api_name}/deleteAttr/${attrId}`
    })
  },
  //获取属性值列表
  getAttrList(attrId) {
    return request({
      method: "GET",
      url: `${api_name}/getAttrValueList/${attrId}`
    })
  },
  //获取一级属性选项
  getAttrList1() {
    return request({
      method: "GET",
      url: `${api_name}/getCategory1`
    })
  },
  //获取二级属性选项
  getAttrList2(category1Id) {
    return request({
      method: "GET",
      url: `${api_name}/getCategory2/${category1Id}`
    })
  },
  //获取三级属性选项
  getAttrList3(category2Id) {
    return request({
      method: "GET",
      url: `${api_name}/getCategory3/${category2Id}`
    })
  },
  //保存属性
  saveAttr(baseAttrInfo) {
    return request({
      method: "POST",
      url: `${api_name}/saveAttrInfo`,
      data: baseAttrInfo
    })
  },
}
