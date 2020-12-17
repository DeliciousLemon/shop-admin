<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="100px">
      <el-form-item label="SPU名称"></el-form-item>

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
        <el-input :rows="4" type="textarea" placeholder="SKU规格描述"></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <div class="select">
          <span>选择一</span>
          <el-select placeholder="请选择平台属性">
            <el-option label="一"></el-option>
            <el-option label="二"></el-option>
          </el-select>
        </div>

        <div class="select">
          <span>选择二</span>
          <el-select placeholder="请选择平台属性">
            <el-option label="一"></el-option>
            <el-option label="二"></el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="销售属性">
        <div class="select">
          <span>选择一</span>
          <el-select placeholder="请选择销售属性">
            <el-option label="一"></el-option>
            <el-option label="二"></el-option>
          </el-select>
        </div>

        <div class="select">
          <span>选择二</span>
          <el-select placeholder="请选择销售属性">
            <el-option label="一"></el-option>
            <el-option label="二"></el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-table style="width: 100%" border>
          <el-table-column width="60"></el-table-column>
          <el-table-column label="图片"></el-table-column>
          <el-table-column label="名称"></el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button>设为默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button style="margin: 10px 20px 0 0" type="primary" @click="save"
          >保存</el-button
        >
        <el-button @click="exitEdit">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "AddSku",
  methods:{
    getInfo(data){
      console.log(data,"获取到的数据")
    }
  },
  mounted(){
    this.$bus.$on("getInfo",this.getInfo)
  }
};
</script>

<style lang="sass" scoped>
.select
  margin-right: 20px
  float: left
</style>
