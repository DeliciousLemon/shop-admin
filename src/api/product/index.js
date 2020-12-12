import request from '@/utils/request'

const api_name = '/admin/product/baseTrademark'

export default {
  /*
  获取品牌分页列表
  */
  getPageList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'GET'
    })
  },
  /*
  新增品牌
  */
  addPageList(banner) {
    return request({
      url: `${api_name}/save`,
      method: 'POST',
      data: banner
    })
  },
  /*
  删除品牌
  */
  delPageList(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'DELETE'
    })
  },
  /*
  修改品牌
  */
  updatePageList(banner) {
    return request({
      url: `${api_name}/update`,
      method: 'PUT',
      data: banner
    })
  },
}
