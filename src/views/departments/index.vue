<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <treeTools :treeNode="company" :is-root="true"/>
        

        <el-tree
        :data="departs"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false">
        <template #default="{ node, data }">
          <treeTools :treeNode="data" @delDept="loadDepartments"/>
        </template>
        
      </el-tree>

      </el-card>
    </div>
  </div>
</template>

<script>
import treeTools from './components/tree-tools.vue';
import {getDepartments} from '@/api/departments'
import {tranListToTreeData} from '@/utils/index'
export default {
  name: 'Department',
  components: {
    treeTools
  },
  created(){
      this.loadDepartments()
  },
  data() {
    return {
      departs: [],
      defaultProps: {
        label: 'name'
      },
      company: { name: 'XXXXX教育科技股份有限公司' }
    }
  },
  methods:{
    async loadDepartments(){
      try{
        const ret = await getDepartments();
        // this.departs = ret.depts
        // this.$set(this.company,'name',ret.companyName)
        this.company = { name: ret.companyName, manager: '负责人' }
        // 这里定义一个空串  因为 它是根 所有的子节点的数据pid 都是 ""
        this.departs = tranListToTreeData(ret.depts, '')
        console.log(ret);
      }catch(e){
        console.log(e)

      }
    }
  }
}
</script>

<style scoped >
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>