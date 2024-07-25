<template>
    <div>
        <el-card>
            <el-page-header :icon="null" title="用户管理">
                <template #content>
                    <span class="text-large font-600 mr-3"> 用户列表 </span>
                    <el-input class="SelectInp"
                        v-model="selectInput"
                        style="width: 240px"
                        size="large"
                        placeholder="输入姓名检索用户"
                        :suffix-icon="Search"
                        @change="changeSelect"
                    />
                </template>
            </el-page-header>

            <el-table :data="alltableData()" stripe style="width: 100%;margin-top: 10px;">
                <el-table-column prop="username" label="用户名" />
                <el-table-column label="头像">
                    <template #default="scope">
                        <!-- <div v-if="scope.row.avatar"> -->
                        <el-avatar :size="80" :src="'http://127.0.0.1:3001' + scope.row.avatar"></el-avatar>
                        <!-- </div> -->
                    </template>
                </el-table-column>
                <el-table-column prop="department" label="科室" />
                <el-table-column label="角色">
                    <template #default="scope">
                        <!-- {{ scope.row.role === 1 ? '管理员' : '普通用户' }} -->
                        <el-tag type="danger" v-if="scope.row.role === 1">管理员</el-tag>
                        <el-tag type="primary" v-else>普通用户</el-tag>
                    </template>
                </el-table-column>
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
            <div class="example-pagination-block">
                <!-- <div class="example-demonstration">分页</div> -->
                <el-pagination
                   
                    background
                    layout="prev, pager, next ,total,sizes"
                    :total="state.total"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                />
            </div>




        <el-dialog v-model="dialogVisible" destroy-on-close title="编辑用户" width="500">

            <el-form ref="userFormRef" style="max-width: 600px" :model="userForm" :rules="userFormRules"
                label-width="80px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userForm.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="userForm.password" type="password" />
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-select v-model="userForm.gender" placeholder="Select" style="width: 100%">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select v-model="userForm.role" placeholder="Select" style="width: 100%">
                        <el-option v-for="item in options_role" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="职称" prop="title">
                    <el-select v-model="userForm.title" placeholder="" style="width: 100%">
                        <el-option v-for="item in options_title" :key="item._id" :label="item.name"
                            :value="item.name" />
                    </el-select>
                </el-form-item>
                <el-form-item label="科室" prop="department">
                    <el-checkbox-group v-model="userForm.department">
                        <el-checkbox v-for="item in options_department" :key="item._id" :label="item.name"
                            :value="item.name" name="department" />
                    </el-checkbox-group>
                </el-form-item>
                <!-- <el-form-item label="个人简介" prop="introduction">
                    <el-input v-model="userForm.introduction" type="textarea" />
                </el-form-item> -->
                <el-form-item label="个人简介" prop="introduction">
                    <Editor @event="handleChangeEditor" :introduction = "userForm.introduction" v-if="userForm.introduction" />
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
import { ref, onMounted, reactive } from 'vue';
import axios from "axios";
import { ElMessage, ElMessageBox } from 'element-plus'
import {Search} from '@element-plus/icons-vue'
import Editor from "@/components/editor/Editor"

// import {useStore} from 'vuex'
// const store = useStore();
const dialogVisible = ref(false)
const userFormRef = ref()
const selectInput = ref('')
const options_department = ref([])
const options_title = ref([])
let userForm = ref({
    username: "",
    password: "",
    title:"",
    gender: 1,
    role: 2,     //1 管理员 2 普通用户
    introduction: "",
    department: []
})

const userFormRules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
    gender: [
        { required: true, message: '请选择性别', trigger: 'blur' },
    ],
    role: [
        { required: true, message: '请选择权限', trigger: 'blur' },
    ],
    introduction: [
        { required: true, message: '请输入个人简介', trigger: 'blur' },
    ],
    department: [
        { required: true, message: '请选择科室', trigger: 'blur' },
    ],
    title: [
        { required: true, message: '请选择职称', trigger: 'blur' },
    ],
})


const options = [
    {
        label: '男',
        value: 1
    },
    {
        label: '女',
        value: 2
    },
]
//获取职称列表
const getTitleData = async ()=>{
    const res = await axios.get("/adminApi/title/list");
    options_title.value = res.data.data
}

const options_role = [
    {
        label: '管理员',
        value: 1
    },
    {
        label: '科室医生',
        value: 2
    },
    {
        label: '登记人员',
        value: 3
    },
]



const tableData = ref([])
onMounted(() => {
    getTableData();
    getDepartmentData();
    getTitleData();
    
})

//获取科室列表
const getDepartmentData = async () => {
    const res = await axios.get("/adminApi/department/list");
    options_department.value = res.data.data
}



const getTableData = async () => {
    const res = await axios.get("/adminApi/user/list");
    tableData.value = res.data.data
    state.total = tableData.value.length
}

//编辑回调函数
const handleEdit = async (data) => {
    const res = await axios.get(`/adminApi/user/list/${data._id}`)
    userForm.value = res.data.data[0]
    dialogVisible.value = true
}
//编辑确认回调函数
const handleEditConfirm = () => {
    userFormRef.value.validate(async (valid) => {
        if (valid) {
            console.log(userForm.value);
            //更新后端
            await axios.put(`/adminApi/user/list/${userForm.value._id}`, userForm.value);
            //重新获取数据
            getTableData();
        }
    })
    //隐藏弹窗
    dialogVisible.value = false
}

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
            //   console.log(data);
            await axios.delete(`/adminApi/user/list/${data._id}`);
            getTableData();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}


//每次editor内容改变的回调函数
const handleChangeEditor = (data) => {
    // console.log(data);
    userForm.value.introduction = data
}


//表格用到的参数
const state = reactive({
    page: 1,
    limit: 10,
    total: tableData.value.length,
});

const alltableData = () => {
    return tableData.value.filter(
        (item, index) =>
        index < state.page * state.limit &&
        index >= state.limit * (state.page - 1)
    );
};

 //改变页码
const handleCurrentChange = (e) => {
    state.page = e;
};
//改变页数限制
const handleSizeChange = (e) => {
    state.limit = e;
};

//搜索
const changeSelect = async ()=>{
    // console.log(selectInput.value === '');
    if(selectInput.value === ''){
        getTableData();
    }else{
        const res = await axios.get(`/adminApi/user/listSelect/${selectInput.value}`);
        if(res){
            tableData.value = res.data.data
        }else{
            console.log('查询为空');
        }
        
    }

}
</script>
<style scoped>
.example-pagination-block{
    position: relative;
    margin-top:20px ;
    .el-pagination{
        justify-content: center;
    }
    
}
.SelectInp{
    margin: 0 5vw;
}
</style>
