<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-button
        style="margin-bottom: 20px"
        type="primary"
        @click="$bus.$emit('changeMode')"
        >+添加SPU</el-button
      >
      <el-table style="width: 100%" border :data="spuList.records">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称" width="150">
        </el-table-column>
        <el-table-column prop="description" label="SPU描述"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button type="warning" icon="el-icon-plus"></el-button>
            <el-button type="danger" icon="el-icon-edit" @click="edit(row)"></el-button>
            <el-button type="danger" icon="el-icon-info"></el-button>
            <el-button type="danger" icon="el-icon-delete"></el-button>
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
    };
  },
  methods: {
    //进入编辑模式
    edit(row){
      this.$bus.$emit("getEditValue",row)
      this.$bus.$emit('changeMode',row)
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
      this.spuList = [];
      if (!category.category3Id) return;
      this.category3Id = category.category3Id;
      const result = await this.$API.spu.getAllSpu(
        this.page,
        this.limit,
        category.category3Id
      );
      this.spuList = result.data;
    },
  },
  mounted() {
    this.$bus.$on("change", this.getSpuList);
  },
  beforeDestroy(){
    this.$bus.$off("change", this.getSpuList);
  }
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

