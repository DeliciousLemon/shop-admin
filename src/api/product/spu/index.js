import request from '@/utils/request'

const api_name = '/admin/product'

export default {
  //获取所有SPU
  getAllSpu(page, limit, category3Id) {
    return request({
      method: "GET",
      url: `${api_name}/${page}/${limit}`,
      params: {
        category3Id
      }
    })
  },
}
