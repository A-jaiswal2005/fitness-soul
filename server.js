const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyAxOsBusVANIFO75O-EqxK_z1ac7peyQCI";

app.get('/exercise-plan', async (req, res) => {
    try {
        const prompt = `Generate a structured JSON for a 7-day workout plan for a 5-year-old indian female with a BMI of 15 and fit body. Format:
{
    "workoutPlan": {
        "description": "Summary of the plan",
        "days": {
            "Monday": { "focus": "Focus Area", "exercises": [{ "name": "Exercise", "sets": 3, "reps": 12, "notes": "Instruction" }], "notes": "Additional Notes" },
            "Tuesday": { "focus": "Focus Area", "exercises": [...], "notes": "..." },
            "...": "...",
            "Sunday":{ "focus": "Focus Area", "exercises": [...], "notes": "..." }
        },
        "generalNotes": "Important general guidance."
    }
}`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
            {
                contents: [{ parts: [{ text: prompt }] }],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": "AIzaSyAxOsBusVANIFO75O-EqxK_z1ac7peyQCI", //API key in header
                },
            }
        );

        const rawText = response.data.candidates[0].content.parts[0].text;

        // Attempt to extract JSON, even if there's surrounding text
        let jsonString = rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1);

        try {
            const parsedJson = JSON.parse(jsonString);
            res.json(parsedJson);
        } catch (error) {
            console.error("JSON Parsing Error:", error);
            res.status(500).json({ error: "Invalid JSON format from AI.", rawText: rawText });
        }
    } catch (error) {
        console.error("Error fetching exercise plan:", error);
        res.status(500).json({ error: "Failed to generate exercise plan." });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});