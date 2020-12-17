<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="100px">
      <el-form-item label="SPU名称">{{ spuName }}</el-form-item>

      <el-form-item label="SKU名称"
        ><el-input placeholder="SKU名称"></el-input>
      </el-form-item>

      <el-form-item label="价格（元）">
        <el-input placeholder="SKU价格"></el-input>
      </el-form-item>

      <el-form-item label="重量（千克）">
        <el-input placeholder="SKU重量"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input
          :rows="4"
          type="textarea"
          placeholder="SKU规格描述"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <div class="select" v-for="attr in attrValue" :key="attr.id">
          <span>{{ attr.attrName }}</span>
          <el-select placeholder="请选择平台属性" v-model="attr.attrValue">
            <el-option
              :value="attrValue.id"
              :label="attrValue.valueName"
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="销售属性">
        <div class="select" v-for="sale in spuSaleAttrList" :key="sale.id">
          <span>{{ sale.saleAttrName }}</span>
          <el-select
            placeholder="请选择销售属性"
            v-model="sale.skuSaleAttrValue"
          >
            <el-option
              :label="saleValue.saleAttrValueName"
              :value="saleValue.id"
              v-for="saleValue in sale.spuSaleAttrValueList"
              :key="saleValue.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList">
          <el-table-column width="60" type="selection"> </el-table-column>
          <el-table-column label="图片">
            <template v-slot="{ row }">
              <img :src="row.imgUrl" alt="图片" height="100px" />
            </template>
          </el-table-column>
          <el-table-column label="名称">
            <template v-slot="{ row }">
              <span>{{ row.imgName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button>设为默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button style="margin: 10px 20px 0 0" type="primary">保存</el-button>
        <el-button @click="exitEdit">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "AddSku",
  data() {
    return {
      spuName: "", //SPU名称
      spuSaleAttrList: [], //销售属性
      spuImageList: [], //图片
      skuSaleAttrValue: "", //选择的销售属性
      attrValue: [], //平台属性
    };
  },
  methods: {
    async getInfo(data) {
      /*
      data中数据:
      category3Id: 296
      description: "买不起885"
      id: 2342
      spuImageList: null
      spuName: "买不起显卡88"
      spuSaleAttrList: null
      tmId: 6074
      */
      this.spuName = data.spuName;
      //请求销售数据
      const result = await this.$API.spu.getSpuValue(data.id);
      this.spuSaleAttrList = result.data.spuSaleAttrList;
      //请求图片数据
      const imageList = await this.$API.spu.getSpuImage(data.id);
      this.spuImageList = imageList.data;
    },
    //请求平台属性
    async getAttr(category) {
      const attr = await this.$API.attr.getAllAttr(category);
      this.attrValue = attr.data;
    },
  },
  mounted() {
    this.$bus.$on("getInfo", this.getInfo);
    this.$bus.$on("getAttr", this.getAttr);
  },
};
</script>

<style lang="sass" scoped>
.select
  margin-right: 20px
  float: left
</style>
