import mineflayer from "mineflayer";
import express from "express";

// --- AYARLAR ---
const HOST = "185.107.192.132"; // Sayısal IP her zaman daha stabildir kanka
const PORT = 37192;
const VERSION = "1.21.11"; // Versiyonu tam eşleşecek şekilde güncelledim
const USERNAME = "Erdemcokyakisikli";
const PASSWORD = "Sifre123";

const RECONNECT_DELAY_MS = 10000;
const ANTI_AFK_INTERVAL_MS = 30000;

let bot = null;
let reconnecting = false;
let antiAfkTimer = null;
let botStatus = "başlatılıyor";
let spawnTime = null;

function log(msg) {
  console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
}

// --- ANTI-AFK MANTIĞI ---
function stopAntiAfk() {
  if (antiAfkTimer) {
    clearInterval(antiAfkTimer);
    antiAfkTimer = null;
  }
}

function startAntiAfk() {
  stopAntiAfk();
  antiAfkTimer = setInterval(() => {
    if (!bot || !bot.entity) return;
    log("Anti-AFK: Zıplıyor ve etrafa bakıyor...");
    bot.setControlState("jump", true);
    setTimeout(() => {
      if (!bot) return;
      bot.setControlState("jump", false);
      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * Math.PI * 0.5;
      bot.look(yaw, pitch, false);
    }, 500);
  }, ANTI_AFK_INTERVAL_MS);
}

// --- BOT OLUŞTURMA ---
function createBot() {
  log(`Bağlantı deneniyor: ${HOST}:${PORT}`);
  botStatus = "bağlanıyor";

  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    version: VERSION,
    // İlk koddaki kritik timeout ayarlarını buraya ekledik:
    connectTimeout: 60000,
    keepAlive: true,
    checkTimeoutInterval: 120000,
    hideErrors: false,
  });

  bot.once("spawn", () => {
    reconnecting = false;
    spawnTime = new Date();
    botStatus = "bağlı";
    log("İŞTE BU! Sonunda içeri sızdık.");

    // Giriş/Kayıt mantığı
    setTimeout(() => {
      if (!bot) return;
      bot.chat(`/register ${PASSWORD} ${PASSWORD}`);
      bot.chat(`/login ${PASSWORD}`);
      log("Giriş komutları gönderildi.");
    }, 5000);

    startAntiAfk();
  });

  // Komutlar ve Chat
  bot.on("chat", (username, message) => {
    if (username === bot.username) return;
    log(`[CHAT] <${username}> ${message}`);

    if (message === "!durum") {
      bot.chat(`Sağlık: ${bot.health.toFixed(1)} | Açlık: ${bot.food}`);
    }
  });

  bot.on("error", (err) => {
    log(`Hata Yakalandı: ${err.message}`);
    botStatus = "hata";
    if (err.message.includes("ETIMEDOUT")) {
      log("Sunucu kapalı veya Render IP'si bloklu.");
    }
  });

  bot.on("end", (reason) => {
    log(`Bağlantı koptu (${reason}). Pes etmek yok, geri geliyoruz!`);
    botStatus = "bağlantı kesildi";
    stopAntiAfk();
    scheduleReconnect();
  });
}

function scheduleReconnect() {
  if (reconnecting) return;
  reconnecting = true;
  setTimeout(() => {
    reconnecting = false; // Flag'i sıfırla ki tekrar bağlanabilsin
    createBot();
  }, RECONNECT_DELAY_MS);
}

// --- WEB SERVER (Render'da Hayatta Kalma) ---
const app = express();
app.get("/", (req, res) => {
  const uptime = spawnTime ? Math.floor((Date.now() - spawnTime.getTime()) / 1000) : 0;
  res.json({
    mesaj: "Erdem'in Botu Render'da Hayatta!",
    durum: botStatus,
    aktif_sure: `${uptime} saniye`,
    can: bot?.health ?? "N/A"
  });
});

// Render'ın verdiği portu kullanmak zorunludur:
const PORT_WEB = process.env.PORT || 3000;
app.listen(PORT_WEB, () => {
  log(`Web sunucusu ${PORT_WEB} portunda aktif.`);
});

// Güvenli Kapanış
process.on("SIGINT", () => {
  log("Kapatılıyor...");
  stopAntiAfk();
  if (bot) bot.quit();
  process.exit(0);
});

createBot();
