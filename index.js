import mineflayer from "mineflayer";
import express from "express";

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => res.send("Erdem Bot Nöbette!"));
app.listen(port, () => console.log(`Sunucu aktif.`));

const botArgs = {
    host: '185.107.192.132', 
    port: 37192,
    username: 'ErdemCokYakisikliDegilMi', // Her seferinde ismi biraz değiştir kanka
    version: "1.21.11", // 1.21.11 protokolü için en güvenlisi bu
    hideErrors: true,
    connectTimeout: 45000, // Zaman tanıyoruz
    checkTimeoutInterval: 120000,
    disableChatSigning: true
};

function createBot() {
    console.log("Sızma denemesi başlatıldı...");
    const bot = mineflayer.createBot(botArgs);

    bot.once('spawn', () => {
        console.log("VE ZAFER! Bot içeri sızdı, sayaç donduruldu.");
        
        // Hızlıca şifre
        bot.chat("/login Erdem123");
        
        // SAYAÇ DONDURAN HAREKET
        setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                bot.swingArm('right');
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 15000); 
    });

    bot.on('error', (err) => {
        console.log("Bağlantı takıldı, pes etmek yok.");
    });

    bot.on('end', () => {
        // Aternos bizi atarsa 15 saniye nefes alıp tekrar saldırıyoruz
        setTimeout(createBot, 15000);
    });
}

createBot();
