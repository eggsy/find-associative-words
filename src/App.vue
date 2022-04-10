<script lang="ts" setup>
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<template>
  <div
    class="min-h-screen px-4 text-white md:px-0"
    :class="route.path !== '/list' && 'flex items-center justify-center'"
  >
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <div>
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

html,
body {
  animation: color-change 20s ease-in-out infinite;
}

@keyframes color-change {
  0% {
    @apply bg-blue-700;
  }

  25% {
    @apply bg-green-700;
  }

  50% {
    @apply bg-yellow-700;
  }

  75% {
    @apply bg-fuchsia-700;
  }

  100% {
    @apply bg-blue-700;
  }
}
</style>
