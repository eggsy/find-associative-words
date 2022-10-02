<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useSound } from "@vueuse/sound";
import { useWebSocket } from "@vueuse/core";
import { getSocketUrl } from "@/functions/getSocketUrl";
import type { MessageData } from "@server/index";

// Import data
import questions from "../assets/questions";

// Components
import Loading from "@/components/Loading.vue";
import AnswerModal from "@/components/AswerModal.vue";

// Sound
import success from "@/assets/sounds/success.mp3";
import wrong from "@/assets/sounds/wrong.mp3";
import timer from "@/assets/sounds/timer.mp3";

const correctSound = useSound(success);
const wrongSound = useSound(wrong, { volume: 0.5 });
const timerSound = useSound(timer);

const playedQuestions = ref<string[]>([]);
const loadingScreen = ref(true);
const timerValue = ref(10);
const interval = ref();

const modal = reactive({
  revealed: false,
  type: null as "correct" | "wrong" | null,
});

const gameState = reactive({
  question: "",
  guesses: [] as string[],
});

const socket = useWebSocket(getSocketUrl(), {
  autoReconnect: true,

  onConnected() {
    getRandomWord();
    loadingScreen.value = false;
  },

  onError() {
    alert(
      "Error while connecting to the WebSocket server. Are you sure it is running Baki? Dumb."
    );
  },

  onMessage(_, d) {
    const data = JSON.parse(d.data) as MessageData;

    if (data.type === "revealWord" && data.word) {
      guessWord(data.word);
    } else if (data.type === "newGame") {
      getRandomWord();
    } else if (data.type === "startTimer") {
      startTimer();
    }
  },
});

// Reactive Data
const getCurrentQuestion = computed(() => {
  return questions.find((q) => q.question === gameState.question);
});

const updateSocketGameData = () => {
  socket.ws.value?.send(
    JSON.stringify({
      type: "setData",
      word: getCurrentQuestion.value?.question,
      wordList: getCurrentQuestion.value?.answers,
      guessedWords: gameState.guesses,
    })
  );
};

// Functions
const startTimer = () => {
  if (interval.value) {
    clearInterval(interval.value);
    timerSound.stop();
    timerValue.value = 10;
  }

  interval.value = setInterval(() => {
    timerValue.value--;

    if (timerValue.value === 0) {
      clearInterval(interval.value);
      interval.value = null;
      timerSound.play();
      timerValue.value = 10;
    }
  }, 1000);
};

const resetGame = (withWord?: string) => {
  if (interval.value) {
    timerSound.stop();
    clearInterval(interval.value);
    interval.value = null;
    timerValue.value = 10;
  }

  gameState.question = withWord || "";
  gameState.guesses = [];
  updateSocketGameData();
};

const getUnplayedQuestions = computed(() => {
  return questions.filter((q) => !playedQuestions.value.includes(q.question));
});

const getRandomWord = () => {
  const randomBgColors = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
  ];

  document.body.classList.replace(
    document.body.classList.toString().match(/bg-[a-z]+-\d+/g)![0],
    randomBgColors[Math.floor(Math.random() * randomBgColors.length)]
  );

  const unplayedWords = getUnplayedQuestions.value;

  if (unplayedWords.length === 0) return;
  loadingScreen.value = true;

  const randomIndex = Math.floor(Math.random() * unplayedWords.length);
  const newWord = unplayedWords[randomIndex].question;

  resetGame(newWord);
  playedQuestions.value.push(newWord);

  setTimeout(() => {
    loadingScreen.value = false;
  }, 500);
};

const getGuessedWords = computed(() => {
  return gameState.guesses
    ?.map((word) => {
      const wordsMap = getCurrentQuestion.value?.answers;
      const position = (wordsMap?.indexOf(word) || 0) + 1;

      let points = 0;

      if (position === 1) points = 25;
      else if (position === 2) points = 20;
      else if (position === 3) points = 15;
      else if (position === 4) points = 10;
      else points = 5;

      return {
        word,
        points,
      };
    })
    .sort((a, b) => b.points - a.points);
});

const guessWord = (guess: string) => {
  const currentWord = getCurrentQuestion.value;

  const wordsMap = currentWord?.answers;

  if (interval.value) {
    clearInterval(interval.value);
    interval.value = null;
    timerSound.stop();
    timerValue.value = 10;
  }

  if (gameState.guesses.includes(guess)) return;
  else if (wordsMap?.includes(guess)) {
    correctSound.play();

    modal.type = "correct";
    modal.revealed = true;

    setTimeout(() => {
      modal.revealed = false;
    }, 1500);

    gameState.guesses.push(guess);
    updateSocketGameData();
  } else {
    wrongSound.play();

    modal.type = "wrong";
    modal.revealed = true;

    setTimeout(() => {
      modal.revealed = false;
    }, 1500);
  }
};
</script>

<template>
  <transition name="fade" mode="out-in">
    <Loading v-if="loadingScreen === true" />

    <div v-else-if="getUnplayedQuestions.length === 0">
      <h1 class="text-4xl font-bold">🎉 GG! You finished all of the words!</h1>
    </div>

    <header
      v-else
      class="container flex flex-col min-h-screen py-16 mx-auto space-y-16 overflow-hidden min-w-screen"
    >
      <header class="px-8 font-medium text-center uppercase drop-shadow-md">
        <h1 class="text-5xl">{{ gameState.question }}</h1>
        <span class="text-sm text-white/50">
          {{
            (getCurrentQuestion?.answers?.length || 0) -
            gameState.guesses.length
          }}
          words left
        </span>
      </header>

      <div class="w-2/3 mx-auto md:w-full">
        <div class="flex flex-col w-full gap-3 mx-auto">
          <div
            v-for="(word, index) in getCurrentQuestion?.answers"
            :key="`${word}-${index}`"
            class="flex items-center mx-auto justify-between flex-shrink-0 md:w-[30vw] p-4 text-2xl font-bold text-white uppercase transition-all duration-500 rounded-lg ring-2"
            :class="[
              getGuessedWords?.findIndex(
                (item) => item?.word.toLowerCase() === word.toLowerCase()
              ) === -1
                ? 'bg-black ring-black'
                : 'bg-green-600 ring-green-700',
            ]"
          >
            <span
              v-if="
                getGuessedWords.findIndex((item) => item.word === word) !== -1
              "
              class="flex-shrink-0 truncate"
            >
              <span class="text-sm"
                >{{
                  (getCurrentQuestion?.answers.findIndex(
                    (item) => item?.toLowerCase() === word.toLowerCase()
                  ) || 0) + 1
                }}.</span
              >
              {{ word }}
            </span>

            <span v-else class="text-sm">
              {{
                (getCurrentQuestion?.answers.findIndex(
                  (item) => item?.toLowerCase() === word.toLowerCase()
                ) || 0) + 1
              }}.
              <span class="text-2xl">???</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  </transition>

  <!-- Buttons -->
  <teleport to="body">
    <div
      v-if="interval"
      v-motion-pop
      class="fixed flex items-center justify-center w-24 h-24 text-4xl font-bold text-white transition-colors rounded-full top-3 tabular-nums right-3"
      :class="[
        timerValue > 5
          ? 'bg-black ring-white/10'
          : 'bg-red-700 ring-red-700/10',
      ]"
    >
      {{ timerValue }}
    </div>

    <button
      v-if="getUnplayedQuestions.length > 0"
      class="fixed transition-colors left-4 top-2 text-white/50 hover:text-white"
      @click="getRandomWord"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </button>
  </teleport>

  <!-- Modals -->
  <AnswerModal :revealed="modal.revealed" :type="modal.type" />
</template>
