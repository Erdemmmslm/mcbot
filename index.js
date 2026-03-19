import mineflayer from "mineflayer";
import express from "express";

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => res.send("Erdem Bot 7/24 Railway Nöbetinde!"));
app.listen(port, () => console.log(`Web sunucusu aktif.`));

const names = ["ErdemHavali", "Erdem_Reis_V8", "ErdemYakisikli", "Erdem_724_Safe"];
let nameIndex = 0;

function createBot() {
    const currentName = names[nameIndex % names.length];
    console.log(`[${new Date().toLocaleTimeString()}] Bağlantı deneniyor: ${currentName}`);

    const bot = mineflayer.createBot({
        host: '185.107.192.132', 
        port: 37192,
        username: currentName,
        version: "1.21.11", // Protokolü 1.21.11 ile uyumlu hale getirir
        hideErrors: true,
        connectTimeout: 45000,
        disableChatSigning: true,
        checkTimeoutInterval: 90000
    });

    bot.once('spawn', () => {
        console.log("!!! ZAFER !!! Bot sunucuya yerleşti.");
        bot.chat("/login Erdem123");
        
        // SAYAÇ DONDURUCU DÖNGÜ
        setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                bot.swingArm('right');
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 15000);
    });

    bot.once('error', (err) => {
        console.log("Bağlantı takıldı (ECONNRESET). İsim değiştirip tekrar deniyorum...");
        nameIndex++;
    });

    bot.once('end', () => {
        // Sunucu bizi atarsa 5 saniye bekle ve yeni isimle gir
        setTimeout(createBot, 5000);
    });
}

createBot();
