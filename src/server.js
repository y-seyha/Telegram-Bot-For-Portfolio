import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const PORT = process.env.PORT || 5000;

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  const text = `New Contact Message:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      },
    );

    const data = await response.json();
    if (data.ok) {
      res.status(200).json({ message: "Message sent to Telegram!" });
    } else {
      res.status(500).json({ message: "Telegram API error" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
