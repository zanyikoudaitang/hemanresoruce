<template>
  <div class="dashboard-container">
    <div class="app-container">
      <pageTools show-before>
        <span slot="before">共{{ page.total }}条记录</span>
        <template #after>
          <el-button size="small" type="warning" @click="$router.push('/import/employees')">导入</el-button>
          <el-button size="small" type="danger" @click="exportExcel">导出</el-button>
          <el-button size="small" type="primary" @click="addEmployee">新增员工</el-button>
        </template>
      </pageTools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table :data="list" border>
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" sortable="" prop="staffPhoto">
            <template #default="{ row }">
              <img @click="openQrCode(row.staffPhoto)" v-imageError="defaultUserHeaderImg"
                style="width:100px;height:100px;display:block;margin:0 auto;" :src="row.staffPhoto" alt="">
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template #default="{ row }">
              <span>{{ row.timeOfEntry | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template #default="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch v-model="row.enableState" active-color="#13ce66" inactive-color="#ff4949" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template #default="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="onAssignRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination :total="page.total" :current-page="page.page" layout="prev, pager, next"
            @current-change="handleCurrentChange" />
        </el-row>
      </el-card>
    </div>
    <AddEmployee :show-dialog.sync="showDialog" />



    <AssignRole ref='assignRole' :show-role-dialog.sync="showRoleDialog" :user-id="userId"></AssignRole>
    <el-dialog title="二维码" :visible.sync="isShowQrCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import employeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'


import { getEmployeeList, delEmployee } from '@/api/employees'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'

export default {
  data() {
    return {
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0,// 总数
      },
      isShowQrCodeDialog: false,
      showDialog: false,
      defaultUserHeaderImg: require('@/assets/common/bigUserHeader.png'),
      showRoleDialog:false,
      userId:' ',
    }
  },
  components: {
    AddEmployee,
    AssignRole
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async onAssignRole(id){
      this.userId = id
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true

    },
    formatEmployment(row, column, cellValue, index) {
      const item = employeeEnum.hireType.find(it => it.id === cellValue)
      return item ? item.value : '未知'
    },
    handleCurrentChange(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    async getEmployeeList() {
      try {
        this.loading = true
        const { total, rows } = await getEmployeeList(this.page)
        this.page.total = total
        this.list = rows.map(it => {
          return {
            ...it,
            enableState: +it.enableState === 1
          }
        })

      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false
      }
    },
    async deleteEmployee(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.$message.success('删除员工成功')
        this.getEmployeeList()

      } catch (error) {
        console.log(error)
      }
    },
    addEmployee() {
      this.showDialog = true
    },
    exportExcel() {
      //  做操作
      // 表头对应关系 ES规范
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }

      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']

        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工资料表',
          multiHeader,
          merges

        })
      })
    },
    formatJson(headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          // 需要判断 字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = employeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    openQrCode(url) {
      this.isShowQrCodeDialog = true
      this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
    }



  },


}
</script>

<style>

</style>