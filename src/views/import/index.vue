<template>
    <!-- 导入公共组件 -->
    <upload-excel :on-success="onSuccess" />
</template>

<script>
import { importEmployee } from '@/api/employees'

export default {
    name: 'UploadIndex',
    created() {
        console.log(this.$route.params)
    },

    methods: {
        async onSuccess(data) {
            try {
                const userRelations = {
                    入职日期: 'timeOfEntry',
                    手机号: 'mobile',
                    姓名: 'username',
                    转正日期: 'correctionTime',
                    工号: 'workNumber'
                }
                const { results } = data
                const newArr = results.map(item => {
                    const result = {}
                    // item是个对象
                    const keys = Object.keys(item)
                    keys.forEach(key => {
                        // key: 入职日期                      旧key
                        // userRelations[key]: timeOfEntry   新key
                        const newKey = userRelations[key]
                        if (['correctionTime', 'timeOfEntry'].includes(newKey)) {
                            // if (newKey === 'correctionTime' || newKey === 'timeOfEntry') {
                            result[newKey] = this.formatDate(item[key], '-')
                        } else {
                            result[newKey] = item[key]
                        }
                    })

                    return result
                })

                console.log(newArr)
                await importEmployee(newArr)
                this.$message.success('导入成功')
                this.$router.back()
            } catch (e) {
                console.log(e);
            }

        },
        formatDate(numb, format) {
            const time = new Date((numb - 1) * 24 * 3600000 + 1)
            time.setYear(time.getFullYear() - 70)
            const year = time.getFullYear() + ''
            const month = time.getMonth() + 1 + ''
            const date = time.getDate() - 1 + ''
            if (format && format.length === 1) {
                return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
            }
            return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
        },

        beforeUpload() {

        }
    },

}
</script>



<style scoped lang="sass">


</style>