<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form ref="spuForm" :rules="rules" :model="spuTrademark" label-width="80px">
        <el-form-item prop="spuName" label="SPU名称">
          <el-input placeholder="请输入SPU名称" v-model="spuTrademark.spuName"></el-input>
        </el-form-item>

        <el-form-item prop="tmId" label="品牌">
          <el-select v-model="spuTrademark.tmId" placeholder="请选择品牌">
            <el-option
              :label="tm.tmName"
              :value="tm.id"
              v-for="tm in spuForm.trademark"
              :key="tm.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="description" label="SPU描述">
          <el-input
            :rows="4"
            type="textarea"
            placeholder="请输入SPU描述"
            v-model="spuTrademark.description"
          ></el-input>
        </el-form-item>

        <el-form-item prop="spuImageList" label="SPU图片">
          <el-upload
            :action="`${$BASE_API}/admin/product/fileUpload`"
            list-type="picture-card"
            :file-list="spuTrademark.spuImageList || []"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="销售属性" prop="saleAttrList">
          <el-select v-model="saleValue" placeholder="请选择销售属性" :disabled="!filterSaleValue.length">
            <el-option
              :label="sale.name"
              :value="`${sale.id}-${sale.name}`"
              v-for="sale in filterSaleValue"
              :key="sale.id"
            ></el-option>
          </el-select>
          <el-button
            style="margin-bottom: 20px"
            type="primary"
            @click="addSaleAttr"
            :disabled="!saleValue"
          >+添加销售属性</el-button>

          <el-table style="width: 100%" border :data="spuTrademark.spuSaleAttrList">
            <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>

            <el-table-column label="属性名" prop="saleAttrName"></el-table-column>

            <el-table-column label="属性值名称列表">
              <template v-slot="{ row }">
                <el-tag
                  @close="delSaleAttrValue(row, index)"
                  closable
                  type="success"
                  v-for="(saleAttr, index) in row.spuSaleAttrValueList"
                  :key="saleAttr.id"
                >{{ saleAttr.saleAttrValueName }}</el-tag>
                <el-input
                  @blur="loseFocus(row)"
                  @keydown.enter.native="loseFocus(row)"
                  ref="input"
                  v-show="row.edit"
                  v-model="saleAttrValue"
                />
                <el-button
                  v-show="!row.edit"
                  icon="el-icon-plus"
                  @click="addSaleAttrValue(row)"
                  size="mini"
                >添加销售属性值</el-button>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template v-slot="{ row,$index }">
                <el-button type="danger" icon="el-icon-delete" @click="delSaleAttr(row,$index)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item>
          <el-button style="margin: 10px 20px 0 0" type="primary" @click="save">保存</el-button>
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
        trademark: [], //所有品牌
        saleValue: [], //所有销售属性的值
      },
      spuTrademark: {}, //当前品牌的信息
      saleAttrValue: "", //输入的销售属性值
      saleValue: "", //销售属性选择的内容
      rules: {
        spuName: [
          { required: true, message: "SPU名称不能为空", trigger: "blur" },
        ],
        tmId: [{ required: true, message: "必须选择一个品牌" }],
        description: [
          { required: true, message: "SPU描述不能为空", trigger: "blur" },
        ],
        spuImageList: [{ required: true, validator: this.imgListValidator }],
        saleAttrList: [{ required: true, validator: this.saleAttrValidator }],
      },
    };
  },
  computed: {
    //过滤销售属性
    filterSaleValue() {
      return this.spuForm.saleValue.filter((item) => {
        return !this.spuTrademark.spuSaleAttrList.find((sale) => {
          return sale.baseSaleAttrId === item.id;
        });
      });
    },
    //更改imgList名称,用于发送保存图片的请求
    filterImgList() {
      return this.spuTrademark.spuImageList.map((item) => ({
        ...item,
        imgName: item.name,
        imgUrl: item.url,
        uid: item.uid,
      }));
    },
  },
  methods: {
    //保存
    save() {
      this.$refs.spuForm.validate(async (valid) => {
        if (valid) {
          const editInfo = {
            ...this.spuTrademark,
            spuImageList: this.filterImgList,
            spuSaleAttrList: this.spuTrademark.spuSaleAttrList,
          };
          await this.$API.spu.save(editInfo);
          this.$bus.$emit("changeMode");
        }
      });
    },
    //上传图片验证
    imgListValidator(rule, value, callback) {
      if (this.spuTrademark.spuImageList.length > 0) {
        callback();
        return;
      }
      callback(new Error("必须上传至少一张图片"));
    },
    //销售属性验证
    saleAttrValidator(rule, value, callback) {
      if (!this.spuTrademark.spuSaleAttrList.length > 0) {
        callback(new Error("至少选择一个销售属性"));
        return;
      }
      const isHasSale = this.spuTrademark.spuSaleAttrList.some((item) => {
        return item.spuSaleAttrValueList.length === 0;
      });
      if (isHasSale) {
        callback(new Error("至少设置一个销售属性值"));
        return;
      }
      callback();
    },
    //删除销售属性值
    delSaleAttrValue(row, index) {
      this.spuTrademark.spuSaleAttrList.some((item) => {
        if (item.id === row.id) {
          item.spuSaleAttrValueList.splice(index, 1);
        }
      });
    },
    //添加销售属性值失去焦点
    loseFocus(row) {
      const { saleAttrName, baseSaleAttrId } = row;
      //将输入框变回按钮
      row.edit = false;
      //没有输入内容直接结束
      if (!this.saleAttrValue) return;
      //给已选数据添加
      this.spuTrademark.spuSaleAttrList.some((item) => {
        if (item.baseSaleAttrId === baseSaleAttrId) {
          item.spuSaleAttrValueList.push({
            saleAttrValueName: this.saleAttrValue,
            spuId: this.spuTrademark.id,
            baseSaleAttrId: item.baseSaleAttrId,
            isChecked: "",
          });
          return true;
        }
      });
      //清空输入内容
      this.saleAttrValue = "";
    },
    //添加销售属性值
    addSaleAttrValue(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //删除销售属性
    delSaleAttr(row, $index) {
      const { baseSaleAttrId, saleAttrName } = row;
      console.log(row);
      //在已选数据中删除对应数据
      this.spuTrademark.spuSaleAttrList.splice($index, 1);
      //在未选数据中加入对应数据
      this.spuForm.saleValue.push({
        id: baseSaleAttrId,
        name: saleAttrName,
      });
    },
    //添加销售属性
    addSaleAttr() {
      // this.saleValue就是id-name,截取id和name
      const [id, name] = this.saleValue.split("-");
      //在下面的表格数据中插入新数据
      this.spuTrademark.spuSaleAttrList.push({
        baseSaleAttrId: id,
        spuId: this.spuTrademark.id,
        saleAttrName: name,
        spuSaleAttrValueList: [],
      });
      //在原数据中删除此数据
      this.spuForm.saleValue = this.filterSaleValue.filter((item) => {
        return item.id !== +id;
      });
      //清空select中的数据
      this.saleValue = "";
    },
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
      this.spuTrademark.spuImageList.push({
        name: fileList.name,
        url: file.data,
        uid: fileList.uid,
      });
    },
    //接收当前编辑项数据
    getSpuTrademark(row) {
      this.spuTrademark = {
        ...row,
        spuImageList: [],
        spuSaleAttrList: [],
      };
    },
    //删除图片
    handleRemove(value) {
      this.spuTrademark.spuImageList = this.spuTrademark.spuImageList.filter(
        (item) => item.uid !== value.uid
      );
    },
    //进入编辑获取原数据
    editValue({ spuName, description, id }) {
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
      this.spuTrademark.spuImageList = result.data.map((item) => {
        return { uid: item.id, name: item.imgName, url: item.imgUrl };
      });
    },
    //获取所有销售属性
    async getSale() {
      const result = await this.$API.spu.getSpuSale();
      if (result.code !== 200) {
        this.$message.error("获取销售属性失败，请稍后重试");
        return;
      }
      this.spuForm.saleValue = result.data;
    },
    //获取SPU的销售属性
    async getSpu(id) {
      const result = await this.$API.spu.getSpuValue(id);
      if (result.code !== 200) {
        this.$message.error("获取SPU数据失败，请稍后重试");
        return;
      }
      this.spuTrademark.spuSaleAttrList = result.data.spuSaleAttrList || [];
    },
    //退出edit模式
    exitEdit() {
      this.$bus.$emit("changeMode");
      this.spuForm = {
        saleId: "", //当前编辑属性id
        trademark: [], //所有品牌
        saleValue: [], //所有销售属性的值
      };
    },
  },
  mounted() {
    this.$bus.$on("getEditValue", this.editValue);
    this.$bus.$on("spuTrademark", this.getSpuTrademark);
  },
  beforeDestroy() {
    this.$bus.$off("getEditValue", this.editValue);
    this.$bus.$off("spuTrademark", this.getSpuTrademark);
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
