<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="100px" :model="sku" ref="form" :rules="rules">
      <el-form-item label="SPU名称">{{ spuName }}</el-form-item>

      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格（元）" prop="skuPrice">
        <el-input-number
          :min="0"
          controls-position="right"
          placeholder="SKU价格"
          v-model="sku.skuPrice"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="重量（千克）" prop="skuWeight">
        <el-input-number
          :min="0"
          controls-position="right"
          placeholder="SKU重量"
          v-model="sku.skuWeight"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="规格描述" prop="skuDescription">
        <el-input
          :rows="4"
          type="textarea"
          placeholder="SKU规格描述"
          v-model="sku.skuDescription"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性" prop="attr">
        <div class="select" v-for="(attr, index) in attrValue" :key="attr.id">
          <span>{{ attr.attrName }}</span>
          <el-select
            placeholder="请选择平台属性"
            v-model="sku.attrList[index]"
            @change="attrChange"
          >
            <el-option
              :value="`${attrValue.id}-${attrValue.attrId}`"
              :label="attrValue.valueName"
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="销售属性" prop="sale">
        <div
          class="select"
          v-for="(sale, index) in spuSaleAttrList"
          :key="sale.id"
        >
          <el-select
            :label="sale.saleAttrName"
            placeholder="请选择销售属性"
            @change="saleChange"
            v-model="sku.saleList[index]"
          >
            <el-option
              :label="saleValue.saleAttrValueName"
              :value="`${saleValue.id}-${sale.id}`"
              v-for="saleValue in sale.spuSaleAttrValueList"
              :key="saleValue.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @select="imgSelect"
          row-key="id"
        >
          <el-table-column width="60" type="selection" reserve-selection>
          </el-table-column>
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
            <template v-slot="{ row }">
              <el-button v-show="!row.isDefault" @click="setDefault(row)"
                >设为默认</el-button
              >
              <el-tag v-show="row.isDefault">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button style="margin: 10px 20px 0 0" type="primary">保存</el-button>
        <el-button @click="$bus.$emit('addSku')">取消</el-button>
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
      spuImageList: [], //所有图片
      skuSaleAttrValue: "", //选择的销售属性
      attrValue: [], //所有的平台属性
      sku: {
        skuName: "",
        skuPrice: 0,
        skuWeight: 0,
        skuDescription: "",
        imageList: [], //选择的图片
        attrList: [], //选择的平台属性
        saleList: [], //选择的销售属性
      },
      rules: {
        skuName: [
          { required: true, message: "请输入SKU名称", trigger: "blur" },
        ],
        skuPrice: [
          { required: true, message: "请输入SKU价格", trigger: "blur" },
        ],
        skuWeight: [
          { required: true, message: "请输入SKU重量", trigger: "blur" },
        ],
        skuDescription: [
          { required: true, message: "请输入SKU描述", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //选择平台属性
    attrChange(value) {
      console.log("平台属性", value);
    },
    //选择销售属性
    saleChange(value) {
      console.log("销售属性", value);
    },
    //选中图片（点击复选框触发）
    imgSelect(selection) {
      this.sku.imageList = {
        ...selection,
      };
    },
    //设置默认
    setDefault(row) {
      const { id } = row;
      //重新读取勾选的选项

      this.spuImageList = this.spuImageList.map((item) => {
        if (id === item.id) {
          return {
            ...item,
            isDefault: true,
          };
        }
        return {
          ...item,
          isDefault: false,
        };
      });
    },
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
