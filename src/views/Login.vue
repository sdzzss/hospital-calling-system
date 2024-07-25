<template>
<div class="body_login">
  <div class="formContainer">
    <h3>门诊叫号管理系统</h3>
    <br />
    <h6>欢迎登录</h6>
    <el-form
      ref="loginFormRef"
      style="max-width: 600px"
      :model="loginForm"
      status-icon
      :rules="loginRules"
      label-width="80px"
      class="loginForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from "vue-router";
import axios from 'axios'
import { ElMessage } from 'element-plus'
import {useStore} from 'vuex'
const store = useStore();

//表单绑定的响应对象
const loginForm = reactive({
    username:"",
    password:""
})

//表单的引用对象
const loginFormRef = ref();
//表单验证规则
const loginRules = reactive({
  username:[
    {
      required:true,message:"请输入用户名",trigger:"blur"
    }
  ],
  password:[
    {
      required:true,message:"请输入密码",trigger:"blur"
    }
  ]
})

const router = useRouter();

//提交表单回调函数
const submitForm = ()=>{
  //校验表单
  loginFormRef.value.validate((valid)=>{
    console.log(valid);
    if (valid) {
      axios.post("/adminApi/user/login",loginForm).then(res=>{
        console.log(res.data);
        if(res.data.ActionType === 'ok'){
          store.commit("changeUserInfo",res.data.data)
          router.push("/home"); 
        }else{
          ElMessage.error('用户名或密码错误！')
        }
      })
      
    }
  })
}
</script>

<style lang="scss" scoped>
.body_login{
  width: 100vw;
  height: 100vh;
  background-image: url(../../public/img/background_1.png);
  background-position: center center;
	background-size: cover;
}
.formContainer{
  width: 500px;
  height: 300px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  background: rgba($color:#000000,$alpha: 0.5);
  color: #ffffff;
  text-align: center;
  padding: 20px;
}
::v-deep .el-form-item__label{
  color: #ffffff;
}
h3{
  font-size: 30px
}
.loginForm{
  margin-top: 20px;
}
</style>
