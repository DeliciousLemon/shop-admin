<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="100px" :model="sku" ref="skuForm" :rules="rules">
      <el-form-item label="SPU名称">{{ spuName }}</el-form-item>

      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格（元）" prop="skuPrice">
        <el-input-number
          :min="0"
          :max="999999"
          controls-position="right"
          placeholder="SKU价格"
          v-model="sku.skuPrice"
          @change="$refs.skuForm.clearValidate('skuPrice')"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="重量（千克）" prop="skuWeight">
        <el-input-number
          :min="0"
          :max="9999"
          controls-position="right"
          placeholder="SKU重量"
          v-model="sku.skuWeight"
          @change="$refs.skuForm.clearValidate('skuWeight')"
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
          <span>{{ sale.saleAttrName }}</span>
          <el-select
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

      <el-form-item label="图片列表" prop="image">
        <el-table
          ref="table"
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
        <el-button style="margin: 10px 20px 0 0" type="primary" @click="save"
          >保存</el-button
        >
        <el-button @click="exitAddSku">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "AddSku",
  data() {
    return {
      tmId: "",
      spuId: "",
      category3Id: "",
      spuName: "", //SPU名称
      spuSaleAttrList: [], //所有的销售属性
      spuImageList: [], //所有图片
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
        attr: [{ required: true, validator: this.attrValidate }],
        sale: [{ required: true, validator: this.saleValidate }],
        image: [{ required: true, validator: this.imageValidate }],
      },
    };
  },
  methods: {
    //保存
    save() {
      this.$refs.skuForm.validate(async (valid) => {
        if (valid) {
          this.$message.success("校验通过");
          //处理平台属性
          const skuAttrValueList = this.sku.attrList.map((item) => {
            return {
              attrId: +item.split("-")[0],
              valueId: +item.split("-")[1],
            };
          });
          //处理销售属性
          const skuSaleAttrValueList = this.sku.saleList.map((item) => {
            return {
              saleAttrValueId: +item.split("-")[1],
              skuId: +item.split("-")[0],
            };
          });
          //处理图片

          const skuImageList = this.sku.imageList.map((item) => {
            /*
            遍历每个图片，将图片在spuImageList中isDefault的状态返回，
            其他图片返回false（目的：获取spuImageList中的默认图片给skuImageList中对应的图片设置）
            */
            item.isDefault = this.spuImageList.some((img) => {
              if (img.id === item.id) {
                return img.isDefault;
              }
              return false;
            });
            return {
              imgName: item.imgName,
              imgUrl: item.imgUrl,
              isDefault: item.isDefault,
              spuImgId: +item.spuId,
              skuId: +item.id,
            };
          });
          //默认图片路径
          const skuDefaultImg = this.spuImageList.find((item) => item.isDefault)
            .imgUrl;
          const data = {
            tmId: +this.tmId,
            spuId: +this.spuId,
            skuDesc: this.sku.skuDescription,
            category3Id: this.category3Id,
            price: +this.sku.skuPrice,
            skuName: this.sku.skuName,
            weight: +this.sku.skuWeight,
            skuAttrValueList,
            skuSaleAttrValueList,
            skuImageList,
            skuDefaultImg,
          };
          const result = await this.$API.spu.addSku(data);
          if (result.code === 200) {
            this.$message.success("保存成功");
            this.$bus.$emit("addSku");
            this.clear();
          } else {
            this.$message.error("保存失败");
          }
        }
      });
    },
    //图片校验
    imageValidate(rule, value, callback) {
      if (this.sku.imageList.length === 0) {
        callback(new Error("请至少选择一张图片"));
      }
      if (!this.spuImageList.some((item) => item.isDefault)) {
        callback(new Error("请设置默认图片"));
      }
      callback();
    },
    //销售属性校验
    saleValidate(rule, value, callback) {
      if (this.sku.saleList.length < this.spuSaleAttrList.length) {
        callback(new Error("请选择销售属性"));
      }
      callback();
    },
    //平台属性校验
    attrValidate(rule, value, callback) {
      if (this.sku.attrList.length < this.attrValue.length) {
        callback(new Error("请选择平台属性"));
      }
      callback();
    },
    //选择平台属性
    attrChange(value) {
      //清空校验结果
      this.$refs.skuForm.clearValidate("attr");
    },
    //选择销售属性
    saleChange(value) {
      //清空校验结果
      this.$refs.skuForm.clearValidate("sale");
    },
    //选中图片（点击复选框触发）
    imgSelect(selection, row) {
      const { id } = row;
      this.sku.imageList = [...selection];
      //将当前点击的图片的isDefault设置为false
      this.spuImageList = this.spuImageList.map((item) => {
        if (item.id === id) {
          item.isDefault = false;
        }
        return item;
      });
    },
    //设置默认
    setDefault(row) {
      const { id } = row;
      this.spuImageList = this.spuImageList.map((item) => {
        //判断是否选中
        if (
          !!this.sku.imageList.find((img) => img.id === item.id) &&
          id === item.id
        ) {
          this.$refs.skuForm.clearValidate("image");
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
    //获取数据
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
      //清空上次保存的图片选择
      console.log(this.$refs);
      this.$refs.table.clearSelection();
      this.tmId = data.tmId;
      this.spuId = data.id;
      this.category3Id = data.category3Id;
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
    //退出添加SKU
    exitAddSku() {
      this.$bus.$emit("addSku");
      this.clear();
    },
    //清空数据
    clear() {
      this.sku = {
        skuName: "",
        skuPrice: 0,
        skuWeight: 0,
        skuDescription: "",
        imageList: [], //选择的图片
        attrList: [], //选择的平台属性
        saleList: [], //选择的销售属性
      };
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
