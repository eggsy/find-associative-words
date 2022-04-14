<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import words from "../assets/words";

const input = ref("");
const router = useRouter();

const getFilteredWords = computed(() => {
  return words.filter((item) => {
    const actualWord = item.actualWord?.toLowerCase();
    const inputValue = input.value?.toLowerCase();

    return (
      actualWord.includes(inputValue) ||
      item.words.some((word) => word.toLowerCase().includes(inputValue))
    );
  });
});
</script>

<template>
  <div class="w-full py-10 mx-auto sm:w-2/3">
    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
      <h1 class="text-sm font-medium uppercase">
        Available Words ({{ words.length }})
      </h1>

      <button
        class="p-2 text-xs uppercase transition-colors rounded-md hover:bg-gray-100/30 bg-gray-100/10"
        @click="router.push('/')"
      >
        Go back to homepage
      </button>
    </div>

    <p class="mb-6 text-sm opacity-50">
      Words here are set by the project owner, the ones here were pre-defined
      for a special game that is conveyed in a school project. To change the
      words according to your game, please fork
      <a
        href="https://github.com/eggsy/find-associative-words"
        rel="noreferrer"
        target="_blank"
        class="underline"
        >this repo</a
      >
      and change the words file.
    </p>

    <input
      v-model="input"
      class="w-full px-4 py-2 mb-6 transition-colors rounded-md placeholder-white/20 focus:bg-gray-100/20 hover:placeholder-white/30 bg-gray-100/10 focus:outline-none"
      placeholder="Search for a word..."
    />

    <div class="grid w-full gap-4 mx-auto md:grid-cols-2">
      <div
        v-for="(item, index) in getFilteredWords"
        :key="`${item.actualWord}-${index}`"
        class="flex flex-col p-4 space-y-1 uppercase rounded-md drop-shadow-md bg-gray-100/10"
      >
        <h1 class="font-bold uppercase">
          {{ item.actualWord }}
        </h1>

        <div class="flex flex-wrap items-center space-x-2">
          <span class="text-sm opacity-50">{{ item.words.join(", ") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
