<template>
    <div>
        <el-card>
            <el-page-header :icon="null" title="病号管理">
                <template #content>
                    <span class="text-large font-600 mr-3"> {{ department }} </span>
                </template>
            </el-page-header>
            <el-switch
                v-model="WorkSwitch"
                inline-prompt
                size="large"
                active-text="上班"
                inactive-text="下班"
                @change="workSwitchChange()"
            />
        </el-card>

        <el-card style="margin-top: 20px;">

            <h3 style="margin-bottom: 20px;">挂号列表</h3>

            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="_id" label="id" />
                <el-table-column prop="name" label="姓名" />
                <el-table-column prop="idCard" label="身份证号"/>
                <el-table-column prop="sex" label="性别"/>
                <el-table-column prop="age" label="年龄"/>
                <el-table-column prop="dateTime" label="日期" />
                <el-table-column prop="state" label="状态">
                    <template #default="scope">
                        <el-tag type="info" v-if="scope.row.state !== 1">已接诊</el-tag>
                        <el-tag type="primary" v-else>未接诊</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button v-if="scope.row.state === 1" size="small" @click="handleEdit(scope.row)">
                            接诊
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination background 
                layout="prev, pager, next" 
                :total="50"
                style="position: absolute; bottom: 20px;"
            />
        </el-card>
    </div>
</template>
<script setup>
import { onMounted,ref } from 'vue';
import { useRoute } from 'vue-router'
import {useStore} from 'vuex'
import axios from 'axios';
const store = useStore();

const departmentData = ref()
const department = ref('')
const route = useRoute();


onMounted(()=>{
    getDepartment();
})
const WorkSwitch = ref()

//登记病人列表
let tableData = ref([])
//获取上下班状态
const getDepartment = async ()=>{
    const res = await axios.get(`/adminApi/user/list/${store.state.userInfo._id}`)
    departmentData.value = res.data.data[0]
    department.value = departmentData.value.department[route.params.id]
    try {
        const workstates = axios.get(`/adminApi/workState/list/${store.state.userInfo._id}`);
        if ((await workstates).data.data[0].department === departmentData.value.department[route.params.id]) {
            WorkSwitch.value = true
        }else{
            WorkSwitch.value = false
        }
    } catch (error) {
        WorkSwitch.value = false
    }
    
    //获取登记病人信息
    const registrationRes = await axios.get(`/adminApi/registration/getlist/${department.value}`)
    tableData.value = registrationRes.data.data

}

//修改上下班状态推送数据给门牌app
const workStateData = {department:department,id:store.state.userInfo._id}
const workSwitchChange = async ()=>{
    if(WorkSwitch.value){
        const res = await axios.post("/adminApi/workState/add",workStateData)
    }else{
        await axios.delete(`/adminApi/workState/del/${workStateData.id}`)
    }
}



//接诊按钮回调
const handleEdit = (reg)=>{
    console.log(reg._id);
}
</script>
<style lang="scss" scoped>
.el-switch{
    margin-top: 10px;
}
</style>