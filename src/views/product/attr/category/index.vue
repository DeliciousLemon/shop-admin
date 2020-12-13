<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="category">
        <el-form-item label="一级分类">
          <el-select
            @change="getAttrList2"
            v-model="category.category1Id"
            placeholder="请选择"
          >
            <el-option
              v-for="attr1 in attrs1"
              :label="attr1.name"
              :value="attr1.id"
              :key="attr1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            @change="getAttrList3"
            v-model="category.category2Id"
            placeholder="请选择"
          >
            <el-option
              :label="attr2.name"
              :value="attr2.id"
              v-for="attr2 in attrs2"
              :key="attr2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select @change="getAttrValue" v-model="category.category3Id" placeholder="请选择">
            <el-option
              :label="attr3.name"
              :value="attr3.id"
              v-for="attr3 in attrs3"
              :key="attr3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "category",
  data() {
    return {
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      attrs1: [],
      attrs2: [],
      attrs3: [],
    };
  },
  methods: {
    //获取数据选项2
    async getAttrList2(id) {
      const attrs = await this.$API.attr.getAttrList2(id);
      this.category.category1Id = id
      this.attrs2 = attrs.data;
    },
    //获取数据选项3
    async getAttrList3(id) {
      const attrs = await this.$API.attr.getAttrList3(id);
      this.category.category2Id = id
      this.attrs3 = attrs.data;
    },
    //保存id3
    getAttrValue(id3){
      this.category.category3Id = id3
      this.$emit("change",this.category)
    }
  },
  async mounted() {
    const attrs = await this.$API.attr.getAttrList1();
    this.attrs1 = attrs.data;
  },
};
</script>

<style lang="less" scoped>
</style>
