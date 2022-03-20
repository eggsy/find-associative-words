<script lang="ts" setup>
import { computed, ref } from "vue";
import words from "../assets/words";

const input = ref("");
const getFilteredWords = computed(() => {
  return words.filter((item) =>
    item.actualWord?.toLowerCase()?.includes(input.value.toLowerCase())
  );
});
</script>

<template>
  <div class="w-full py-10 mx-auto sm:w-2/3 md:w-1/3">
    <h1 class="mb-2 text-2xl font-medium">
      Available Words ({{ words.length }})
    </h1>

    <input
      v-model="input"
      class="w-full px-4 py-2 mb-6 text-black focus:outline-none"
      placeholder="Search for a word..."
    />

    <div class="w-full mx-auto space-y-4">
      <div
        v-for="(item, index) in getFilteredWords"
        :key="`${item.actualWord}-${index}`"
        class="flex flex-col p-4 space-y-1 text-black uppercase bg-gray-100"
      >
        <h1 class="text-lg font-bold">
          {{ item.actualWord }}
        </h1>

        <div class="flex flex-wrap items-center space-x-2">
          <span class="opacity-50">{{ item.words.join(", ") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
