<template>
  <div>
    <Category :isEditMode="isEditMode" />
    <!-- 展示表格 -->
    <el-card style="margin-top: 20px" v-show="isEditMode">
      <el-button
        style="margin-bottom: 20px"
        type="primary"
        @click="addAttr"
        :disabled="!category3Id"
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
          <template v-slot="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              @click="edit(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="delAttr(row)"
            ></el-button>
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
        :disabled="!editName"
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
        <el-table-column label="操作" width="150">
          <template v-slot="{ row }">
            <el-button
              @click="delAttrValue(row)"
              icon="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="margin: 20px" type="primary" @click="save"
        >保存</el-button
      >
      <el-button @click="isEditMode = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from "@/components/category";
export default {
  name: "AttrList",
  data() {
    return {
      attrValue: [],
      isEditMode: true,
      category3Id: "",
      editId: "",
      editName: "",
      editValue: [],
    };
  },
  components: {
    Category,
  },
  methods: {
    async getAttrValue(category) {
      this.category3Id = category.category3Id;
      this.attrValue = [];
      //如果没有3id（没有选择第三个下拉框）则不发送请求
      if (!this.category3Id) return;
      const attrValue = await this.$API.attr.getAllAttr(category);
      this.attrValue = attrValue.data;
    },
    //编辑属性值
    edit(row) {
      this.isEditMode = false;
      const { attrValueList, attrName, id } = row;
      this.editValue = JSON.parse(JSON.stringify(attrValueList));
      this.editName = attrName;
      this.editId = id;
    },
    addAttr() {
      this.editName = "";
      this.editValue = [];
      this.editId = "";
      this.isEditMode = !this.isEditMode;
    },
    async delAttr(row) {
      await this.$API.attr.delAttr(row.id);
      this.attrValue = this.attrValue.filter((item) => item.id !== row.id);
    },
    //添加属性值
    addAttrValue() {
      this.editValue.push({ isEdit: true });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
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
    //保存修改
    async save() {
      let data;
      if (this.editId) {
        this.attrValue.map((item) => {
          if (item.id === this.editId) {
            item.attrName = this.editName;
            data = item;
          }
        });
        data.attrValueList = this.editValue;
      } else {
        data = {
          attrName: this.editName,
          attrValueList: this.editValue,
          categoryId: this.attrValue[0].categoryId,
          categoryLevel: 3,
        };
        console.log(data,1111111111111)
        this.attrValue.push(data);
      }
      this.isEditMode = true;

      await this.$API.attr.saveAttr(data);
      this.$forceUpdate();
    },
    delAttrValue(row) {
      this.editValue = this.editValue.filter((item) => item.id !== row.id);
    },
  },
  mounted() {
    this.$bus.$on("change", this.getAttrValue);
  },
  beforeDestroy(){
    this.$bus.$off("change", this.getAttrValue);
  }
};
</script>
<style lang="sass">
.attrName
  width: 150px
</style>

