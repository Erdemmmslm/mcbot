import mineflayer from "mineflayer";
import express from "express";

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => res.send("Bot Aktif!"));
app.listen(port, () => console.log("Web sunucusu calisiyor."));

const botArgs = {
    host: '185.107.192.132', 
    port: 37192,
    username: 'Erdem_Reis_V10',
    version: "1.21.11",
    hideErrors: true,
    connectTimeout: 45000,
    disableChatSigning: true,
    checkTimeoutInterval: 90000
};

function createBot() {
    console.log("Sunucuya baglaniliyor...");
    const bot = mineflayer.createBot(botArgs);

    bot.once('spawn', () => {
        console.log("ZAFER! Bot iceride, sayac donduruldu.");
        bot.chat("/login Erdem123");
        
        setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                bot.swingArm('right');
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 15000);
    });

    bot.on('error', (err) => {
        console.log("Hata: " + err.message);
    });

    bot.on('end', () => {
        console.log("Baglanti koptu, tekrar deneniyor...");
        setTimeout(createBot, 10000);
    });
}

createBot();
