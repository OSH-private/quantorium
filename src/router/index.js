import {createWebHistory,createRouter} from "vue-router";
import Home from "../pages/Home.vue";
import Pg1 from "../pages/Zavod.vue";
import Pg2 from "../pages/Q1.vue";
import Pg3 from "../pages/Q2.vue";
import Pg4 from "../pages/Q3.vue";
import Pg5 from "../pages/FINAL.vue";
import comic from "../pages/comic.vue";
import P1 from "../pages/P1.vue";
import P4 from "../pages/P4.vue";
import P3 from "../pages/P3.vue";
import P2 from "../pages/P2.vue";
import garage from "../pages/garage.vue";
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
            path: '/garage',
            component: garage
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
            path: '/p4',
            component: P4,
        },
        {
            path: '/P3',
            component: P3,
        },
        {
            path: '/P2',
            component: P2,
        },
        {
            path: '/P1',
            component: P1,
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