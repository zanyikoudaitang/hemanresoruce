<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1, '0')">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="addPermission(2, row.id)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="onDelPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <el-dialog :title="text" :visible.async="showDialog" @close="btnCancel">
      <el-form ref="permForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">

          <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" size="small" @click="btnOk">确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, delPermission, addPermission, getPermissionDetail, updatePermission } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'permission',
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {},
      // 表单校验规则
      rules: {
        name: [
          { required: true, message: '请输入权限名字' }
        ],
        code: [
          { required: true, message: '请输入权限规则' }
        ]
      }

    }
  },
  computed: {
    text() {
      return this.formData.id ? "编辑权限" : "新增权限"
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    addPermission(type, pid) {
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    btnOk() {
      try {
        // console.log(this.$refs.permForm);
        this.$refs.permForm.validate().then(() => {
          if (this.formData.id) {
            return updatePermission(this.formData)
          }
          return addPermission(this.formData)
        }).then(() => {
          this.$message.success((this.formData.id ? '编辑' : '添加') + '权限成功')
          this.getPermissionList()
          this.showDialog = false
        }).catch(e => e)
        // console.log(111);
      } catch (e) {
        console.log(e);
      }
    },
    btnCancel() {
      this.formData = {}
      this.$refs.permForm.resetFields()
      this.showDialog = false
    },
    // editPermission(row){
    //   this.formData.id = row.id
    //   this.formData.type = row.type
    //   this.fromData.pid = row.pid
    //   this.fromData.description
    //   this.showDialog = true
    // },
    async editPermission(id) {
      try {
        this.formData = await getPermissionDetail(id)
        this.showDialog = true
      } catch (e) {
        console.log(e);
      }

    },
    async getPermissionList() {
      try {
        const ret = await getPermissionList()
        this.list = tranListToTreeData(ret, '0')
        console.log(ret);
        console.log(this.list);
      } catch (e) {
        console.log(e);
      }

    },
  //   async onDelPermission(id) {
  //     try {
  //       await this.$confirm('确定删除？')
  //       await delPermission(id)
  //       this.getPermissionList()
  //       this.$message.success('删除成功')
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // },
   onDelPermission(id) {
         this.$confirm('确定删除？').then(()=>{
          return delPermission(id)
         }).then(()=>{
          this.getPermissionList()
          this.$message.success('删除成功')
         }).catch((e)=>{
          console.log(e);
         })
         
        
    }
  },
}
</script>

<style>

</style>