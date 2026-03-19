const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// Render'ın "yaşıyor mu?" kontrolü için web sunucusu
app.get("/", (req, res) => { 
    res.send("Bot 7/24 Nöbetçi Modunda! Erdemliler Şehri Güvende."); 
});

const port = process.env.PORT || 3000;
app.listen(port, () => { 
    console.log(`Web sunucusu ${port} portunda hazır.`); 
});

// Bot Ayarları
const botArgs = {
    host: 'Babapirolartowny.aternos.me',
    port: 37192,
    username: 'ERdem_cok_yakisikli',
    version: '1.21.1'
};

let bot;

function createMyBot() {
    bot = mineflayer.createBot(botArgs);

    bot.on('spawn', () => {
        console.log("Bot sunucuya girdi! Nöbet başladı.");
        // AFK kalmamak için 45 saniyede bir zıpla
        setInterval(() => {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
        }, 45000);
    });

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        if (message === '!durum') {
            bot.chat("Nöbetteyim kanka, sıkıntı yok!");
        }
    });

    bot.on('error', (err) => console.log("Hata oluştu:", err));

    // Bot düşerse 10 saniye sonra otomatik geri girsin
    bot.on('end', () => {
        console.log("Bağlantı kesildi. 10 saniye içinde tekrar denenecek...");
        setTimeout(createMyBot, 10000);
    });
}

createMyBot();
