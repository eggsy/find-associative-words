<script setup lang="ts">
import { useConfirmDialog } from "@vueuse/core";
import { watch } from "vue";
const { isRevealed, reveal, confirm, onReveal } = useConfirmDialog();

const props = defineProps({
  revealed: {
    type: Boolean,
    default: false,
  },
});

watch(
  () => props.revealed,
  (value) => {
    if (value === true) reveal();
    else confirm();
  },
  { immediate: true }
);
</script>

<template>
  <teleport to="body">
    <div v-if="isRevealed" class="fixed inset-x-0 bottom-0 text-center">
      <div v-motion-pop class="px-16 py-8 bg-red-600 shadow-md">
        <span class="text-6xl font-bold text-white uppercase drop-shadow-md">
          Try again!
        </span>
      </div>
    </div>
  </teleport>
</template>
