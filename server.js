require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyAE6W94N8gI_AQZySRdw5aKzzqpcIPDbAQ");

// Define the /generate-formula route
app.post('/generate-formula', async (req, res) => {
  const description = req.body.description;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate an Excel formula based on the following description: "${description}". 
                    Provide only the formula, without any additional explanation.`;

    const result = await model.generateContent(prompt);
    const formula = result.response.text().trim();

    res.json({ formula });
  } catch (error) {
    console.error('Error generating formula:', error);
    res.status(500).json({ error: 'Failed to generate formula' });
  }
});

// Serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});