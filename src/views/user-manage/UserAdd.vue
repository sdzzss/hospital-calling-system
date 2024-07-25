<template>
    <div>
        <el-page-header :icon="null" title="用户管理">
            <template #content>
            <span class="text-large font-600 mr-3"> 添加用户 </span>
            </template>
        </el-page-header>

        <el-form
        ref="userFormRef"
        style="max-width: 600px"
        :model="userForm"
        :rules="userFormRules"
        label-width="80px"
        class="demo-ruleForm"
        >
            <el-form-item label="用户名" prop="username">
                <el-input v-model="userForm.username" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="userForm.password" type="password" />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
                <el-select
                v-model="userForm.gender"
                placeholder="Select"
                style="width: 100%"
                >
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="角色" prop="role">
                <el-select
                v-model="userForm.role"
                placeholder="Select"
                style="width: 100%"
                >
                    <el-option
                        v-for="item in options_role"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="职称" prop="title">
                <el-select
                v-model="userForm.title"
                placeholder=""
                style="width: 100%"
                >
                    <el-option
                        v-for="item in options_title"
                        :key="item._id"
                        :label="item.name"
                        :value="item.name"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="科室" prop="department">
                <el-checkbox-group v-model="userForm.department">
                    <el-checkbox v-for="item in options_department"
                    :key="item._id"
                    :label="item.name"
                    :value="item.name"
                    name="department" />
                </el-checkbox-group>
            </el-form-item>
            <!-- <el-form-item label="科室" prop="department">
                <el-select
                v-model="userForm.department"
                placeholder="Select"
                style="width: 100%"
                >
                    <el-option
                        v-for="item in options_department"
                        :key="item._id"
                        :label="item.name"
                        :value="item.name"
                    />
                </el-select>
            </el-form-item> -->
            <el-form-item label="个人简介" prop="introduction" style="z-index: 0;">
                <Editor @event="handleChangeEditor" />
            </el-form-item>
            <!-- <el-form-item label="个人简介" prop="introduction">
                <el-input v-model="userForm.introduction" type="textarea" />
            </el-form-item> -->

            <el-form-item label="头像" prop="avatar">

                <Upload :avatar="userForm.avatar" @_change="handleChange" />

            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()">
                添加用户
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup>
import { ref,reactive,onMounted } from "vue";
import Upload from "@/components/upload/Upload"
import upload from "@/util/upload";
import Editor from "@/components/editor/Editor"
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const userFormRef = ref()
const options_department = ref([])
const options_title = ref([])
const userForm = reactive({
    username:"",
    password:"",
    title:"",
    gender:1,
    role:2,     //1 管理员 2 普通用户
    department:[],
    introduction:"",
    avatar:"",
    file:null
})

//每次选择完图标之后的回调函数
const handleChange = (file)=>{
    userForm.avatar = URL.createObjectURL(file);
    userForm.file = file;
}



const submitForm = ()=>{
    userFormRef.value.validate(async (valid)=>{
        if(valid){
            // console.log(userForm);
            await upload("/adminApi/user/add",userForm);
            router.push(`/user-manage/userlist`)
        }
    })
}


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
    avatar: [
        { required: true, message: '请选择头像', trigger: 'blur' },
    ],
    department: [
        { required: true, message: '请选择科室', trigger: 'blur' },
    ],
    title: [
        { required: true, message: '请选择职称', trigger: 'blur' },
    ],
})

const options =[
    {
        label:'男',
        value:1
    },
    {
        label:'女',
        value:2
    },
]

const options_role =[
    {
        label:'管理员',
        value:1
    },
    {
        label:'科室医生',
        value:2
    },
    {
        label:'登记人员',
        value:3
    }
]

onMounted(()=>{
    getDepartmentData();
    getTitleData();
})



//获取科室列表
const getDepartmentData = async ()=>{
    const res = await axios.get("/adminApi/department/list");
    options_department.value = res.data.data
}

//获取职称列表
const getTitleData = async ()=>{
    const res = await axios.get("/adminApi/title/list");
    options_title.value = res.data.data
}


//每次editor内容改变的回调函数
const handleChangeEditor = (data) => {
    console.log(data);
    userForm.introduction = data
}


</script>

<style lang="scss" scoped>
.demo-ruleForm{
    margin-top: 50px;
}
</style>
