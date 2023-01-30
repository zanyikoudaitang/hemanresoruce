<template>
    <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
        <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
        <el-checkbox-group v-model="roleIds">
            <!-- 选项 -->
            <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
                {{ item.name }}
            </el-checkbox>
        </el-checkbox-group>
        <el-row slot="footer" type="flex" justify="center">
            <el-col :span="6">
                <el-button type="primary" size="small" @click="btnOk">确定</el-button>
                <el-button size="small" @click="btnCancel">取消</el-button>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script>
import { getUserDetailById } from "@/api/user"
import { getRoleList } from '@/api/setting'
import {assignRole} from '@/api/employees'

export default {
    // 组件名称
    name: 'AssignRole',
    // 组件参数 接收来自父组件的数据
    props: {
        showRoleDialog: {
            type: Boolean,
            default: false
        },
        userId: {
            type: String,
            default: null
        }
    },
    // 局部注册的组件
    components: {},
    // 组件状态值
    data() {
        return {
            list: [], // 角色列表
            roleIds: [],
        }
    },
    // 计算属性
    computed: {},
    // 侦听器
    watch: {},
    // 组件方法
    methods: {
        async btnOk(){
            try {
                // throw new Error('111')

                const ret = await assignRole({id:this.userId,roleIds:this.roleIds})
                // console.log('111',ret);
                this.$message.success('分配成功')
                this.$emit('update:show-role-dialog',false)
            } catch (e) {
                this.$message.error('分配失败')
            }
        },
        async getRoleList() {
            const { rows } = await getRoleList({ page: 1, pageSize: 10000 })
            console.log(rows);
            this.list = rows
        },
        async getUserDetailById(id){
            const { roleIds } = await getUserDetailById(id)
            this.roleIds = roleIds
        },
        btnCancel(){
            this.roleIds = [] //清除痕迹
            //关闭弹窗
            this.$emit('update:show-role-dialog',false)

        }
    },
    // 以下是生命周期钩子   注：没用到的钩子请自行删除
    /**
    * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
    */
    created() {
        this.getRoleList(this.userId)
    },
    /**
    * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
    * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
    */
    mounted() {


    },
}
</script> 

<style scoped lang="sass">

</style>