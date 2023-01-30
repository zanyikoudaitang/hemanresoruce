<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button icon="el-icon-plus" size="small" type="primary" @click="showDialog = true">新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column label="序号" width="120" type="index" />
              <el-table-column label="角色名称" prop="name" width="240" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template #default="{ row }">
                  <el-button size="small" type="success" @click="assignPermission(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRole(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :total="page.total"
                :current-page="page.page" :page-sizes="[5, 10, 20, 30, 40]" :page-size="page.pagesize"
                layout="total,sizes,prev,pager,next" />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" type="info" show-icon :closable="false" />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>

    <!-- 编辑角色弹窗 -->
    <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 分配权限弹窗 -->
    <el-dialog title="分配权限弹层" :visible="showPermDialog" @close="btnCancel1">
      <div style="height:400px;overflow:auto">
        <el-tree
        ref="permTree"
        :data="data"
        show-checkbox
        default-expand-all
        check-strictly
        node-key="id"
        :default-checked-keys="checked"
        :props="defaultProps">
      </el-tree>
      </div>
      <template #footer>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" size="small" @click="confirmAssignPerm">确定</el-button>
            <el-button size="small" @click="btnCancel1">取消</el-button>
          </el-col>
        </el-row>
      </template>
    </el-dialog>


  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, delRoleById, getRoleInfoById, updateRoleInfoById, addRole, assignPerm } from '@/api/setting'
import { mapGetters } from 'vuex'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'SettingIndex',
  data() {
    return {
      list: [],
      page: {
        // 放置页码及相关数据
        page: 1, // 也有团队第1页的页码是0
        pagesize: 5,
        total: 0 // 记录总数
      },
      formData: {},
      showDialog: false,
      roleForm: {},
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      showPermDialog:false,
      roleId:'',
      data:[],
      defaultProps: {
          children: 'children',
          label: 'name'
        },
      checked:[]

    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getCompanyInfo() {
      try {
        const ret = await getCompanyInfo(this.companyId)
        this.formData = ret
        // console.log(ret);
      } catch (e) {
        console.log(e);
      }
    },
    async getRoleList() {
      try {
        const ret = await getRoleList({ ...this.page })
        this.list = ret.rows
        this.page.total = ret.total
        // console.log(ret);
      } catch (e) {
        console.log(e)
      }
    },
    handleCurrentChange(page) {
      this.page.page = page
      this.getRoleList()
    },
    handleSizeChange(size) {
      this.page.pagesize = size
      this.getRoleList()

    },
    async delRole(row) {
      const ret = await this.$confirm('确定删除吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(e => e)
      if (ret === 'cancel') {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        return
      }
      try {
        await delRoleById(row.id)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        // TODO5.更新

        // FIXME
        if((this.page.total - 1) % this.page.pageSize === 0){
          this.page.page = this.page.page - 1
        }
        this.getRoleList()
      } catch (error) {
        this.$message({
          type: 'info',
          message: '删除失败'
        })
        console.log(error);
      }

      // console.log(row);
    },
    async editRole(id){
      await this.getRoleInfoByid(id)
      this.showDialog = true
    },
    async getPermission(id){
      try {
        const ret = await getRoleInfoById(id)
        this.checked = ret.permIds
      } catch (e) {
        console.log(e);
      }
    },
    async getRoleInfoByid(id){
      try {
        const ret = await getRoleInfoById(id)
        this.roleForm = ret
      } catch (e) {
        console.log(e);
      }
    },
    btnCancel(){
      this.showDialog = false
      this.$refs.roleForm.resetFields()
      this.roleForm = {}
    },
    btnCancel1(){
      this.showPermDialog = false
    },
    async confirmAssignPerm(){
      try {
        const ret = await assignPerm({id:this.roleId,permIds:this.$refs.permTree.getCheckedKeys()})
        this.$message.success('分配成功')
        this.showPermDialog = false
      } catch (e) {
        this.$message.error('分配失败')
      }
    },
    async btnOK(){
      try {
        await this.$refs.roleForm.validate()
        if(this.roleForm.id){
          await updateRoleInfoById({
            ...this.roleForm,
            companyId:this.companyId
          })
        }else{
          await addRole({
            // name:this.roleForm.name,
            // region:this.roleForm.description
            ...this.roleForm
          })
        }
        
        this.$message({
          type:'success',
          message: this.roleForm.id ? '编辑成功' : '添加成功'
        })
        this.getRoleList()
        this.showDialog = false
      } catch (e) {
        console.log(e);
      }
    },
    async assignPermission(id){
      this.roleId = id;
      await this.getPermissionList()
      await this.getPermission(id)
      this.showPermDialog = true
    },
    async getPermissionList(){
      try {
        const ret = await getPermissionList()
        console.log(ret)
        this.data = tranListToTreeData(ret,'0')
      } catch (e) {
        console.log(e);
      }
    }
  }
}
</script>

<style>
  
</style>