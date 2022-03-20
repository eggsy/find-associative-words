import { createApp } from "vue";
import App from "./App.vue";
import { MotionPlugin } from "@vueuse/motion";

// Import router
import Router from "./router";

// Import Tailwind CSS
import "./assets/tailwind.css";

createApp(App).use(MotionPlugin).use(Router).mount("#app");
