// Import packages
const express = require("express");

const app = express();
app.use(express.json());
require("dotenv/config");
const home = require("./routes/home");

const cors = require("cors");

app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const { Connection, PublicKey, clusterApiUrl } = require("@solana/web3.js");

const connection = new Connection(clusterApiUrl("mainnet-beta"));

app.get("/", (req, res) => {
  res.json("Meme Bot");
});

// Middlewares

// Routes
app.use("/home", home);

// connection
const port = process.env.PORT || 9001;

app.listen(port, () => console.log(`Listening to port ${port}`));

const TelegramBot = require("node-telegram-bot-api");
const ChatGPTService = require("./services/chatgpt.service");

const telegramToken = process.env.TELEGRAM_KEY;

const OpenAI = require("openai").default;
let image_url;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
  // apiKey:"6668176688:AAEjsykJID2MjbTLsVfPGnZuSxZVA3N7bYg"
});

const bot = new TelegramBot(telegramToken, { polling: true });
// Define available commands with icons
const commands = [
  {
    text: "Generate AI Image",
    callback_data: "/BotMeme_bot ask_bot",
    icon: "🎨", // Updated icon
  },

  {
    text: "Renounce Mint",
    callback_data: "/BotMeme_bot nft",
    icon: "✋", // Updated icon
  },
  {
    text: "Linktr",
    callback_data: "/BotMeme_bot airdrop",
    icon: "🔗", // Updated icon
  },
  {
    text: "Website",
    callback_data: "/BotMeme_bot presale",
    icon: "🌍", // Updated icon
  },

  {
    text: "Burn",
    callback_data: "/BotMeme_bot burn",
    icon: "🔥", // Updated icon
  },
];

// Define states
const states = {
  DEFAULT: "default",
  ASKING_QUESTION: "asking_question",
};

// Initialize state
let currentState = states.DEFAULT;

// Listen for any kind of message
bot.on("text", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Check if the message starts with '/'
  if (text.startsWith("/")) {
    // Check if the message is "/start"
    if (
      text === "/dsui" ||
      text === "/start" ||
      text === "/qs" ||
      text === "/start"
    ) {
      // Set state to ASKING_QUESTION
      currentState = states.ASKING_QUESTION;

      // Create a message with buttons and input field
      const responseText = "Please select a command or enter your question:";
      // const options = {
      //   reply_markup: {
      //     inline_keyboard: [
      //       commands.slice(0,4).map((command) => {
      //         return {
      //           text: `${command.icon} ${command.text}`,
      //           callback_data: command.callback_data
      //         };
      //       }),
      //       [
      //         {
      //           text: `${commands[4].icon} ${commands[4].text}`,
      //           callback_data: commands[4].callback_data
      //         }
      //       ]
      //     ],
      //     resize_keyboard: true,
      //     one_time_keyboard: true,
      //   }
      // };

      const options = {
        reply_markup: {
          inline_keyboard: [
            // Hàng thứ nhất với ba nút
            commands.slice(0, 1).map((command) => ({
              text: `${command.icon} ${command.text}`,
              callback_data: command.callback_data,
            })),
            commands.slice(1, 4).map((command) => ({
              text: `${command.icon} ${command.text}`,
              callback_data: command.callback_data,
            })),
            // Hàng thứ hai với hai nút
            commands.slice(4, 5).map((command) => ({
              text: `${command.icon} ${command.text}`,
              callback_data: command.callback_data,
            })),
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      };

      // Send the response message
      bot.sendMessage(chatId, responseText, options);
    } else {
      // Handle other commands
      // ...
    }
  }
});

// Listen for callback queries
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  // Send a reply to the callback query
  if (data === "/BotMeme_bot ask_bot") {
    const responseText = "Enter 'createImg' + the content you want AI to create an image of.";
    const options = {
      reply_markup: {
        force_reply: true,
        input_field_placeholder: "For example,Enter: createImg coin",
      },
    };
    let text = ` <b><i>🔜 Coming soon   </i></b> \n \n`;

    bot.sendMessage(chatId, text, { parse_mode: "HTML" });
    // bot.sendMessage(chatId, responseText, options);
    //    create()
    return;
    //   currentState = states.ASKING_QUESTION;
    currentState = states.DEFAULT;
  } else if (data === "/BotMeme_bot nft") {
    let text = ` <b><i> 🛡️Renounce Mint : ✅ Done   </i></b> \n \n`;

    bot.sendMessage(chatId, text, { parse_mode: "HTML" });
    currentState = states.DEFAULT;
  } else if (data === "/BotMeme_bot airdrop") {
    let text = `https://linktr.ee/dragonsui `;

    bot.sendMessage(chatId, text);
    currentState = states.DEFAULT;
  } else if (data === "/BotMeme_bot presale") {
    //   let text = `🕒 Pre-Sale start time : TBA `
    let text = `✨  https://www.dragononsui.com/ `;

    bot.sendMessage(chatId, text);
    currentState = states.DEFAULT;
  } else if (data === "/BotMeme_bot burn") {
    let text = ` <b><i> 🔥: ✅ Done   </i></b> \n \n`;


    bot.sendMessage(chatId, text, { parse_mode: "HTML" });
    currentState = states.DEFAULT;
  } else {
    let text = `<b>OK
      `;
    bot.sendMessage(chatId, text, { parse_mode: "HTML" });
    currentState = states.DEFAULT;
  }
});

