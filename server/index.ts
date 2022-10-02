import { WebSocketServer } from "ws";
import { createServer } from "http";
import { openBrowser } from "./functions/openBrowser";

const server = createServer();
const wss = new WebSocketServer({ server });

export interface MessageData {
  type:
    | "revealWord"
    | "setData"
    | "guessWord"
    | "getData"
    | "newGame"
    | "startTimer";
  word?: string;
  wordList?: string[];
  guessedWords?: string[];
}

interface GameData {
  word: string;
  wordList: string[];
  guessedWords: string[];
}

let gameData = {} as GameData;

wss.on("connection", (ws) => {
  ws.on("message", (message, isBinary) => {
    const data: MessageData = isBinary
      ? message
      : JSON.parse(message.toString());

    if (data.type === "getData") {
      ws.send(JSON.stringify({ type: "getData", ...gameData }));
    } else if (data.type === "revealWord") {
      wss.clients.forEach((client) =>
        client.send(JSON.stringify({ type: "revealWord", word: data.word }))
      );
    } else if (data.type === "newGame") {
      wss.clients.forEach((client) =>
        client.send(JSON.stringify({ type: "newGame" }))
      );
    } else if (data.type === "startTimer") {
      wss.clients.forEach((client) =>
        client.send(JSON.stringify({ type: "startTimer" }))
      );
    } else if (data.type === "setData" || data.type === "guessWord") {
      const object: GameData = {
        word: data.word ?? "",
        wordList: data.wordList ?? [],
        guessedWords: data.guessedWords ?? [],
      };

      wss.clients.forEach((client) => {
        client.send(JSON.stringify({ type: "setData", ...object }));
        gameData = object;
      });
    }
  });
});

server.listen(9876);
console.log("⚡️ WebSocket server is running on port 9876");

setTimeout(() => {
  openBrowser();
}, 1500);
