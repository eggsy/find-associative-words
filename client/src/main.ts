import { createApp } from "vue";
import App from "./App.vue";
import { MotionPlugin } from "@vueuse/motion";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";

// Import router
import Router from "./router";

// Import Tailwind CSS
import "./assets/tailwind.css";

createApp(App)
  .use(autoAnimatePlugin)
  .use(MotionPlugin)
  .use(Router)
  .mount("#app");
