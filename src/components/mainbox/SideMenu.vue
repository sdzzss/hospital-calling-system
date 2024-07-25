<template>
    <el-aside :width="$store.state.isCollapsed?'64px':'200px'">

        <el-menu 
        :router="true"
        :collapse="$store.state.isCollapsed"
        :collapse-transition="false"
        :default-active="route.fullPath"
        >

            <el-menu-item index="/home">
                <el-icon>
                    <home-filled />
                </el-icon>
                <span>首页</span>
            </el-menu-item>

            <el-menu-item index="/center">
                <el-icon>
                    <avatar />
                </el-icon>
                <span>个人中心</span>
            </el-menu-item>

            <el-menu-item index="/registration" v-if="store.state.userInfo.role === 3 || store.state.userInfo.role === 1">
                <el-icon>
                    <avatar />
                </el-icon>
                <span>登记管理</span>
            </el-menu-item>

            <el-sub-menu index="/user-manage" v-admin>
                <template #title>
                    <el-icon>
                        <tools />
                    </el-icon>
                    <span>用户管理</span>
                </template>
                    <el-menu-item index="/user-manage/adduser">添加用户</el-menu-item>
                    <el-menu-item index="/user-manage/userlist">用户列表</el-menu-item>
            </el-sub-menu>

            <el-menu-item index="/Department-manage/DepartmentList" v-admin>
                <el-icon>
                    <School />
                </el-icon>
                <span>科室管理</span>
            </el-menu-item>
            <el-menu-item index="/title-manage/TitleList" v-admin>
                <el-icon>
                    <Suitcase />
                </el-icon>
                <span>职称管理</span>
            </el-menu-item>

            <el-sub-menu index="/patient-manage">
                <template #title>
                    <el-icon>
                        <tools />
                    </el-icon>
                    <span>病号管理</span>
                </template>
                    <el-menu-item v-for="(item,index) in store.state.userInfo.department"
                    :key="item"
                    @click="clickfun()"
                    :index= "'/patient-manage/patientlist/'+index" >{{item}}</el-menu-item>
            </el-sub-menu>




        </el-menu>

    </el-aside>
</template>
<style lang="scss" scoped>
.el-aside {
    height: 100vh;
    .el-menu{
        height: 100vh;
    }
}
</style>
<script setup>
import {HomeFilled,Avatar,Tools,School,Suitcase} from '@element-plus/icons-vue'
import {useRoute} from 'vue-router'
import {useStore} from 'vuex'
import axios from 'axios';
import { onMounted,ref } from 'vue';
const route = useRoute();
const department = ref('')
const store = useStore();
const departmentData = ref()
const vAdmin = {
    mounted(el){
        if(store.state.userInfo.role !==1){
            el.parentNode.removeChild(el);
        }

    }
}
onMounted(()=>{
    getDepartment();
    //监听网页关闭前
    // window.addEventListener('beforeunload', e => beforeunloadHandler(e))
})
const getDepartment = async ()=>{
    const res = await axios.get(`/adminApi/user/list/${store.state.userInfo._id}`)
    departmentData.value = res.data.data[0]
    department.value = departmentData.value.department[route.params.id]
}
const workStateData = {department:department,id:store.state.userInfo._id}

// const beforeunloadHandler =(e)=>{
//     axios.delete(`/adminApi/workState/delete/${workStateData.id}`)  
// }

const clickfun = ()=>{
    setTimeout(()=>{
        window.location.reload();
    },100)
}
</script>