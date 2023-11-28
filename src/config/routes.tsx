import { RouteRecordRaw } from "vue-router";
import { Welcome } from "../views/Welcome";

export const routes: RouteRecordRaw[] = [
    { path: '/', redirect: '/welcome' },
    { path: '/welcome', component: Welcome },
]
