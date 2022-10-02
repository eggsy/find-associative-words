# Find Associative Words v2

<p align="center">
  <img src="./client/public/demo.png" alt="demo of the game" />
</p>

A _Family Feud-like_ game which supports real-time connection! [Checkout the public (old) version here](https://associative-words.netlify.app/). For now, this game can't be publicly shared since it is currently a **self-hosted** game, but in the future, I might add ability to create accounts, quizzes and playing them in your classroom, activity or somewhere else.

### Self-hosting

1. Clone this repository:
   - `git clone -b socket https://github.com/eggsy/find-associative-words.git`
   - `gh repo clone eggsy/find-associative-words -- -b socket`
2. Change the questions in `client/src/assets/questions.ts`.
3. Run the app in development mode:
   - `npm run dev`
   - `yarn dev`
   - `pnpm dev`
4. Read the QR code from your controller device (e.g. phone) and go to control page (you can also access this page from your server device).
5. Try the following:
   1. Click on answers to reveal them.
   2. Start a timer and wait for it to finish.
   3. Send wrong answer signal.
   4. Move to next questions.
6. If everything works out, build the app:
   - `npm run build`
   - `yarn build`
   - `pnpm build`
7. To play the game, just run:
   - `npm run start`
   - `yarn start`
   - `pnpm start`

## License

MIT License © 2022 [Abdulbaki "EGGSY" Dursun](https://github.com/eggsy)
