import mineflayer from "mineflayer";
import express from "express";

const app = express();
const port = process.env.PORT || 8080;
app.get("/", (req, res) => res.send("Bot Aktif!"));
app.listen(port, () => console.log("Web sunucusu " + port + " portunda calisiyor."));

const BOT_USERNAME = "Erdem_Nobetci";
const BOT_PASSWORD = "Erdem123";

const botArgs = {
    host: 'chub.aternos.host',
    port: 37192,
    username: BOT_USERNAME,
    version: "1.21.1",
    auth: 'offline',
    hideErrors: true,
    connectTimeout: 45000,
    disableChatSigning: true,
    keepAlive: true
};

let isConnecting = false;
let activeBot = null;
let reconnectTimer = null;

function scheduleReconnect(delay) {
    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        createBot();
    }, delay);
}

const moves = [
    { forward: true,  back: false, left: false, right: false },
    { forward: false, back: true,  left: false, right: false },
    { forward: false, back: false, left: true,  right: false },
    { forward: false, back: false, left: false, right: true  },
];
let moveIndex = 0;

function doMovement(bot) {
    // Onceki tum hareketleri durdur
    bot.setControlState('forward', false);
    bot.setControlState('back', false);
    bot.setControlState('left', false);
    bot.setControlState('right', false);

    const move = moves[moveIndex % moves.length];
    moveIndex++;

    bot.setControlState('forward', move.forward);
    bot.setControlState('back', move.back);
    bot.setControlState('left', move.left);
    bot.setControlState('right', move.right);

    // 1 saniye yuru sonra dur
    setTimeout(() => {
        bot.setControlState('forward', false);
        bot.setControlState('back', false);
        bot.setControlState('left', false);
        bot.setControlState('right', false);

        // Zıpla
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 300);

        // Kol sallamak
        bot.swingArm('right');
    }, 1000);
}

function createBot() {
    if (isConnecting) return;
    if (activeBot && activeBot.entity) return;

    isConnecting = true;
    activeBot = null;

    console.log("Bot baglanmaya calisiyor...");
    const bot = mineflayer.createBot(botArgs);

    bot.once('spawn', () => {
        console.log("Bot spawn oldu.");
        isConnecting = false;
        activeBot = bot;

        bot.chat("/register " + BOT_PASSWORD + " " + BOT_PASSWORD);
        setTimeout(() => {
            bot.chat("/login " + BOT_PASSWORD);
            console.log("Login gonderildi.");
        }, 1000);

        // Her 8 saniyede bir hareket et
        const moveInterval = setInterval(() => {
            if (activeBot !== bot) {
                clearInterval(moveInterval);
                return;
            }
            if (bot.entity) doMovement(bot);
        }, 8000);
    });

    bot.on('chat', (username, message) => {
        console.log("[Sohbet] " + username + ": " + message);
    });

    bot.on('error', (err) => {
        console.log("Hata: " + err.message);
        isConnecting = false;
    });

    bot.on('kicked', (reason) => {
        const reasonStr = typeof reason === 'object' ? JSON.stringify(reason) : reason;
        console.log("Bot atildi: " + reasonStr);
        isConnecting = false;
        activeBot = null;
        scheduleReconnect(60000);
    });

    bot.on('end', (reason) => {
        console.log("Baglanti kesildi: " + reason);
        if (activeBot === bot) {
            isConnecting = false;
            activeBot = null;
            scheduleReconnect(20000);
        } else {
            isConnecting = false;
        }
    });
}

createBot();
