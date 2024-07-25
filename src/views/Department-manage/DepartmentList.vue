<template>
    <div>
        <el-card>
            <el-page-header :icon="null" title="科室管理">
                <template #content>
                    <span class="text-large font-600 mr-3"> 科室列表 </span>
                </template>

                <el-button style="margin-top: 20px;" plain @click="openDepartment">
                    添加科室
                </el-button>

                <el-dialog destroy-on-close v-model="dialogFormVisible" title="添加科室" width="600">
                    <el-form :model="addDepartmentForm" ref="addDepartmentFormRef" :rules="addDepartmentFormRules">
                        <el-form-item label="科室名称" :label-width="formLabelWidth" prop="name">
                            <el-input v-model="addDepartmentForm.name" />
                        </el-form-item>
                        <el-form-item label="科室简介" :label-width="formLabelWidth" prop="introduction">
                            <!-- <el-input v-model="addDepartmentForm.introduction" type="textarea" /> -->
                            <Editor @event="handleChangeEditor" />
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">关闭</el-button>
                            <el-button type="primary" @click="addDepartment()">
                                添加
                            </el-button>
                        </div>
                    </template>
                </el-dialog>
            </el-page-header>
        </el-card>

        <el-card style="margin-top: 20px;">
            <el-table :data="tableData" stripe style="width: 100%;margin-top: 50px;">
                <el-table-column prop="_id" label="id" />
                <el-table-column prop="name" label="科室" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.row)">
                        编辑
                        </el-button>
                        <el-button
                        size="small"
                        type="danger"
                        @click="handleDelete(scope.row)"
                        >
                        删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog
            destroy-on-close
            v-model="dialogVisible"
            title="编辑科室"
            width="500"
        >

            <el-form
            ref="addDepartmentFormRef"
            style="max-width: 600px"
            :model="addDepartmentForm"
            :rules="addDepartmentFormRules"
            label-width="80px"
            class="demo-ruleForm"
            >
                    
                    <el-form-item label="科室" prop="name">
                        <el-input v-model="addDepartmentForm.name" />
                    </el-form-item>
                    <el-form-item label="科室简介" prop="introduction">
                        <!-- <el-input v-model="addDepartmentForm.introduction" type="textarea" /> -->
                        <Editor 
                            @event="handleChangeEditor" 
                            :introduction = "addDepartmentForm.introduction" 
                            v-if="addDepartmentForm.introduction" 
                        />
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
import { reactive, ref,onMounted } from 'vue'
import axios from 'axios';
import { ElMessage,ElMessageBox } from 'element-plus'
import Editor from "@/components/editor/Editor"

const tableData = ref([])
const dialogFormVisible = ref(false)
const dialogVisible = ref(false)
const formLabelWidth = '140px'
const addDepartmentFormRef = ref()
const addDepartmentForm = ref({
  _id: '',
  name: '',
  introduction:''
})


onMounted(()=>{
    getTableData();
})
const getTableData = async ()=>{
    const res = await axios.get("/adminApi/department/list");
    tableData.value = res.data.data
}

//点击添加科室回调函数
const openDepartment = ()=>{
    dialogFormVisible.value = true;
    addDepartmentForm.value.name = '';
    addDepartmentForm.value.introduction = ''
}



//编辑回调函数
const handleEdit = async (data)=>{
    const res = await axios.get(`/adminApi/department/list/${data._id}`)
    addDepartmentForm.value = res.data.data[0]
    dialogVisible.value = true
}
//编辑确认回调函数
const handleEditConfirm = ()=>{
    addDepartmentFormRef.value.validate(async (valid)=>{
        if(valid){
            //更新后端
            await axios.put(`/adminApi/department/list/${addDepartmentForm.value._id}`,addDepartmentForm.value); 

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
    await axios.delete(`/adminApi/department/list/${data._id}`);
    getTableData();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}


const handleChangeEditor = (data) => {
    // console.log(data);
    addDepartmentForm.value.introduction = data
}






const addDepartment = ()=>{
    addDepartmentFormRef.value.validate(async (valid)=>{
        if(valid){
            await axios.post("/adminApi/department/add",addDepartmentForm.value)
            dialogFormVisible.value = false
            await getTableData();
            ElMessage({
                type: 'success',
                message: '添加成功',
            })
        }
    })

}

const addDepartmentFormRules = reactive({
    code: [
        { required: true, message: '请输入序号', trigger: 'blur' },
    ],
    name: [
        { required: true, message: '请输入科室名称', trigger: 'blur' },
    ],
    introduction: [
        { required: true, message: '请输入科室简介', trigger: 'blur' }
    ]
})

</script>

<style lang="scss" scoped>

</style>