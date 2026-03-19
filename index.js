import mineflayer from "mineflayer";
import express from "express";

const app = express();
const port = process.env.PORT || 8080;
app.get("/", (req, res) => res.send("Bot Aktif!"));
app.listen(port, () => console.log("Web sunucusu " + port + " portunda calisiyor."));

const BOT_USERNAME = "Erdem_Nobetci";
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

let isConnecting = false;
let activeBot = null;

function createBot() {
    // Ayni anda sadece BIR baglanti olmali
    if (isConnecting) {
        console.log("Zaten baglaniliyor, atlaniyor...");
        return;
    }
    isConnecting = true;

    // Eski bot varsa temizle
    if (activeBot) {
        try { activeBot.quit(); } catch(e) {}
        activeBot = null;
    }

    console.log("Bot baglanmaya calisiyor...");
    const bot = mineflayer.createBot(botArgs);
    activeBot = bot;

    // AuthMe icin: spawn olur olmaz hemen login gonder
    bot.once('spawn', () => {
        console.log("Bot spawn oldu.");
        isConnecting = false;

        // Hemen register dene (zaten kayitliysa hata verir ama sorun yok)
        bot.chat("/register " + BOT_PASSWORD + " " + BOT_PASSWORD);

        // 1 saniye sonra login gonder
        setTimeout(() => {
            bot.chat("/login " + BOT_PASSWORD);
            console.log("Login gonderildi.");
        }, 1000);

        // Her 10 saniyede bir hareket et (idle timeout icin)
        const moveInterval = setInterval(() => {
            if (!activeBot || activeBot !== bot) {
                clearInterval(moveInterval);
                return;
            }
            if (bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 300);
            }
        }, 10000);
    });

    bot.on('chat', (username, message) => {
        console.log("[Sohbet] " + username + ": " + message);
    });

    bot.on('error', (err) => {
        console.log("Hata: " + err.message);
    });

    bot.on('kicked', (reason) => {
        console.log("Bot atildi: " + reason);
        activeBot = null;
        isConnecting = false;
        // Atildiktan sonra 30 saniye bekle (sunucunun botu sistemden cikarmasi icin)
        setTimeout(createBot, 30000);
    });

    bot.on('end', (reason) => {
        console.log("Baglanti kesildi: " + reason);
        if (activeBot === bot) {
            activeBot = null;
            isConnecting = false;
            setTimeout(createBot, 20000);
        }
    });
}

createBot();
