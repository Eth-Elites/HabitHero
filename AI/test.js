// test.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL

// Safety check
if (!apiKey) {
  console.error("❌ Missing GEMINI_API_KEY in .env");
  process.exit(1);
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: modelName });

async function test() {
  try {
    const prompt = `
You are HabitHero, an AI coach for habits.
Task: Generate a short motivational message (<= 50 chars).

Habit: Code for 30 minutes
Progress: 4/10 days completed
Description: Learn cadence coding pattern daily
`;

    const result = await model.generateContent(prompt);

    // Print response
    console.log("✅ Motivational message:");
    console.log(result.response.text().trim());

    // Debug info
    console.log("\n(API key prefix:", apiKey.slice(0, 8), "...)");
  } catch (err) {
    console.error("❌ Error while generating:", err.message);
  }
}

test();
