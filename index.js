import mineflayer from "mineflayer";
import express from "express";

const HOST = "Babapirolartowny.aternos.me";
const PORT = 37192;
const VERSION = "1.21.11";
const USERNAME = "ERdemcokyakiiskli";
const PASSWORD = "Sifre123";
const RECONNECT_DELAY_MS = 10000;
const ANTI_AFK_INTERVAL_MS = 30000;

let bot = null;
let reconnecting = false;
let antiAfkTimer = null;
let botStatus = "starting";
let spawnTime = null;

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

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
    log("Anti-AFK: jumping and looking around");
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

function createBot() {
  log(`Connecting to ${HOST}:${PORT} (Minecraft ${VERSION})...`);
  botStatus = "connecting";

  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    version: VERSION,
    hideErrors: false,
  });

  bot.once("spawn", () => {
    reconnecting = false;
    spawnTime = new Date();
    botStatus = "connected";
    log(`Bot spawned as ${bot.username}`);

    setTimeout(() => {
      if (!bot) return;
      bot.chat(`/login ${PASSWORD}`);
      log("Sent /login command");
      setTimeout(() => {
        if (!bot) return;
        bot.chat(`/register ${PASSWORD} ${PASSWORD}`);
        log("Sent /register command");
      }, 1500);
    }, 2000);

    startAntiAfk();
  });

  bot.on("chat", (username, message) => {
    if (username === bot.username) return;
    log(`[CHAT] <${username}> ${message}`);

    if (message === "!ping") {
      bot.chat("Pong!");
    } else if (message === "!pos") {
      const pos = bot.entity.position;
      bot.chat(
        `X=${pos.x.toFixed(1)} Y=${pos.y.toFixed(1)} Z=${pos.z.toFixed(1)}`,
      );
    } else if (message === "!health") {
      bot.chat(`Health: ${bot.health.toFixed(1)}/20, Food: ${bot.food}/20`);
    } else if (message === "!help") {
      bot.chat("Commands: !ping, !pos, !health, !help");
    }
  });

  bot.on("health", () => {
    if (bot.health <= 5) {
      log(`Warning: Low health! (${bot.health}/20)`);
    }
  });

  bot.on("kicked", (reason) => {
    log(`Bot was kicked: ${reason}`);
    botStatus = "kicked";
    stopAntiAfk();
  });

  bot.on("error", (err) => {
    log(`Bot error: ${err.message}`);
    botStatus = "error";
  });

  bot.on("end", (reason) => {
    log(`Bot disconnected: ${reason}`);
    botStatus = "disconnected";
    stopAntiAfk();
    scheduleReconnect();
  });
}

function scheduleReconnect() {
  if (reconnecting) return;
  reconnecting = true;
  log(`Reconnecting in ${RECONNECT_DELAY_MS / 1000} seconds...`);
  setTimeout(() => {
    createBot();
  }, RECONNECT_DELAY_MS);
}

const app = express();

app.get("/", (_req, res) => {
  const uptime = spawnTime
    ? Math.floor((Date.now() - spawnTime.getTime()) / 1000)
    : null;
  res.json({
    status: botStatus,
    username: USERNAME,
    server: `${HOST}:${PORT}`,
    version: VERSION,
    uptimeSeconds: uptime,
    health: bot?.health ?? null,
    food: bot?.food ?? null,
  });
});

app.listen(3000, () => {
  log("Keep-alive Express server running on port 3000");
});

process.on("SIGINT", () => {
  log("Shutting down...");
  stopAntiAfk();
  if (bot) {
    bot.removeAllListeners("end");
    bot.quit("Bot shutting down");
  }
  process.exit(0);
});

createBot();
