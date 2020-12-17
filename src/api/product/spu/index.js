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
  //获取spu图片
  getSpuImage(spuId) {
    return request({
      method: "GET",
      url: `${api_name}/spuImageList/${spuId}`
    })
  },
  //获取销售属性
  getSpuSale() {
    return request({
      method: "GET",
      url: `${api_name}/baseSaleAttrList`
    })
  },
  //获取spu属性
  getSpuValue(spuId) {
    return request({
      method: "GET",
      url: `${api_name}/getSpuById/${spuId}`
    })
  },
  //更新
  update(info) {
    return request({
      method: "POST",
      url: `${api_name}/updateSpuInfo`,
      data:info
    })
  },
  //添加
  add(info) {
    return request({
      method: "POST",
      url: `${api_name}/saveSpuInfo`,
      data:info
    })
  },

}
