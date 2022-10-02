<script lang="ts" setup>
import { useWebSocket } from "@vueuse/core";
import { computed, reactive } from "vue";
import { getSocketUrl } from "@/functions/getSocketUrl";

const gameStore = reactive({
  question: "",
  answers: [] as string[],
  quesses: [] as string[],
});

const socket = useWebSocket(getSocketUrl(), {
  autoReconnect: true,
  onConnected(ws) {
    ws.send(
      JSON.stringify({
        type: "getData",
      })
    );
  },

  onMessage(ws, e) {
    const data = JSON.parse(e.data);

    if (["getData", "setData", "guessWord"].includes(data.type)) {
      gameStore.question = data.word;
      gameStore.quesses = data.guessedWords;
      gameStore.answers = data.wordList;
    }
  },
});

const hasFinishedQuestions = computed(
  () => gameStore.quesses.length === gameStore.answers.length
);

// Methods
const sendRevealWordWS = (word: string) => {
  socket.send(
    JSON.stringify({
      type: "revealWord",
      word,
    })
  );
};

const sendNewGameWS = () => {
  const object = JSON.stringify({
    type: "newGame",
  });

  if (hasFinishedQuestions.value) {
    socket.send(object);
    return;
  }

  const result = confirm(
    "There's an on going game, do you want to cancel and switch to new one?"
  );

  if (result) socket.send(object);
};

const sendWrongAnswerWS = () => {
  const object = JSON.stringify({
    type: "revealWord",
    word: "123123123123",
  });

  if (!hasFinishedQuestions.value) {
    socket.send(object);
    return;
  }

  const result = confirm(
    "The game is finished, are you sure to post wrong answer signal?"
  );

  if (result) socket.send(object);
};

const sendStartTimerWS = () => {
  socket.send(JSON.stringify({ type: "startTimer" }));
};
</script>

<template>
  <main class="w-[90vw] lg:w-[75vw]">
    <p v-if="!gameStore.question" class="text-center">No game is playing...</p>

    <template v-else>
      <section
        class="flex flex-col w-full gap-1 py-4 mx-auto mb-3 bg-black rounded-lg lg:w-2/6"
      >
        <h1 class="px-4 text-2xl text-center bg-black rounded-lg">
          {{ gameStore.question }}
        </h1>

        <div v-auto-animate class="flex flex-col p-4 space-y-2">
          <button
            v-for="answer in gameStore.answers"
            :key="answer"
            type="button"
            class="w-full px-8 py-4 text-lg text-center transition-colors rounded-lg bg-white/10 hover:bg-white/30"
            :class="{
              'line-through': gameStore.quesses.includes(answer),
            }"
            @click="
              !gameStore.quesses.includes(answer)
                ? sendRevealWordWS(answer)
                : false
            "
          >
            {{ answer }}
          </button>
        </div>
      </section>

      <div class="flex flex-col w-full gap-1 mx-auto text-sm lg:w-2/6">
        <button
          type="button"
          class="px-8 py-4 transition-colors rounded-lg"
          :class="[hasFinishedQuestions ? 'bg-black/10' : 'bg-orange-600']"
          @click="sendStartTimerWS()"
        >
          Start Timer
        </button>

        <button
          type="button"
          class="px-8 py-4 transition-colors rounded-lg"
          :class="[hasFinishedQuestions ? 'bg-black/10' : 'bg-red-600']"
          @click="sendWrongAnswerWS()"
        >
          Wrong Answer
        </button>

        <button
          type="button"
          class="px-8 py-4 transition-colors rounded-lg"
          :class="[
            gameStore.quesses.length === gameStore.answers.length
              ? 'bg-green-600'
              : 'bg-black/10',
          ]"
          @click="sendNewGameWS()"
        >
          New Game
        </button>
      </div>
    </template>
  </main>
</template>
