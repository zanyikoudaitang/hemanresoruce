<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="title" :visible="showDialog" @close="cancel">
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" >
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartmentInfo, updateDepartmentInfo } from '@/api/departments'
import { getEmployeeSample } from '@/api/employees'
export default {
  name: 'AddDept',
  props: {
    treeNode: {
      type: Object,
      default: true
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    isEdit:{
      type: Boolean,
      default: false
    }
  },
  data() {
    const that = this
    async function validateDeptName(rule, value, callback) {
      const { depts } = await getDepartments()
      let children = []
      if(that.formData.id){
        children = depts.filter(it => it.pid === that.formData.pid).filter(it => it.id !== that.formData.id)
      }else{
        children = depts.filter(it => it.pid === that.treeNode.id)
      }

      // console.log(children);
      const isExist = children.some(it => it.name === value)
      isExist ? callback(new Error('部门名字不能重复')) : callback()
    }

    async function validateDeptCode(rule, value, callback) {
      const { depts } = await getDepartments()

      let isExist = false
      if(that.formData.id){
        isExist = depts.filter(it => it.id !== that.formData.id).some(it => it.code === value)
      }else{
        depts.forEach(it => {
        if(it.code === value){
          isExist = true
        }
      })
      }
      
      isExist ? callback(new Error('部门编码不能重复')) : callback()

    }
    return {

      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: validateDeptName // 自定义函数的形式校验
          }
        ],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' }, {
            trigger: 'blur',
            validator: validateDeptCode // 自定义函数的形式校验
          }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      },
      peoples:[],
    }
  },
  computed: {
    title(){
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  created(){
    this.loadEmployeeSample()
  },
  watch: {
    // showDialog(newVal){
    //   if (newVal , this.isEdit) {
    //       this.getDeptDetail()
    //   } else {
    //     this.dialog = false
    //   }
    // }
  },
  methods: {
    async loadEmployeeSample(){
      try{
        this.peoples = await getEmployeeSample()
        
      }catch(e){
        console.log(e);
      }
    },
    async getDeptDetail(id){
      try{
        const ret = await getDepartmentInfo(id || this.treeNode.id)
        this.formData = ret
      }catch(e){

      }
    },
    btnOk(){
      try{
        this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          // 表示可以提交了

          if (this.formData.id) {
            await updateDepartmentInfo(this.formData)
          }else{
          await addDepartments({ ...this.formData, pid: this.treeNode.id }) // 调用新增接口 添加父部门的id
          }
          // this.formData.pid = this.treeNode.id 这样写更好理解，更简单
          this.$message({
              type:'success',
              message: this.formData.id ? '编辑成功' : '添加成功'
          })
          this.$emit('addDepts')
          
          this.$emit('update:showDialog', false)
        }
      })
      }catch(e){
        this.$message({
          type:'info',
          message:this.formData.id ? '编辑失败' : '添加失败'
        })
        console.log(e);
      }
    },
    cancel(){
      this.$refs.deptForm.resetFields()
      this.$emit('update:showDialog', false)
    }
  },
}
</script>
<style>

</style>