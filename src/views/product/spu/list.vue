<template>
  <div>
    <AddSku v-show="isAddSku" />
    <div v-show="!isAddSku">
      <Category :isEditMode="isEditMode" />
      <SpuShowList v-show="isEditMode" :isEditMode="isEditMode" />
      <SpuEditList v-show="!isEditMode" />
    </div>
  </div>
</template>

<script>
import Category from "@/components/category";
import SpuShowList from "./SpuShowList";
import SpuEditList from "./SpuEditList";
import AddSku from "./AddSku";
export default {
  name: "SpuList",
  data() {
    return {
      isEditMode: true,
      isAddSku: false,
    };
  },
  components: {
    Category,
    SpuShowList,
    SpuEditList,
    AddSku,
  },
  methods: {
    //切换edit和show
    changeEditMode() {
      this.isEditMode = !this.isEditMode;
    },
    //切换添加SKU页面
    changeAddSku(){
      console.log("触发了")
      this.isAddSku = !this.isAddSku
    }
  },
  mounted() {
    this.$bus.$on("changeMode", this.changeEditMode);
    this.$bus.$on("addSku", this.changeAddSku);
  },
};
</script>
