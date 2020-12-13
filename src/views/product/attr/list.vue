<template>
  <div>
    <Category @change="getAttrValue" />
    <!-- 展示表格 -->
    <el-card style="margin-top: 20px" v-if="isEditMode">
      <el-button style="margin-bottom: 20px" type="primary" @click="addAttr"
        >+添加属性</el-button
      >
      <el-table style="width: 100%" border :data="attrValue">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              type="success"
              v-for="value in row.attrValueList"
              :key="value.id"
              >{{ value.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
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
    </el-card>
    <!-- 编辑表格 -->
    <el-card style="margin-top: 20px" v-else>
      属性名
      <el-input class="attrName" placeholder="请输入属性名" />
      <el-button style="margin: 20px 0;display:block" type="primary" @click="addAttr"
        >+添加属性值</el-button
      >
      <el-table
        style="width: 100%"
        border
        :data="attrValue"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              type="success"
              v-for="value in row.attrValueList"
              :key="value.id"
              >{{ value.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
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
      <el-button style="margin: 20px" type="primary">保存</el-button>
      <el-button>取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from "./category";
export default {
  name: "AttrList",
  data() {
    return {
      attrValue: [],
      isEditMode: true,
    };
  },
  components: {
    Category,
  },
  methods: {
    async getAttrValue(category) {
      const attrValue = await this.$API.attr.getAllAttr(category);
      this.attrValue = attrValue.data;
      console.log(attrValue);
    },
    addAttr() {
      this.isEditMode = !this.isEditMode;
    },
  },
};
</script>
<style lang="sass">
.attrName
  width: 150px
</style>
