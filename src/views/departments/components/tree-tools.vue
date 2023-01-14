<template>
    <el-row type="flex" justify="space-between" align="middle" style="width:100%;height: 40px">
        <el-col>
            <span>{{ treeNode.name }}</span>
        </el-col>
        <el-col :span="4">
            <el-row type="flex" justify="end">
                <!-- 两个内容 -->
                <el-col>{{ treeNode.manager }}</el-col>
                <el-col>
                    <!-- 下拉菜单 element -->
                    <el-dropdown @command="operateDepts">
                        <span>
                            操作<i class="el-icon-arrow-down" />
                        </span>
                        <!-- dropdownmenu是具体的下拉菜单选项，通过具名插槽dropdown来指定 -->
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                            <template v-if="!isRoot">
                                <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                                <el-dropdown-item command="del">删除部门</el-dropdown-item>
                            </template>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>
<script>
import {delDepartments} from "@/api/departments"

export default {
    name: 'TreeTools',
    props: {
        treeNode: {
            type: Object,
            required: true
        },
        isRoot: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        async operateDepts(command) {
            switch (command) {
                case command = 'add':
                    // 添加部门
                    this.$emit('addDepts',this.treeNode)
                    break;
                case command = 'edit':
                    // 编辑部门
                    this.$emit('editDept', this.treeNode)
                    break;
                case command = 'del':
                    // 删除部门
                    const ret = await this.$confirm('确定删除吗？',{
                        confirmButtonText:'确定',
                        cancelButtonText:'取消',
                        type: 'warning'
                    }).catch(e=>e)
                    if (ret === 'cancel') {
                        this.$message({
                            type:'info',
                            message:'已取消删除'
                        })
                        break
                    }
                    try {
                        await delDepartments(this.treeNode.id)
                        this.$message({
                            type:'success',
                            message: '删除成功'
                        })
                        this.$emit('delDept')
                    } catch (error) {
                        console.log(error);
                    }

                    break;
            }
        }
    },


}

</script>

<style scoped>

</style>
