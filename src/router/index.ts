import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/Home.vue";
import Create1 from "@/views/Create1.vue";
import Create2 from "@/views/Create2.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/create/members",
    name: "Create1",
    component: Create1,
  },
  {
    path: "/create/tables",
    name: "Create2",
    component: Create2,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
