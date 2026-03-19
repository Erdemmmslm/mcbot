import mineflayer from "mineflayer";
import express from "express";

const app = express();
const port = process.env.PORT || 8080;
app.get("/", (req, res) => res.send("Erdem Hayalet Nöbetçi Aktif!"));
app.listen(port);

const botArgs = {
    host: '185.107.192.132', 
    port: 37192,
    version: "1.21.11", // Aternos 1.21.11 ile en uyumlu protokol 
    hideErrors: true,
    connectTimeout: 60000,
    disableChatSigning: true,
    checkTimeoutInterval: 120000
};

function createBot() {
    // Aternos'un isim banını aşmak için rastgele isimler 
    const randomName = "Erdem_" + Math.floor(Math.random() * 9999);
    console.log(`[${new Date().toLocaleTimeString()}] Sızma deneniyor: ${randomName}`);

    const bot = mineflayer.createBot({ ...botArgs, username: randomName });

    bot.once('spawn', () => {
        console.log("!!! ZAFER !!! Sunucuya sızıldı ve sayaç donduruldu."); [cite: 1, 11]
        bot.chat("/login Erdem123"); [cite: 1, 11]
        
        // Sayaç donduran 'Gerçek Oyuncu' simülasyonu 
        setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                bot.swingArm('right');
                setTimeout(() => bot.setControlState('jump', false), 500);
                console.log("Aktiflik sinyali gönderildi..."); [cite: 1, 11]
            }
        }, 15000);
    });

    bot.on('error', (err) => {
        console.log("Kapı kapalı (ECONNRESET). 20 saniye sonra farklı kimlikle tekrar..."); [cite: 8, 13]
    });

    bot.on('end', () => {
        // Aternos bizi atarsa biraz bekleyip tekrar dalıyoruz
        setTimeout(createBot, 20000);
    });
}

createBot();
