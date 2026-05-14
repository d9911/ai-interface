const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Настройка Middleware
app.use(cors());
app.use(express.json());

// Инициализация OpenAI клиента
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/chat', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Текст запроса не может быть пустым' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Или любая другая доступная/бесплатная модель
      messages: [{ role: 'user', content: text }],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Ошибка API:', error);
    res.status(500).json({ error: 'Произошла ошибка при обращении к ИИ-сервису' });
  }
});

app.listen(port, () => {
  console.log(`Backend сервер запущен на http://localhost:${port}`);
});