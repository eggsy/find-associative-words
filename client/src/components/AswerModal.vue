<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { MotionVariants, useMotion } from "@vueuse/motion";

const target = ref<HTMLElement>();
const props = defineProps<{
  revealed?: boolean;
  type: "correct" | "wrong" | null;
}>();

const variants = ref<MotionVariants>({
  initial: {
    opacity: 0,
    scale: 0,
  },
  animateIn: {
    opacity: 1,
    scale: 1,
  },
});

const motionInstance = useMotion(target, variants);
const isAnimationPlaying = computed(
  () => (motionInstance.motionProperties as { scale: number }).scale !== 0
);

watch(
  () => props.revealed,
  (value) => {
    if (value === true) {
      motionInstance.apply("animateIn");
    } else {
      motionInstance.apply("initial");
    }
  },
  { immediate: true }
);
</script>

<template>
  <teleport to="body">
    <div
      class="fixed inset-0 flex items-center justify-center transition-colors pointer-events-none"
      :class="{
        'bg-black/50': isAnimationPlaying,
      }"
    >
      <div
        ref="target"
        class="flex items-center justify-center p-8 rounded-full ring-4 ring-white/25 drop-shadow-sm"
        :class="
          type === 'correct'
            ? 'text-green-900 bg-green-600'
            : 'text-red-900 bg-red-600'
        "
      >
        <svg
          v-if="type === 'correct'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-24 h-24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>

        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-24 h-24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
  </teleport>
</template>
