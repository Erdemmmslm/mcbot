import mineflayer from "mineflayer";
import express from "express";

const app = express();
const port = process.env.PORT || 8080;
app.get("/", (req, res) => res.send("Erdem Bot 7/24 Aktif!"));
app.listen(port);

const botArgs = {
    host: '185.107.192.132', 
    port: 37192,
    username: 'Erdem_Via_Bot',
    version: "1.21.1", // ViaVersion yüklüyse bu protokolü sunucu kabul eder
    hideErrors: true,
    connectTimeout: 45000,
    disableChatSigning: true
};

function createBot() {
    console.log("ViaVersion kapısı zorlanıyor...");
    const bot = mineflayer.createBot(botArgs);

    bot.once('spawn', () => {
        console.log("ZAFER! Bot sunucuya sızdı.");
        bot.chat("/login Erdem123");
        
        // Sayaç dondurma hareketleri
        setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                bot.swingArm('right');
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 15000);
    });

    bot.on('error', (err) => {
        // Loglarda gördüğümüz ECONNRESET burada yakalanır
        console.log("Hata: " + err.message); 
    });

    bot.on('end', () => {
        console.log("Bağlantı koptu, tekrar deneniyor...");
        setTimeout(createBot, 10000);
    });
}

createBot();
