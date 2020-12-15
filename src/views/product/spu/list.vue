<template>
  <div>
    <Category :isEditMode="isEditMode" />
    <SpuShowList v-show="isEditMode"/>
    <SpuEditList v-show="!isEditMode" />
  </div>
</template>

<script>
import Category from "@/components/category";
import SpuShowList from "./SpuShowList"
import SpuEditList from "./SpuEditList"
export default {
  name: "SpuList",
  data() {
    return {
      isEditMode:true,
    };
  },
  components: {
    Category,
    SpuShowList,
    SpuEditList
  },
  methods:{
    //切换edit和show
    changeEditMode(row){
      console.log(row)
      this.isEditMode = !this.isEditMode
    }
  },
  mounted(){
    this.$bus.$on("changeMode",this.changeEditMode)
  }
};
</script>
