const TelegramApi = require("node-telegram-bot-api");

const api = "5326631894:AAGVvrPYHUmfY5vCzAfC4GJ2DbdsIpFLtAk";
const chats = {};
const gameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "1", callback_data: "1" },
        { text: "2", callback_data: "2" },
        { text: "3", callback_data: "3" },
      ],
      [
        { text: "4", callback_data: "4" },
        { text: "5", callback_data: "5" },
        { text: "6", callback_data: "6" },
      ],
      [
        { text: "7", callback_data: "7" },
        { text: "8", callback_data: "8" },
        { text: "9", callback_data: "9" },
      ],
      [{ text: "0", callback_data: "0" }],
    ],
  }),
};
const again = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Qaytadan boshlash', callback_data: '/again'}]
        ]
    })
}
const bot = new TelegramApi(api, { polling: true });
bot.setMyCommands([
  { command: "/start", description: "Boshlang'ich uchrashuv" },
  { command: "/info", description: "Siz haqingizda malumot" },
  { command: "/game", description: "Play Game" },
]);

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, "0 dan 9 gacha son o'yladim");
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  return bot.sendMessage(chatId, "Sonni toping", gameOptions);
};
const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
      await bot.sendMessage(chatId, "Xush kelibsiz");
      return bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/ccd/a11/ccda113b-0d80-39db-a585-faa8dba01bb6/1.webp"
      );
    }
    if (text === "/info") {
      return bot.sendMessage(chatId, `Sizni ismingiz ${msg.from.first_name}`);
    }
    if (text === "/game") {
      return startGame(chatId)
    }
    return bot.sendMessage(chatId, "Man bu narsani bilmayman");
  });

  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if(data === '/again') {
        return startGame(chatId)
    }
    if (data == chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Tabrik siz to'g'ri topdingiz ${chats[chatId]}`
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Afsus, topolmadiz to'g'ri javob: ${chats[chatId]}`,
        again
      );
    }
  });
};

start();
