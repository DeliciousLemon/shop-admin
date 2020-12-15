<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form ref="spuForm" :model="spuForm" label-width="80px">
        <el-form-item label="SPU名称">
          <el-input
            placeholder="请输入SPU名称"
            v-model="spuForm.spuName"
          ></el-input>
        </el-form-item>

        <el-form-item label="品牌">
          <el-select
            v-model="spuForm.spuTrademark.tmId"
            placeholder="请选择品牌"
          >
            <el-option
              :label="tm.tmName"
              :value="tm.id"
              v-for="tm in spuForm.trademark"
              :key="tm.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="SPU描述">
          <el-input
            :rows="4"
            type="textarea"
            placeholder="请输入SPU描述"
            v-model="spuForm.description"
          ></el-input>
        </el-form-item>

        <el-form-item label="SPU图片">
          <el-upload
            :action="`${$BASE_API}/admin/product/fileUpload`"
            list-type="picture-card"
            :file-list="spuForm.spuImg"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="销售属性">
          <el-select
            v-model="saleValue"
            placeholder="请选择销售属性"
            :disabled="!filterSaleValue.length"
          >
            <el-option
              :label="sale.name"
              :value="sale.id"
              v-for="sale in filterSaleValue"
              :key="sale.id"
            ></el-option>
          </el-select>
          <el-button style="margin-bottom: 20px" type="primary"
            >+添加销售属性</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-table style="width: 100%" border :data="spuForm.saleSelected">
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column label="属性名" prop="saleAttrName">
            </el-table-column>
            <el-table-column label="属性值名称列表">
              <template v-slot="{ row }">
                <el-tag
                  type="success"
                  v-for="saleAttr in row.spuSaleAttrValueList"
                  :key="saleAttr.id"
                  >{{ saleAttr.saleAttrValueName }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="操作"> </el-table-column>
          </el-table>
          <el-button style="margin: 10px 20px 0 0" type="primary"
            >保存</el-button
          >
          <el-button @click="exitEdit">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuEditList",
  data() {
    return {
      spuForm: {
        saleId: "", //当前编辑属性id
        spuName: "", //属性名
        trademark: [], //所有品牌
        spuTrademark: "", //当前品牌
        description: "", //当前属性描述
        spuImg: [], //当前属性图片
        saleValue: [], //所有销售属性的值
        saleSelected: [], //已有的销售属性
      },
      tmValue: "",
      saleValue: "",
    };
  },
  computed: {
    //过滤销售属性
    filterSaleValue() {
      return this.spuForm.saleValue.filter((item) => {
        return !this.spuForm.saleSelected.find(
          (img) => img.baseSaleAttrId === item.id
        );
      });
    },
    //更改imgList名称,用于发送保存图片的请求
    filterImgList() {
      return this.spuForm.spuImg.map((item) => ({
        imgName: item.name,
        imgUrl: item.url,
      }));
    },
  },
  methods: {
    //图片上传之前
    beforeAvatarUpload(file) {
      //格式白名单
      const styleList = ["image/jpg", "image/png", "image/jpeg"];
      //判断上传的文件格式
      if (!styleList.includes(file.type)) {
        this.$message.error("只能上传jpg、jpeg和png格式的图片");
        return false;
      }
      //判断文件大小
      if (file.size / 1024 > 50) {
        this.$message.error("只能上传小于50KB的图片");
        return false;
      }
      return true;
    },
    //文件上传成功
    handleAvatarSuccess(file, fileList) {
      console.log(file, fileList);
      this.spuForm.spuImg.push({
        name: fileList.name,
        url: file.data,
        uid: fileList.uid
      });
    },
    //接收当前品牌
    getSpuTrademark(row) {
      this.spuForm.spuTrademark = { ...row };
    },
    //删除图片
    handleRemove(value) {
      this.spuForm.spuImg = this.spuForm.spuImg.filter(
        (item) => item.uid !== value.uid
      );
    },
    //进入编辑获取原数据
    editValue({ spuName, description, id }) {
      console.log(spuName, description);
      this.spuForm.spuName = spuName;
      this.spuForm.description = description;
      this.getTrademark();
      this.getImage(id);
      this.getSale();
      this.getSpu(id);
    },
    //获取所有品牌数据
    async getTrademark() {
      const result = await this.$API.trademark.getAllTrademark();
      if (result.code !== 200) {
        this.$message.error("获取品牌数据失败，请稍后重试");
        return;
      }
      this.spuForm.trademark = result.data;
    },
    //获取spu图片
    async getImage(id) {
      const result = await this.$API.spu.getSpuImage(id);
      if (result.code !== 200) {
        this.$message.error("获取图片失败，请稍后重试");
        return;
      }
      this.spuForm.spuImg = result.data.map((item) => {
        return { uid: item.id, name: item.imgName, url: item.imgUrl };
      });
    },
    //获取销售属性
    async getSale() {
      const result = await this.$API.spu.getSpuSale();
      if (result.code !== 200) {
        this.$message.error("获取销售属性失败，请稍后重试");
        return;
      }
      this.spuForm.saleValue = result.data;
    },
    //获取SPU属性
    async getSpu(id) {
      const result = await this.$API.spu.getSpuValue(id);
      if (result.code !== 200) {
        this.$message.error("获取SPU数据失败，请稍后重试");
        return;
      }
      this.spuForm.saleSelected = result.data.spuSaleAttrList;
    },
    //退出edit模式
    exitEdit() {
      this.$bus.$emit("changeMode");
      this.spuForm = {
        saleId: "",
        spuName: "",
        trademark: [],
        spuTrademark: "",
        description: "",
        spuImg: [],
        saleValue: [],
        saleSelected: [],
      };
    },
  },
  mounted() {
    this.$bus.$on("getEditValue", this.editValue);
    this.$bus.$on("spuTrademark", this.getSpuTrademark);
  },
  beforeDestroy() {
    this.$bus.$off("getEditValue", this.editValue);
  },
};
</script>

<style lang="sass" scoped>
.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409eff
.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center
.avatar
  width: 178px
  height: 178px
  display: block
</style>
