import Home from '@/views/home/Home.vue'
import Center from '@/views/center/Center.vue'
import UserAdd from '@/views/user-manage/UserAdd.vue'
import UserList from '@/views/user-manage/UserList.vue'
import NotFound from '@/views/not-found/NotFound.vue'
import DepartmentList from '@/views/Department-manage/DepartmentList.vue'
import PatientList from '@/views/patient-manage/PatientList.vue'
import TitleList from '@/views/title-manage/TitleList.vue'
import Registration from '@/views/registration/registration.vue'

const routes = [
    {
        path: "/home",
        component: Home 
    },
    {
        path: "/center",
        component: Center 
    },
    {
        path: "/registration",
        component: Registration 
    },

    {
        path: "/user-manage/adduser",
        component: UserAdd,
        requireAdmin:true 
    },
    {
        path: "/user-manage/userlist",
        component: UserList,
        requireAdmin:true  
    },

    {
        path: "/Department-manage/DepartmentList",
        component: DepartmentList,
        requireAdmin:true   
    },
    {
        path: "/title-manage/TitleList",
        component: TitleList,
        requireAdmin:true   
    },
    {
        path: "/Patient-manage/PatientList/:id",
        component: PatientList 
    },
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/:pathMatch(.*)*",
        name: "Notfound",
        component: NotFound
    }
]
export default routes