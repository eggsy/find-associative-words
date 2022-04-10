<script setup lang="ts">
import { ref } from "vue";

const whichHovered = ref<string | null>(null);
</script>

<template>
  <div
    class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
  >
    <div
      class="flex items-center justify-center w-32 h-32 text-black transition-colors bg-white rounded-full pointer-events-auto"
      :class="{
        'ring-4': whichHovered !== null,
        'ring-red-600': whichHovered === 'red',
        'ring-green-600': whichHovered === 'green',
      }"
    >
      <span class="text-sm opacity-50">Choose Mode</span>
    </div>
  </div>

  <div
    class="absolute inset-0 grid w-screen h-screen text-4xl font-bold uppercase lg:grid-cols-2"
  >
    <router-link
      to="/list"
      class="flex items-center justify-center w-full h-full space-x-2 transition-colors bg-red-500 cursor-pointer hover:bg-red-600 hover:text-white text-white/75"
      @mouseover="whichHovered = 'red'"
      @mouseout="whichHovered = null"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-10 h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>

      <span class="drop-shadow-md">Presenter</span>
    </router-link>

    <router-link
      to="/game"
      class="flex items-center justify-center w-full h-full space-x-2 transition-colors bg-green-500 cursor-pointer hover:bg-green-600 hover:text-white text-white/75"
      @mouseover="whichHovered = 'green'"
      @mouseout="whichHovered = null"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-10 h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
        />
      </svg>

      <span class="drop-shadow-md">Game</span>
    </router-link>
  </div>
</template>
