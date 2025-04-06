const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyAxOsBusVANIFO75O-EqxK_z1ac7peyQCI"; // Use env in production

async function fetchGeminiResponse(prompt) {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
            {
                contents: [{ parts: [{ text: prompt }] }],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": "AIzaSyAxOsBusVANIFO75O-EqxK_z1ac7peyQCI",
                },
            }
        );

        const rawText = response.data.candidates[0].content.parts[0].text;
        const jsonString = rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1);
        return JSON.parse(jsonString);
    } catch (error){
        console.error("Error fetching Gemini response:", error);
        throw error;
    }
}

// Exercise Plan Endpoint
app.post('/exercise-plan', async (req, res) => {
    try {
        const userData = req.body;

        const prompt = `
Create a 7-day workout plan for an indian ${userData.gender} of age ${userData.age} and height= ${userData.height},weight= ${userData.height} focused on ${userData.goal.replace('-', ' ')} and has injury in ${userData.injury}. Include warm-up, main exercises, and cooldown for each day. 
Also include general notes. Use this JSON format strictly:
{
    "workoutPlan": {
        "description": "...",
        "days": 
        { "Monday": { "focus": "...", 
         "exercises": [name: "" ,repetations: "" ,sets:""], "notes": "..." }, ... },
        "generalNotes": "..."
    }
}`.trim();

        const result = await fetchGeminiResponse(prompt);
        res.json(result);
    } catch (err) {
        console.error("Exercise Plan Error:", err);
        res.status(500).json({ error: "Failed to generate exercise plan" });
    }
});

// Diet Plan Endpoint
app.post('/diet-plan', async (req, res) => {
    try {
        const userData = req.body;

        const prompt = `
Suggest a weekly balanced diet plan for a ${userData.age}-year-old Indian ${userData.gender} who follows a ${userData.diet} diet.
Goal: ${userData.goal.replace('-', ' ')}, Experience: ${userData.experience}.

Return a weekly plan from Monday to Sunday in this JSON format:
{
  "dietPlan": {
    "description": "...",
    "weeklyPlan": {
      "Monday": {
        "Breakfast": { "items": [...], "calories": ..., "protein": "...", "notes": "..." },
        "Lunch": { ... },
        "Dinner": { ... },
        "Snacks": { ... }
      },
      ...
      "Sunday": { ... }
    },
    "generalTips": "..."
  }
}
`.trim();

        const result = await fetchGeminiResponse(prompt);
        res.json(result);
    } catch (err) {
        console.error("Diet Plan Error:", err);
        res.status(500).json({ error: "Failed to generate diet plan" });
    }
});

app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
