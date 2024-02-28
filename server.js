require('dotenv').config();

const express = require('express');
const { OpenAI } = require('openai');

const app = express();
const port = 5173;

app.use(express.static('public'));
app.use(express.json()); // Support JSON-encoded bodies

// OpenAI API setup
const openai = new OpenAI(process.env.OPENAI_API_KEY); // Directly use the API key here

let requestCounter = 0;

// Route to handle GPT requests
app.post('/generate', async (req, res) => {
  try {
requestCounter++; // Increment request counter
    if (requestCounter > 100) {
      console.log('Request limit exceeded, shutting down server.');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0); // Exit the process when the server has closed
      });
      return; // Prevent further processing
    }
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or your preferred model
      messages: [{"role": "user", "content": req.body.prompt}],
      max_tokens: 150,
    });
    console.log(response.choices[0].message.content);
    res.json(response.choices[0].message.content);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).send("Error processing your request");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
