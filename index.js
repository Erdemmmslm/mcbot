import mineflayer from "mineflayer";
import express from "express";

const app = express();
const port = process.env.PORT || 8080;

// Railway'in botu "uyuyor" sanmaması için küçük bir web sunucusu
app.get("/", (req, res) => res.send("Erdem Bot 7/24 Railway Nöbetinde!"));
app.listen(port, () => console.log(`Web sunucusu ${port} portunda aktif.`));

const botArgs = {
    host: '185.107.192.132', 
    port: 37192,
    username: 'ErdemCokYakisikli',
    version: false, // 1.21.11 uyumu için otomatik sürüm
    hideErrors: true
};

function createBot() {
    console.log("Bağlantı kuruluyor... Sayaç dondurma operasyonu.");
    const bot = mineflayer.createBot(botArgs);

    bot.once('spawn', () => {
        console.log("ZAFER! Bot sunucuya yerleşti ve ÇIKMAYACAK.");
        
        // AuthMe Şifresi
        setTimeout(() => {
            bot.chat("/login Erdem123");
            bot.chat("/register Erdem123 Erdem123");
        }, 3000);

        // --- 20 SANİYEDE BİR AFK KORUMASI ---
        // Bu döngü bot içeride olduğu sürece hiç durmaz
        setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                bot.swingArm('right'); // Kol salla (Aternos'u kandır)
                setTimeout(() => bot.setControlState('jump', false), 500);
                console.log("Aktiflik sinyali gönderildi, sayaç durduruldu.");
            }
        }, 20000);
    });

    // Eğer sunucu botu atarsa (Restart vb.), hemen geri dal!
    bot.on('end', () => {
        console.log("Bağlantı koptu! 10 saniye içinde tekrar sızılıyor...");
        setTimeout(createBot, 10000);
    });

    bot.on('error', (err) => {
        console.log("Hata oluştu, ama pes etmek yok: " + err.message);
    });
}

createBot();
