import mineflayer from "mineflayer";
import express from "express";

// --- Express Sunucusu (Railway için zorunlu) ---
const app = express();
const port = process.env.PORT || 8080;
app.get("/", (req, res) => res.send("Bot Aktif!"));
app.listen(port, () => console.log(`Web sunucusu ${port} portunda çalışıyor.`));

// --- Bot Ayarları ---
const botArgs = {
    host: '185.107.192.132',
    port: 37192,
    username: 'Erdem_Nobetci',
    version: "1.21.1",
    auth: 'offline',
    hideErrors: true,
    connectTimeout: 45000,
    disableChatSigning: true
};

// --- Bot Oluşturma Fonksiyonu ---
function createBot() {
    console.log("Bot bağlanmaya çalışıyor...");
    const bot = mineflayer.createBot(botArgs);

    bot.once('login', () => {
        console.log("Sunucuya giriş yapıldı.");
    });

    bot.once('spawn', () => {
        console.log("Bot spawn oldu. Login komutu gönderiliyor...");

        // AuthMe için 2 saniye bekle
        setTimeout(() => {
            bot.chat("/login Erdem123");
            console.log("Login komutu gönderildi.");
        }, 2000);

        // Her 15 saniyede bir hareket et (idle timeout engellemek için)
        setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                bot.swingArm('right');
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 15000);
    });

    bot.on('chat', (username, message) => {
        console.log(`[Sohbet] ${username}: ${message}`);
    });

    bot.on('error', (err) => {
        console.log("Hata oluştu: " + err.message);
    });

    bot.on('kicked', (reason) => {
        console.log("Bot atıldı. Sebep: " + reason);
        setTimeout(createBot, 20000);
    });

    bot.on('end', (reason) => {
        console.log("Bağlantı kesildi. Sebep: " + reason);
        setTimeout(createBot, 15000);
    });
}

// --- Botu Başlat ---
createBot();
