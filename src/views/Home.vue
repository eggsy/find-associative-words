<template>
  <div class="flex flex-col text-center gap-y-4">
    <h1 class="text-6xl font-semibold">Find Associative Words</h1>

    <p class="text-xl opacity-50 md:w-2/3 md:mx-auto">
      An interactive app created by the presenter to play "find associative
      words" of a random word! Check the rules
      <a
        href="https://github.com/eggsy/find-associative-words#rules--how-to-play"
        target="_blank"
        rel="noreferrer"
        class="underline"
        >here</a
      >!
    </p>

    <router-link
      to="/game"
      class="px-12 py-2 mx-auto transition-colors bg-orange-600 rounded-md w-max hover:bg-orange-700"
    >
      Let's Play!
    </router-link>
  </div>
</template>
