import mineflayer from "mineflayer";
import express from "express";

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => res.send("Nöbetçi Bot Aktif!"));
app.listen(port, () => console.log(`Web sunucusu ${port} portunda aktif.`));

const botArgs = {
    host: '185.107.192.132', 
    port: 37192,
    username: 'Erdem_Reis_V6',
    version: false, 
    hideErrors: false,
    // Aternos'un 'bu bot' dememesi için ek ayarlar:
    connectTimeout: 30000,
    disableChatSigning: true,
    checkTimeoutInterval: 90000
};

function createBot() {
    console.log("Bağlantı kuruluyor... Aternos kapısı zorlanıyor.");
    const bot = mineflayer.createBot(botArgs);

    bot.once('spawn', () => {
        console.log("BİNGO! Railway içeri sızmayı başardı.");
        bot.chat("/login Erdem123");
        
        setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                bot.swingArm('right');
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 15000); // 15 saniyede bir hareket
    });

    bot.on('error', (err) => {
        console.log("Hata Detayı: " + err.message);
        // ECONNRESET alırsak hemen pes etme, 10 saniye bekle ve tekrar dene
    });

    bot.on('end', () => {
        console.log("Bağlantı koptu. 10 saniye sonra tekrar saldırıyoruz!");
        setTimeout(createBot, 10000);
    });
}

createBot();
