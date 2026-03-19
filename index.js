import mineflayer from "mineflayer";
import express from "express";

const app = express();
const port = process.env.PORT || 8080;
app.get("/", (req, res) => res.send("Bot Aktif!"));
app.listen(port, () => console.log("Web sunucusu " + port + " portunda calisiyor."));

const BOT_USERNAME = "ErdemCokHavalıhahaha";
const BOT_PASSWORD = "Erdem123";

const botArgs = {
    host: 'brotula.aternos.host',
    port: 37192,
    username: BOT_USERNAME,
    version: "1.21.1",
    auth: 'offline',
    hideErrors: true,
    connectTimeout: 45000,
    disableChatSigning: true
};

function createBot() {
    console.log("Bot baglanmaya calisiyor...");
    const bot = mineflayer.createBot(botArgs);

    bot.once('spawn', () => {
        console.log("Bot spawn oldu. AuthMe islemi basliyor...");

        // 2 saniye bekle, sonra once register dene
        setTimeout(() => {
            bot.chat("/register " + BOT_PASSWORD + " " + BOT_PASSWORD);
            console.log("Register komutu gonderildi.");
        }, 2000);

        // 4 saniye bekle, sonra login yap (register basarisiz olsa bile login calisir)
        setTimeout(() => {
            bot.chat("/login " + BOT_PASSWORD);
            console.log("Login komutu gonderildi.");
        }, 4000);

        // Her 15 saniyede bir hareket et
        setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                bot.swingArm('right');
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 15000);
    });

    bot.on('chat', (username, message) => {
        console.log("[Sohbet] " + username + ": " + message);
    });

    bot.on('error', (err) => {
        console.log("Hata: " + err.message);
    });

    bot.on('kicked', (reason) => {
        console.log("Bot atildi: " + reason);
        setTimeout(createBot, 20000);
    });

    bot.on('end', (reason) => {
        console.log("Baglanti kesildi: " + reason);
        setTimeout(createBot, 15000);
    });
}

createBot();
