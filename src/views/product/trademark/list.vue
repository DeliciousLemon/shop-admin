<template>
  <div>
    <el-button style="margin-bottom: 20px" type="primary" @click="addTrademark"
      >+添加品牌</el-button
    >
    <el-table :data="trademarkList" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="180">
      </el-table-column>
      <el-table-column label="品牌图标" width="300">
        <template slot-scope="scope">
          <img class="trademark-logo" :src="scope.row.logoUrl" alt="logo" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            icon="el-icon-edit"
            @click="editTrademark(scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="delTrademark(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-size="size"
      :page-count="page"
      :page-sizes="[3, 6, 9]"
      layout="prev, pager, next, jumper,sizes,total"
      :total="total"
      class="pagination"
    >
    </el-pagination>
    <!-- 添加品牌弹窗 -->
    <el-dialog
      :title="viewName"
      :visible.sync="addView"
      width="50%"
      :before-close="handleClose"
    >
      <!-- form表单 -->
      <el-form
        ref="trademarkForm"
        :model="trademarkForm"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input
            v-model="trademarkForm.tmName"
            placeholder="请输入品牌名称"
          ></el-input>
        </el-form-item>
        <!-- 上传框 -->
        <el-form-item label="品牌logo" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <span>只能上传jpg、jpeg和png格式的图片，并且大小不能超过50KB</span>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addView = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      trademarkList: [],
      page: 1,
      size: 3,
      total: 10,
      addView: false,
      trademarkForm: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 3,
            max: 5,
            message: "品牌名称长度必须在3到5个字符串之间",
            trigger: "blur",
          },
        ],
        logoUrl: [{ required: true, message: "请上传品牌LOGO" }],
      },
      viewName: "",
      trademarkID: 0,
    };
  },
  watch: {
    //清空校验结果
    addView() {
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
    },
  },
  methods: {
    //每页数量改变
    handleSizeChange(size) {
      this.size = size;
      this.gettrademark(this.page, size);
    },
    //当前页改变
    handleCurrentChange(page) {
      this.page = page;
      this.gettrademark(page, this.size);
    },
    //获取品牌信息
    async gettrademark(page, size) {
      const trademarkList = await this.$API.product.getPageList(page, size);
      if (trademarkList.code === 200) {
        this.trademarkList = trademarkList.data.records;
        this.size = trademarkList.data.size;
        this.pages = trademarkList.data.pages;
        this.total = trademarkList.data.total;
      }
    },
    //添加品牌
    addTrademark() {
      if (this.trademarkForm.tmName || this.trademarkForm.logoUrl) {
        this.trademarkForm.tmName = "";
        this.trademarkForm.logoUrl = "";
      }
      this.viewName = "添加品牌";
      this.addView = true;
    },
    //确定添加品牌
    submitForm(form) {
      //检测表单检测是否通过
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          this.addView = false;
          if (this.viewName === "修改品牌") {
            const id = this.trademarkID;
            const banner = { ...this.$refs[form].model, id };
            await this.$API.product.updatePageList(banner);
            this.$message("修改成功");
            this.gettrademark(this.page, this.size);
            return;
          }
          await this.$API.product.addPageList(this.$refs[form].model);
          this.$message("添加成功");
          this.gettrademark(this.page, this.size);
        } else {
          this.$message.warning("数据格式有误，请检查后提交");
        }
      });
    },
    //关闭添加窗口
    handleClose() {
      this.addView = false;
    },
    //文件上传成功
    handleAvatarSuccess(file, fileList) {
      this.trademarkForm.logoUrl = file.data;
    },
    //文件上传之前
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
    //修改品牌信息
    editTrademark(data) {
      this.addView = true;
      this.viewName = "修改品牌";
      this.trademarkForm.tmName = data.tmName;
      this.trademarkForm.logoUrl = data.logoUrl;
      this.trademarkID = data.id;
    },
    //删除品牌
    async delTrademark(data) {
      await this.$API.product.delPageList(data.id);
      this.gettrademark(this.page, this.size);
      this.$message("删除成功");
    },
  },
  mounted() {
    this.gettrademark(this.page, this.size);
  },
};
</script>
<style lang="sass">
.trademark-logo
  width: 150px

.pagination
  margin: 20px 0
  text-align: right

.el-select
  margin-left: 500px

.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409EFF

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
