<template>
    <div>
        <el-card>
            <el-page-header :icon="null" title="职称管理">
                <template #content>
                    <span class="text-large font-600 mr-3"> 职称列表 </span>
                </template>

                <el-button style="margin-top: 20px;" plain @click="dialogFormVisible = true">
                    添加职称
                </el-button>

                <el-dialog v-model="dialogFormVisible" title="添加职称" width="600">
                    <el-form :model="addTitleForm" ref="addTitleFormRef">
                        <el-form-item label="职称" :label-width="formLabelWidth" prop="name">
                            <el-input v-model="addTitleForm.name" />
                        </el-form-item>
                    </el-form>
                        <template #footer>
                            <div class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">关闭</el-button>
                                <el-button type="primary" @click="addTitle()">
                                    添加
                                </el-button>
                            </div>
                        </template>
                </el-dialog>
            </el-page-header>
        </el-card>

        <el-card style="margin-top: 20px;">
            <el-table :data="tableData" stripe style="width: 100%;margin-top: 50px;">
                <el-table-column prop="_id" label="_id" />
                <el-table-column prop="name" label="职称" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.row)">
                            编辑
                        </el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="dialogVisible" title="编辑科室" width="500">

            <el-form ref="addTitleFormRef" style="max-width: 600px" :model="addTitleForm" label-width="80px" class="demo-ruleForm">
                <el-form-item label="科室" prop="name">
                    <el-input v-model="addTitleForm.name" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleEditConfirm()">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus'

const tableData = ref([])
const dialogFormVisible = ref(false)
const dialogVisible = ref(false)
const formLabelWidth = '140px'
const addTitleFormRef = ref()
const addTitleForm = ref({
    _id:'',
    name: ''
})


onMounted(() => {
    getTableData();
})
const getTableData = async () => {
    const res = await axios.get("/adminApi/title/list");
    tableData.value = res.data.data
}




//编辑回调函数
const handleEdit = async (data) => {
    const res = await axios.get(`/adminApi/title/list/${data._id}`)
    addTitleForm.value = res.data.data[0]
    dialogVisible.value = true
}
//编辑确认回调函数
const handleEditConfirm = () => {
    addTitleFormRef.value.validate(async (valid) => {
        if (valid) {
            //更新后端
            await axios.put(`/adminApi/title/list/${addTitleForm.value._id}`, addTitleForm.value);

            ElMessage({
                type: 'success',
                message: '修改成功',
            })
            //重新获取数据
            await getTableData();
        }
    })
    //隐藏弹窗
    dialogVisible.value = false
}

//删除回调
const handleDelete = (data) => {
    ElMessageBox.confirm(
        '是否删除该用户？',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            await axios.delete(`/adminApi/title/list/${data._id}`);
            getTableData();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}









const addTitle = () => {
    addTitleFormRef.value.validate(async (valid) => {
        if (valid) {
            await axios.post("/adminApi/title/add", addTitleForm.value)
            dialogFormVisible.value = false
            await getTableData();
            ElMessage({
                type: 'success',
                message: '添加成功',
            })
        }
    })

}


</script>

<style lang="scss" scoped></style>