<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useSound } from "@vueuse/sound";

// Import data
import words from "../assets/words";

// Components
import Loading from "../components/Loading.vue";
import Correct from "../components/Modals/Correct.vue";
import Wrong from "../components/Modals/Wrong.vue";

// Sound
import success from "../assets/sounds/success.mp3";
import wrong from "../assets/sounds/wrong.mp3";

const correctSound = useSound(success);
const wrongSound = useSound(wrong, { volume: 0.5 });

enum GameState {
  NOT_STARTED,
  ONGOING,
  FINISHED,
}

const loadingScreen = ref(true);
const guessValue = ref("");

const modals = reactive({
  correct: false,
  wrong: false,
});

const gameState = reactive<{
  currentWord: string;
  state: GameState;
  guessedWords: string[];
}>({
  currentWord: "",
  state: GameState.NOT_STARTED,
  guessedWords: [],
});

// Lifecycle Hooks
onMounted(() => {
  getRandomWord();

  setTimeout(() => {
    loadingScreen.value = false;
  }, 1000);
});

// Reactive Data
const getCurrentWord = computed(() => {
  return words.find((word) => word.actualWord === gameState.currentWord);
});

// Functions
const resetGame = (withWord?: string) => {
  gameState.currentWord = withWord || "";
  gameState.guessedWords = [];
  gameState.state = GameState.NOT_STARTED;
};

const setPlaceholder = (e: Event) => {
  const target = e.target as HTMLInputElement;

  if (target.placeholder === "") {
    target.placeholder = "Enter your guess";
  } else {
    target.placeholder = "";
  }
};

const getRandomWord = () => {
  if (gameState.state === GameState.ONGOING)
    return alert(
      "Are you sure to cancel the current game and start a new one?"
    );

  loadingScreen.value = true;

  const randomIndex = Math.floor(Math.random() * words.length);
  resetGame(words[randomIndex].actualWord);

  setTimeout(() => {
    loadingScreen.value = false;
  }, 500);
};

const getGuessedWords = computed(() => {
  return gameState.guessedWords
    ?.map((word) => {
      const wordsMap = getCurrentWord.value?.words?.map((w) => w.toLowerCase());
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

const revealWord = () => {
  const currentWords = getCurrentWord.value?.words;

  const filteredWords =
    currentWords?.filter(
      (word, index) =>
        index !== 0 &&
        currentWords.some((cWord) =>
          cWord.toLowerCase().includes(word.toLowerCase())
        )
    ) || [];

  if (filteredWords.length < 1) return;

  const randomWord = Math.floor(Math.random() * filteredWords.length);
  guessValue.value = filteredWords[randomWord];
  guessWord();
  guessValue.value = "";
};

const guessWord = () => {
  const currentWord = getCurrentWord.value;
  const guess = guessValue.value?.toLowerCase() || "";

  const wordsMap = currentWord?.words?.map((word) => word.toLowerCase());

  console.log(wordsMap, guess);

  if (gameState.guessedWords.includes(guess)) return;
  else if (wordsMap?.includes(guess)) {
    correctSound.play();

    modals.wrong = false;
    modals.correct = true;

    guessValue.value = "";
    gameState.guessedWords.push(guess);

    setTimeout(() => {
      if (gameState.guessedWords.length === wordsMap.length) {
        const value = confirm(
          "You have found all of the words, do you want to continue?"
        );

        if (value) getRandomWord();
      }
    }, 1500);
  } else {
    wrongSound.play();

    modals.correct = false;
    modals.wrong = true;
  }

  setTimeout(() => {
    modals.correct = false;
    modals.wrong = false;
  }, 1500);
};
</script>

<template>
  <transition name="fade" mode="out-in">
    <Loading v-if="loadingScreen === true"></Loading>

    <div
      v-else
      class="container flex flex-col justify-between w-screen h-screen py-16 mx-auto space-y-16 overflow-hidden"
    >
      <div class="font-bold text-center uppercase drop-shadow-lg">
        <h1 class="text-6xl">{{ gameState.currentWord }}</h1>
        <span class="text-sm">
          {{
            (getCurrentWord?.words?.length || 0) - gameState.guessedWords.length
          }}
          words left
        </span>
      </div>

      <div class="w-2/3 mx-auto md:w-1/3">
        <div class="flex flex-col items-center w-full gap-2 mx-auto">
          <div v-if="getGuessedWords.length === 0">
            <div class="text-center text-white opacity-50">
              You haven't guessed any word yet!
            </div>
          </div>

          <div
            v-motion-pop
            v-for="(word, index) in getGuessedWords"
            :key="`${word}-${index}`"
            class="flex items-center justify-between w-full p-4 text-2xl font-bold uppercase"
            :class="{
              'bg-gray-100 text-black': index % 2 !== 0,
              'bg-black text-white': index % 2 === 0,
            }"
          >
            <span class="truncate">
              <span class="text-sm">
                {{
                  (getCurrentWord?.words.findIndex(
                    (item) => item?.toLowerCase() === word.word?.toLowerCase()
                  ) || 0) + 1
                }}.
              </span>
              {{ word.word }}
            </span>
            <span>{{ word.points }}</span>
          </div>
        </div>
      </div>

      <div class="w-2/3 mx-auto md:w-1/3">
        <input
          v-model="guessValue"
          type="text"
          autocomplete="false"
          placeholder="Type your guess here"
          class="w-full px-4 py-2 text-xl text-center text-white uppercase transition-colors bg-transparent border-b-2 appearance-none focus:border-gray-200 placeholder-white/40 border-gray-200/40 focus:outline-none"
          @focus="setPlaceholder"
          @blur="setPlaceholder"
          @keydown.enter="guessWord"
        />
      </div>
    </div>
  </transition>

  <!-- Buttons -->
  <teleport to="body">
    <div class="fixed flex items-center space-x-4 top-2 left-2">
      <button
        class="transition-colors text-white/50 hover:text-white"
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

      <button
        class="transition-colors text-white/50 hover:text-white"
        @click="revealWord"
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
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      </button>
    </div>
  </teleport>

  <!-- Modals -->
  <Correct :revealed="modals.correct" />
  <Wrong :revealed="modals.wrong" />
</template>
