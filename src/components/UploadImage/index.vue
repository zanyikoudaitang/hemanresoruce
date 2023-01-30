<template>
    <div>
        <el-upload :class="{ hidden: fileList.length }" list-type="picture-card" action=""
            :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-change="handleChange"
            :before-upload="beforeUpload" :http-request="upload" :file-list="fileList" :limit="1">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-progress v-if="isShowPercent"  :percentage="percent" />
        <el-dialog title="图片预览" :visible.sync="dialogVisible">
            <img class="preview-img" width="50%" :src="dialogImageUrl" alt="" />
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'UploadImage',
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            fileList: [],
            isShowPercent: false,
            percent: 0,
        }
    },
    methods: {
        async upload() {
            try {
                this.isShowPercent = true
                const formData = new FormData()
                formData.append('photo', this.fileList[0].raw)
                const ret = await axios({
                    url: 'http://toutiao.itheima.net/v1_0/user/photo',
                    method: 'PATCH',
                    headers: {
                        Authorization: 'Bearer f6e598d8-098e-4e51-b187-e2eaff75368a'
                    },
                    data: formData,
                    onUploadProgress: ({ loaded, total }) => {
                        this.percent = parseInt((loaded / total) * 100, 10)
                    }
                })

                // 成功后更新file的url地址为 远程服务器地址
                this.fileList[0].url = ret.data.data.photo
                this.isShowPercent = false
            } catch (err) {
                console.log(2, err)
            }
        },
        beforeUpload(file) {
            const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
            if (!types.includes(file.type)) {
                this.$message.error('请上传png/jpg/bmp/gif等格式的图片')
                return false
            }

            // B =*1024=> 1 KB =*1024=> 1M
            if (file.size > 5 * 1024 * 1024) {
                this.$message.error('请上传5MB以下的图片')
                return false
            }

            // 最后 就是通过条件，返回true
            return true
        },
        // 添加图片时 上传图片成功/失败时触发
        handleChange(file, fileList) {
            if (file.status === 'ready') {
                this.fileList = fileList
            }
        },
        handleRemove(file, fileList) {
            this.fileList = fileList
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        }
    }
}
</script>

<style scoped lang="scss">
.hidden {
    ::v-deep .el-upload {
        display: none;
    }
}

.preview-img {
    display: block;
    margin: 0 auto;
}
</style>
