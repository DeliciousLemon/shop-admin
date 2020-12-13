<template>
  <div>
    <Category @change="getAttrValue" />
    <!-- 展示表格 -->
    <el-card style="margin-top: 20px" v-show="isEditMode">
      <el-button
        style="margin-bottom: 20px"
        type="primary"
        @click="addAttr"
        :disabled="!attrValue.length"
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
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-edit"
              @click="edit(scope.row)"
            ></el-button>
            <el-button type="danger" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 编辑表格 -->
    <el-card style="margin-top: 20px" v-show="!isEditMode">
      属性名
      <el-input
        v-model="editName"
        class="attrName"
        placeholder="请输入属性名"
      />
      <el-button
        style="margin: 20px 0; display: block"
        type="primary"
        @click="addAttrValue"
        >+添加属性值</el-button
      >
      <el-table style="width: 100%" border :data="editValue">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-input
              ref="input"
              @blur="editDone(row)"
              v-show="row.isEdit"
              v-model="row.valueName"
            />
            <span v-show="!row.isEdit" @click="editAttrValue(row)">{{
              row.valueName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150"> </el-table-column>
      </el-table>
      <el-button style="margin: 20px" type="primary" @click="save"
        >保存</el-button
      >
      <el-button @click="isEditMode = true">取消</el-button>
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
      editName: "",
      editValue: [],
    };
  },
  components: {
    Category,
  },
  methods: {
    async getAttrValue(category) {
      const attrValue = await this.$API.attr.getAllAttr(category);
      this.attrValue = attrValue.data;
    },
    //编辑属性值
    edit(row) {
      this.isEditMode = false;
      this.editValue = row.attrValueList;
      this.editName = row.attrName;
    },
    addAttr() {
      this.isEditMode = !this.isEditMode;
    },
    //添加属性值
    addAttrValue() {
      console.log(1);
    },
    //点击变为输入框
    editAttrValue(row) {
      this.$set(row, "isEdit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //失去焦点
    editDone(row) {
      row.isEdit = false;
    },
    async save() {
      const data = this.attrValue.find(
        (item) => item.attrName === this.editName
      );
      await this.$API.attr.saveAttr(data);
      this.isEditMode = true
    },
  },
};
</script>
<style lang="sass">
.attrName
  width: 150px
</style>

