<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <treeTools :treeNode="company" :is-root="true" @addDepts="onAddDept"/>
        <el-tree
        :data="departs"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false">
        <template #default="{ node, data }">
          <treeTools :treeNode="data" @delDept="loadDepartments" @addDepts="onAddDept" @editDept="onEditDept"/>
        </template>
      </el-tree>
      </el-card>
    </div>

      <AddDept ref="addOrEditDept" :show-dialog.sync="showDialog" :isEdit='isEdit' :tree-node="node" @addDepts="loadDepartments"></AddDept>


  </div>
</template>

<script>
import treeTools from './components/tree-tools.vue';
import {getDepartments} from '@/api/departments'
import {tranListToTreeData} from '@/utils/index'
import AddDept from './components/add-dept.vue'

export default {
  name: 'Department',
  components: {
    treeTools,
    AddDept
  },
  created(){
      this.loadDepartments()
  },
  data() {
    return {
      departs: [],
      loading :false,
      defaultProps: {
        label: 'name'
      },
      company: { name: 'XXXXX教育科技股份有限公司' },
      showDialog : false, //弹窗
      node : {},//标识为那个部门添加子部门
      isEdit:false,
    }
  },
  methods:{
    async loadDepartments(){
      try{
        this.loading = true
        const ret = await getDepartments();
        // this.departs = ret.depts
        // this.$set(this.company,'name',ret.companyName)
        this.company = { name: ret.companyName, manager: '负责人', id :'' }
        // 这里定义一个空串  因为 它是根 所有的子节点的数据pid 都是 ""
        this.departs = tranListToTreeData(ret.depts, '')
        // console.log(ret);
      }catch(e){
        console.log(e)
      }finally{
        this.loading = false
      }
    },
    // 添加子部门
    onAddDept(node){
      this.showDialog = true
      this.node = node
      this.isEdit = false
      // console.log(node);
    },
    onEditDept(node){
      this.showDialog = true
      this.node = node
      this.isEdit = true
            // console.log(node);
      this.$refs.addOrEditDept.getDeptDetail(node.id)
    },

  }
}
</script>

<style scoped >
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>