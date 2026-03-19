import mineflayer from "mineflayer";
import express from "express";

const HOST = "Babapirolartowny.aternos.me";
const PORT = 37192;
const USERNAME = "ErdeminHavliBotu";
const PASSWORD = "Sifre123";

// SÜRÜMÜ OTOMATİK TANIMASI İÇİN "false" YAPTIK
const VERSION = false; 

const app = express();
app.get("/", (req, res) => res.send("Bot Aktif ve Nöbette!"));
app.listen(process.env.PORT || 3000);

function createBot() {
  console.log(`[${new Date().toLocaleString()}] Sunucuya bağlanılıyor...`);
  
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    version: VERSION, // Otomatik tanıma modu
  });

  bot.once("spawn", () => {
    console.log("BAŞARDIK! Bot içeri girdi.");
    
    // Giriş/Kayıt komutları
    setTimeout(() => {
      bot.chat(`/register ${PASSWORD} ${PASSWORD}`);
      bot.chat(`/login ${PASSWORD}`);
    }, 3000);

    // AFK kalmamak için zıplama
    setInterval(() => {
      if (bot.entity) {
        bot.setControlState("jump", true);
        setTimeout(() => bot.setControlState("jump", false), 500);
      }
    }, 30000);
  });

  bot.on("error", (err) => {
    console.log("Hata oluştu:", err.message);
  });

  bot.on("end", () => {
    console.log("Bağlantı koptu, 15 saniye içinde tekrar denenecek...");
    setTimeout(createBot, 15000);
  });
}

createBot();
