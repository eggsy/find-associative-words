import { createRouter, createWebHistory } from "vue-router";

// Import routes
import HomePage from "./views/Home.vue";
import GamePage from "./views/Game.vue";
import CreatePage from "./views/Create.vue";
import ListPage from "./views/List.vue";

const routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/game",
    component: GamePage,
  },
  {
    path: "/create",
    component: CreatePage,
  },
  {
    path: "/list",
    component: ListPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
