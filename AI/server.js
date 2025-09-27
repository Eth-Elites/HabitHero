import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import express from "express";

dotenv.config();
const app = express();
app.use(express.json());
const modelName = process.env.GEMINI_MODEL
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model });

app.post("/motivate", async (req, res) => {
  try {
    const { habit, progress, description } = req.body;

    const prompt = `
You are HabitHero AI coach. 
Habit: ${habit}
Progress: ${progress}
Description: ${description}

Generate a short motivational message <= 50 characters. 
Keep it positive, celebratory, and push user to continue.
Output only the text.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    res.json({ message: text });
  } catch (err) {
    console.error("Motivation error:", err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 5200;
app.listen(port, () => console.log(`HabitHero AI running on http://localhost:${port}`));
