import mineflayer from "mineflayer";
import express from "express";

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => res.send("Erdem Bot 7/24 Görevde!"));
app.listen(port, () => console.log(`Web sunucusu ${port} portunda aktif.`));

const botArgs = {
    host: '185.107.192.132', 
    port: 37192,
    username: 'Erdem_Global_724',
    // OTOMATİK SÜRÜM YERİNE SABİT PROTOKOL
    version: "1.21.11", 
    hideErrors: false,
    connectTimeout: 30000,
    disableChatSigning: true
};

function createBot() {
    console.log("Bağlantı kuruluyor... 1.21.11 uyumu zorlanıyor.");
    const bot = mineflayer.createBot(botArgs);

    bot.once('spawn', () => {
        console.log("MÜJDE! Bot sunucuya sızdı ve sayaç donduruldu.");
        bot.chat("/login Erdem123");
        
        // SAYAÇ DONDURAN HAREKET DÖNGÜSÜ
        setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                bot.swingArm('right');
                setTimeout(() => bot.setControlState('jump', false), 500);
                console.log("Sayaç sıfırlama sinyali gönderildi.");
            }
        }, 15000); 
    });

    bot.on('error', (err) => {
        console.log("Hata Detayı: " + err.message);
    });

    bot.on('end', () => {
        console.log("Bağlantı koptu. 10 saniye sonra tekrar sızılıyor...");
        setTimeout(createBot, 10000);
    });
}

createBot();
