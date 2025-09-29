const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'message field is required' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 180000 // 3 min
      }
    );
    res.json({ reply: response.data.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: 'OpenAI API error', details: String(e) });
  }
});

app.get('/', (_, res) => res.send('OpenAI Gateway is working!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`openai-gateway started on port ${PORT}`));