function createImage(params) {
  try {
    bot.on("text", async (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, "Loading...");
      const prompt = msg.text;
      const response = await openai.images.generate({
        prompt,
        n: Number(1),
        size: "512x512",
      });
      image_url = response.data[0].url;
      console.log(image_url);

      bot
        .sendPhoto(chatId, image_url)
        .then(() => {
          bot.sendMessage(chatId, "Image sent successfully");
          console.log("Image sent successfully");
        })
        .catch((error) => {
          console.error("Error sending the image:", error);
        });
    });
  } catch (error) {
    console.log(error);
  }
}

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const chatMsg = msg.text;

  console.log({ chatId });
  console.log({ chatMsg });

  // Check if the message starts with '/create' or 'create'
  if (
    chatMsg &&
    (chatMsg.startsWith("createImg") || chatMsg.startsWith("CreateImg"))
  ) {
    // Extract the prompt from the message
    const prompt = chatMsg.split(" ").slice(1).join(" ");
    bot.sendMessage(chatId, "Creating an AI image. Please wait a moment...");

    await create(chatId, prompt);
  } else if (
    chatMsg &&
    (chatMsg.startsWith("infoxxxx") || chatMsg.startsWith("Info"))
  ) {
    try {
      const chatId = msg.chat.id;
      const walletAddress = chatMsg.split(" ").slice(1).join(" ");
      const publicKey = new PublicKey(walletAddress);
      const balance = await connection.getBalance(publicKey);
      const info = connection.ge(publicKey);
      bot.sendMessage(chatId, "Creating an AI image. Please wait a moment.");
      console.log(info);
   
      bot.sendMessage(
        chatId,

        `Wallet Balance ${walletAddress} is ${balance / 1e9} SOL.`
      );
    } catch (error) {
      bot.sendMessage(chatId, "Error: " + error.message);
    }
  } else {
   
    ChatGPTService.generateCompletion(chatMsg)
      .then((responseMsg) => {
        bot.sendMessage(chatId, responseMsg);
      })
      .catch((error) => {
        console.log("Error:", error);
        // Handle the rate limit error specifically
        if (error instanceof RateLimitError) {
          bot.sendMessage(
            chatId,
            "I've reached my rate limit, please try again in a few seconds."
          );
        } else {
          bot.sendMessage(chatId, "An error occurred, please try again.");
        }
      });
  }
});


async function create(chatId, prompt) {
  try {
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "512x512",
    });
    
    const imageUrl = response.data[0].url; // Ensure this is the correct path
    console.log(imageUrl);

    bot
      .sendPhoto(chatId, imageUrl)
      .then(() => {
        bot.sendMessage(chatId, "Image sent successfully");
        console.log("Image sent successfully");
      })
      .catch((error) => {
        console.error("Error sending the image:", error);
      });
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "Error occurred while generating the image.");
  }
}
