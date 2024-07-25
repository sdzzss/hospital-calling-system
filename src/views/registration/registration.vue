<template>
    <div>
        <el-page-header :icon="null" title="门诊叫号管理系统">
            <template #content>
            <span class="text-large font-600 mr-3"> 登记管理 </span>
            </template>
        </el-page-header>
        <el-form
        ref="registrationRef"
        style="max-width: 600px"
        :model="registration"
        :rules="registrationRules"
        label-width="80px"
        class="demo-ruleForm"
        >
            <el-form-item label="身份证号" prop="idCard">
                <el-input v-model="registration.idCard" @blur="handleBlur"/>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="registration.name" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-input v-model="registration.sex" />
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input v-model="registration.age" />
            </el-form-item>

            <el-form-item label="挂号科室" prop="department">
                <el-select
                v-model="registration.department"
                placeholder=""
                style="width: 100%"
                >
                    <el-option
                        v-for="item in options_department"
                        :key="item._id"
                        :label="item.name"
                        :value="item.name"
                    />
                </el-select>
            </el-form-item>


            <el-form-item>
                <el-button type="primary" @click="handleReg()">
                登记
                </el-button>
            </el-form-item>
        </el-form>
        
    </div>
</template>
<script setup>
import { ref,reactive,onMounted } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from 'element-plus'

const options_department = ref();
const registrationRef = ref();
const registration = reactive({
    idCard:"",
    name:"",
    sex:"",
    age:"",
    department:'',
    dateTime:'',
    state:1
})
const registrationRules = reactive({
    idCard: [
        { required: true, message: '请输入身份证号', trigger: 'blur' },
    ],
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
    ],
    department: [
        { required: true, message: '请选择科室', trigger: 'blur' },
    ]
})

//获取科室列表
const getDepartmentData = async ()=>{
    const res = await axios.get("/adminApi/department/list");
    options_department.value = res.data.data
}

//通过身份证号获取年龄及性别
function handleBlur(){
  if (registration.idCard.length == 18) {
    registration.sex = registration.idCard.substring(16, 17) % 2 == 1 ? '男' : '女';
    registration.age = new Date().getFullYear() - registration.idCard.substring(6, 10) - 1;
    if (registration.idCard.substring(10, 12) < new Date().getMonth()+1 || (registration.idCard.substring(10, 12) == new Date().getMonth()+1 && registration.idCard.substring(12, 14) <= new Date().getDate())){
        registration.age++;
    }
  } else {
  	// 将性别，出生日期，年龄置空
    registration.sex = '';
    registration.age = '';
  }
};






//登记回调
const handleReg = async ()=>{
    let time = new Date(); //创建一个日期对象
    function nowDate(time) {
        let year = time.getFullYear(); // 年
        let month = (time.getMonth() + 1).toString().padStart(2, '0'); // 月
        let date = time.getDate().toString().padStart(2, '0'); // 日
        let hour = time.getHours().toString().padStart(2, '0'); // 时
        let minute = time.getMinutes().toString().padStart(2, '0'); // 分
        let second = time.getSeconds().toString().padStart(2, '0'); // 秒
        return {
            year,
            month,
            date,
            hour,
            minute,
            second
        }
    }
    let dateTime = nowDate(time);
    registration.dateTime = `${dateTime.year}-${dateTime.month}-${dateTime.date} ${dateTime.hour}:${dateTime.minute}:${dateTime.second}`;
    //校验回调
    registrationRef.value.validate(async (valid)=>{
        if(valid){
            //查询同一天内多次登记人员
            const addGetlistRes = await axios.get(`/adminApi/registration/addGetlist/${registration.idCard}/${registration.dateTime}/${registration.department}`)
            //判断是否重复登记
            if (addGetlistRes.data.data.length === 0) {
                const res = await axios.post("/adminApi/registration/add",registration)
                if (res.data.ActionType === 'ok') {
                    ElMessage({
                        type: 'success',
                        message: '登记成功',
                    })

                    registration.idCard = '';
                    registration.name = '';
                    registration.department = '';
                    registration.sex = '';
                    registration.age = '';
                }else{
                    ElMessage({
                        type:'info',
                        message: '登记失败',
                    })
                }
            }else{
                ElMessage({
                    type:'info',
                    message: '登记失败,今日已登记',
                })
            }
            
        }
    })
}



onMounted(()=>{
    getDepartmentData();
})

</script>
<style scoped lang="scss">
.el-row{
    margin-top: 20px
}
.box-card{
    text-align: center;
}
.demo-ruleForm{
    margin-top: 30px;
}
</style>
