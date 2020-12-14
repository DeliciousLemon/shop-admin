<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form ref="SpuForm" :model="SpuForm" label-width="80px">
        <el-form-item label="SPU名称">
          <el-input
            placeholder="请输入SPU名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select placeholder="请选择">
            <el-option label="华为"></el-option>
            <el-option label="小米"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
          <el-input
            :rows="4"
            type="textarea"
            placeholder="请输入SPU描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="销售属性">
          <el-select placeholder="还有3项未选择">
            <el-option label="内存"></el-option>
            <el-option label="颜色"></el-option>
          </el-select>
          <el-button style="margin-bottom: 20px" type="primary"
            >+添加销售属性</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-table style="width: 100%" border>
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column label="属性名"> </el-table-column>
            <el-table-column label="属性值名称列表"> </el-table-column>
            <el-table-column label="操作"> </el-table-column>
          </el-table>
          <el-button style="margin: 10px 20px 0 0" type="primary"
            >保存</el-button
          >
          <el-button @click="$bus.$emit('changeMode')">取消</el-button>
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
      SpuForm: {
        SpuName: "",
      },
    };
  },
};
</script>

<style lang="less" scoped>
</style>
