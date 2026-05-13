import axios from "axios";
import express from "express";
const port = process.env.PORT || 5400;
import "dotenv/config";
import { Telegraf } from "telegraf";
import http from "http";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: "https://prayer-bot-beta.vercel.app",
  })
);

app.get("/", (req, res) => {
  res.send("Kibla Server is running...");
});

const bot = new Telegraf("8652946666:AAEMASyrOfM_QYOKmJ3pH8vr8ZFF0mruBIQ");

app.listen(port, "0.0.0.0", () => {
  console.log(`Admin panel running on port ${port}`);
});

bot.start((ctx) => {
  const welcomeMessage = `
🌟 <b>Welcome to Kibla Bot!</b> 🌟

Your digital companion for accurate prayer timings and Islamic guidance. 

<b>What can I do for you?</b>
📍 <b>Prayer Times:</b> Get accurate Salat times for any city worldwide.
🕋 <b>Qibla:</b> Find the direction of the Kaaba (Makkah).
📖 <b>Adhkar:</b> Access your daily morning and evening supplications.

<b>How to use:</b>
Simply type the name of your <b>City</b> (e.g., <i>Jimma</i> or <i>Addis Ababa</i>) and I will provide the current schedule.

Use the menu below or type /help for more options.
  `;

  ctx.reply(welcomeMessage, { parse_mode: "HTML" });
});
bot.telegram.setMyCommands([
  {
    command: "location",
    description: "Get today prayer time using your Location",
  },
  { command: "qibla", description: "Get the Direction of makka" },
  { command: "search", description: "change the prayer  city" },
  { command: "atkhar", description: "Read daily atkar" },
  { command: "profile", description: "personal information" },
]);

// PUT THIS BEFORE bot.launch()
bot.command("qibla", (ctx) => {
  return ctx.reply(
    "🕋 <b>Qibla Finder</b>\n\nTo find the direction of Makkah, click the button below to launch our precision compass.",
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🧭 Launch Compass App",
              web_app: { url: "https://prayer-bot-beta.vercel.app" }, // Use your real Vercel link here
            },
          ],
        ],
      },
    }
  );
});

bot.command("location", (ctx) => {
  const userId = ctx.from.id;
  return ctx.reply("share your location", {
    reply_markup: {
      keyboard: [
        [{ text: "share my location", request_location: true }],
        [{ text: "🔙 Back" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  });
});

bot.on("location", async (ctx) => {
  const { latitude, longitude } = ctx.message.location;
  const locationApi = `https://api.aladhan.com/v1/timings/current?latitude=${latitude}&longitude=${longitude}&method=5&school=0`;
  try {
    const response = await axios.get(locationApi);
    const data = response.data.data;
    let message = `<b>📍 Current Location</b>\n`;
    message += `<code>─────────────────────</code>\n`;

    message += `🌍 <b>Region:</b> ${data.meta.timezone}\n`;
    message += `<code>────────────────────</code>\n`;

    // Using your formatToLocal function we built earlier for better style
    message += ` <b>Fajr:</b>      <code>${data.timings.Fajr}:pm </code>\n`;
    message += `<code>─────────────────────</code>\n`;
    message += ` <b>Dhuhr:</b> <code>${data.timings.Dhuhr}:am</code>\n`;
    message += `<code>─────────────────────</code>\n`;

    message += ` <b>Asr:</b> <code>${data.timings.Asr}:am</code>\n`;
    message += `<code>─────────────────────</code>\n`;

    message += ` <b>Maghrib:</b> <code>${data.timings.Maghrib}:pm</code>\n`;
    message += `<code>─────────────────────</code>\n`;

    message += ` <b>Isha:</b> <code>${data.timings.Isha}:pm</code>`;

    return ctx.reply(message, {
      parse_mode: "HTML",
      reply_markup: { remove_keyboard: true },
    });
  } catch (error) {
    console.error(error);
    ctx.reply("❌ Unable to get  the Location ");
  }
});
//  to get the prayer time based on user location and latitude and longtude

async function getPrayer(city) {
  try {
    const PrayerApi = `https://api.aladhan.com/v1/timingsByAddress?address=${city}&method=5&school=0`;
    const response = await axios.get(PrayerApi);
    const data = response.data.data;

    return data;
  } catch (error) {
    console.error(error);
    console.log("Location has no match, please try again");
    return null;
  }
}
bot.on("text", async (ctx) => {
  const userID = ctx.from.id;
  const city = ctx.message.text.toLowerCase().trim();

  if (city.startsWith("/") || city === "🔙 Back") return;
  if (!isNaN(city)) {
    return ctx.reply(
      "🔢 It looks like you entered a number. Please provide a city name (e.g., 'London') or a Zip Code with a Country (e.g., '1000, ET')!"
    );
  }
  await ctx.sendChatAction("typing");
  const playerCity = await getPrayer(city);
  if (playerCity) {
    const timing = playerCity.timings;
    const meta = playerCity.meta;
    let message = `🏙️ <b>City:</b> ${city}\n`;
    //  let  message = `🌍 <b> City:</b> ${meta.timezone}\n`;

    message += `<code>────────────────────</code>\n`;
    message += `🌍 <b>Region:</b>  ${meta.timezone}\n`;
    message += `<code>─────────────────────</code>\n`;

    message += ` <b>Fajr:</b>     <code>${timing.Fajr}:pm</code>\n`;
    message += `<code>─────────────────────</code>\n`;
    message += ` <b>Dhuhr:</b>    <code>${timing.Dhuhr}:am</code>\n`;
    message += `<code>────────────────────</code>\n`;
    message += ` <b>Asr:</b>      <code>${timing.Asr}:am</code>\n`;
    message += `<code>──────────────────────</code>\n`;
    message += ` <b>Maghrib:</b>  <code>${timing.Maghrib}:pm</code>\n`;
    message += `<code>─────────────────────</code>\n`;
    message += ` <b>Isha:</b>     <code>${timing.Isha}:pm</code>\n`;

    message += `<code>────────────────────</code>\n`;
    message += `<i>Generated by Kibla Bot</i>`;

    return ctx.reply(message, { parse_mode: "HTML" });
  } else {
    ctx.reply("can not find prayer for this city");
  }
});

console.log(`the port is running http://localhost:${port}`);
bot.launch();
