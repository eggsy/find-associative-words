<script setup lang="ts">
import { reactive, ref } from "vue";

const words = reactive<{ words: { actualWord: string; words: string[] }[] }>({
  words: [],
});

const actualWord = ref("");
const associativeWord = ref("");
const associativeWords = ref<string[]>([]);

// Functions
const saveWord = () => {
  words.words.push({
    actualWord: actualWord.value,
    words: associativeWords.value,
  });

  actualWord.value = "";
  associativeWord.value = "";
  associativeWords.value = [];
};

const addAssociative = () => {
  if (
    associativeWord.value === "" ||
    associativeWords.value.includes(associativeWord.value)
  )
    return;

  associativeWords.value.push(associativeWord.value);
  associativeWord.value = "";
};

const removeAssociative = (word: string) => {
  const filtered = associativeWords.value.filter((item) => item !== word);
  associativeWords.value = filtered;
};
</script>

<template>
  <div class="container mx-auto space-y-12">
    <h1 class="text-xl font-bold text-center">Create Words</h1>

    <div class="flex items-start justify-between w-[70vw] gap-16">
      <div class="flex flex-col w-1/2 gap-y-4">
        <input v-model="actualWord" placeholder="Type a word" type="text" />

        <div class="flex flex-col w-full gap-y-2">
          <input
            v-model="associativeWord"
            placeholder="What do you think of it?"
            type="text"
            @keydown.enter="addAssociative()"
          />

          <div class="flex flex-wrap items-center w-full gap-2">
            <button
              v-for="(word, index) in associativeWords"
              :key="`${word}-${index}`"
              type="button"
              class="px-2 py-1 bg-blue-500"
              @click="removeAssociative(word)"
            >
              {{ word }}
            </button>
          </div>
        </div>

        <button
          type="button"
          class="px-8 py-2 text-white transition-colors bg-yellow-600 rounded-md hover:bg-yellow-700"
          @click="saveWord"
        >
          Save
        </button>
      </div>

      <div class="w-1/2 max-h-[70vh]">
        <pre class="p-4 bg-gray-900">
        {{ JSON.stringify(words.words, null, 2) }}
      </pre
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
input {
  @apply appearance-none px-4 py-2 w-full text-black focus:outline-none;
}
</style>
