<template>
  <div class="flex flex-col text-center gap-y-4">
    <h1 class="text-6xl font-semibold">Find Common Words</h1>

    <p class="text-xl opacity-50 md:w-2/3 md:mx-auto">
      An interactive app created by the presenter to play
      <span class="font-bold underline">Find the Associative Meanings</span>
      of a random word!
    </p>

    <router-link
      to="/game"
      class="px-12 py-2 mx-auto transition-colors bg-orange-600 rounded-md w-max hover:bg-orange-700"
    >
      Let's Play!
    </router-link>
  </div>
</template>
