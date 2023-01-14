<template>
  <div id="app">
    
    <!-- <UploadExcel></UploadExcel> -->
    <!-- <page-tools show-before> 
      <template v-slot:before>
        <span>我想你们</span>
      </template>
      <template #after>
        <el-button type="primary">导入Excel</el-button>
        <el-button type="primary">导入Excel</el-button>
        <el-button type="primary">导入Excel</el-button>
      </template>
    </page-tools> -->

    <router-view />

  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
