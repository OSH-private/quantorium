import {createWebHistory,createRouter} from "vue-router";
import Home from "../pages/Home.vue";
import Pg1 from "../pages/Zavod.vue";
import Pg2 from "../pages/Pg2.vue";
import Pg3 from "../pages/Pg3.vue";
import Pg4 from "../pages/Pg4.vue";
import Pg5 from "../pages/Pg5.vue";
import comic from "../pages/comic.vue";
const routes =
    [
        {
            path:'/',
            component:Home
        },
        {
            path: '/roadmap',
            component: Pg1
        },
        {
            path: '/quest1',
            component: Pg2
        },
        {
            path: '/quest2',
            component: Pg3
        },
        {
            path: '/quest3',
            component: Pg4
        },
        {
            path: '/final',
            component: Pg5,
        },
        {
            path: '/comic',
            component: comic,
        }


    ]
export const router=createRouter({
    history:createWebHistory(),
    routes
})