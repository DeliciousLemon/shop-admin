<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-button
        style="margin-bottom: 20px"
        type="primary"
        @click="addSPU"
        :disabled="!category3Id"
        >+添加SPU</el-button
      >
      <el-table style="width: 100%" border :data="spuList.records" v-loading="loading">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称" width="150">
        </el-table-column>
        <el-table-column prop="description" label="SPU描述"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="warning"
              icon="el-icon-plus"
              @click="addSku(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-edit"
              @click="edit(row)"
            ></el-button>
            <el-button type="danger" icon="el-icon-info"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="del(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="changeSize"
        @current-change="changePage"
        :current-page="page"
        :page-size="limit"
        :page-count="spuList.pages"
        :page-sizes="[3, 6, 9]"
        layout="prev, pager, next, jumper,sizes,total"
        :total="spuList.length"
        class="pagination"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AttrList",
  data() {
    return {
      page: 1,
      limit: 3,
      spuList: [],
      category3Id: "",
      category:[],
      loading:false
    };
  },
  props: {
    isEditMode: Boolean,
  },
  watch: {
    //监听显示状态，当此组件显示的时候重新获取数据
    isEditMode(value) {
      if (value) {
        const { category3Id } = this;
        this.getSpuList({ category3Id });
      }
    },
  },
  methods: {
    //删除spu
    async del({ id }) {
      const result = await this.$API.spu.delSpu(id);
      if (result.code !== 200) {
        this.$message.error("删除失败");
        return;
      }
      this.$message.success("删除成功");
      this.getSpuList(this.category)
    },
    //进入添加SKU页面
    addSku(row) {
      this.$bus.$emit("addSku");
      this.$bus.$emit("getInfo", row);
    },
    //进入添加模式
    addSPU() {
      this.$bus.$emit("changeMode");
      this.$bus.$emit("getEditValue");
      this.$bus.$emit("spuTrademark", this.category3Id);
    },
    //进入编辑模式
    edit(row) {
      this.$message.info("进入编辑模式")
      this.$bus.$emit("getEditValue", row);
      this.$bus.$emit("changeMode");
      this.$bus.$emit("spuTrademark", row);
    },
    //切换页码
    async changePage(page) {
      const result = await this.$API.spu.getAllSpu(
        page,
        this.limit,
        this.category3Id
      );
      this.spuList = result.data;
    },
    //更改每页条数
    async changeSize(size) {
      const result = await this.$API.spu.getAllSpu(
        this.page,
        size,
        this.category3Id
      );
      this.spuList = result.data;
    },
    //获取spu数据
    async getSpuList(category) {
      this.category = category
      this.spuList = [];
      if (!category.category3Id) return;
      this.category3Id = category.category3Id;
      this.loading = true
      const result = await this.$API.spu.getAllSpu(
        this.page,
        this.limit,
        category.category3Id
      );
      this.loading = false
      this.spuList = result.data;
    },
  },
  mounted() {
    this.$bus.$on("change", this.getSpuList);
  },
  beforeDestroy() {
    this.$bus.$off("change", this.getSpuList);
  },
};
</script>
<style lang="sass">
.attrName
  width: 150px
.pagination
  text-align: right
.el-select--mini
  margin-left: 380px
</style>

