<template>
    <div>
        
        <el-page-header :icon="null" title="门诊叫号管理系统">
            <template #content>
            <span class="text-large font-600 mr-3"> 首页 </span>
            </template>
        </el-page-header>

        <el-card style="margin-top: 50px">
            <el-row>
                <el-col :span="4">
                    <el-avatar :size="100" :src="avatarUrl" />
                </el-col>
                <el-col :span="20">
                    <h3 style="line-height: 100px;">Hello {{store.state.userInfo.username}} ! {{ welcomeText }}</h3>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script setup>
import {useStore} from 'vuex';
import { computed } from 'vue';
const store = useStore();

const avatarUrl = computed(()=>{
    return store.state.userInfo.avatar ? 'http://127.0.0.1:3001' + store.state.userInfo.avatar : `https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png`
})
const welcomeText = computed(()=>{
    let welcomeTextDate = new Date();
    if(welcomeTextDate.getHours() > 12 && welcomeTextDate.getHours() < 19){
        return '下午好！'
    }else if(welcomeTextDate.getHours() < 12){
        return '早上好！'
    }else{
        return '晚上好！'
    }
})
</script>
