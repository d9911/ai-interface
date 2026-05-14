const express = require('express')
const cors = require('cors')
const { OpenAI } = require('openai')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Конфигурация доступных моделей (Динамически фильтруется по .env) 2026.05.14 https://openrouter.ai/models?q=free
const AVAILABLE_MODELS = [
  // ПЛАТНЫЕ МОДЕЛИ OPENAI (нужен OPENAI_API_KEY)
  { id: 'gpt-4o', displayName: 'ChatGPT 4o', requiredKey: 'OPENAI_API_KEY', provider: 'openai' },
  {
    id: 'gpt-4o-mini',
    displayName: 'ChatGPT 4o Mini',
    requiredKey: 'OPENAI_API_KEY',
    provider: 'openai',
  },
  {
    id: 'gpt-3.5-turbo',
    displayName: 'ChatGPT 3.5',
    requiredKey: 'OPENAI_API_KEY',
    provider: 'openai',
  },

  // ПЛАТНЫЕ МОДЕЛИ DEEPSEEK (нужен DEEPSEEK_API_KEY)
  {
    id: 'deepseek-chat',
    displayName: 'DeepSeek V3 (Chat)',
    requiredKey: 'DEEPSEEK_API_KEY',
    provider: 'deepseek',
  },
  {
    id: 'deepseek-reasoner',
    displayName: 'DeepSeek R1 (Reasoner)',
    requiredKey: 'DEEPSEEK_API_KEY',
    provider: 'deepseek',
  },
  // 8 БЕСПЛАТНЫХ МОДЕЛЕЙ OPENROUTER ИЗ ВАШЕГО СПИСКА (нужен OPENROUTER_API_KEY)
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    displayName: 'Meta Llama 3.3 70B (Free)',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'deepseek/deepseek-v4-flash:free',
    displayName: 'DeepSeek V4 Flash (Free)',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'google/gemma-4-31b-it:free',
    displayName: 'Google Gemma 4 31B (Free)',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'qwen/qwen3-coder-480b-a35b-instruct:free',
    displayName: 'Qwen3 Coder 480B (Free)',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'nousresearch/hermes-3-405b-instruct:free',
    displayName: 'Nous Hermes 3 405B (Free)',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'nvidia/nemotron-nano-9b-v2:free',
    displayName: 'NVIDIA Nemotron Nano (Free)',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'liquid/lfm-2.5-1.2b-thinking:free',
    displayName: 'Liquid LFM 2.5 Thinking (Free)',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  // Автоматический роутер OpenRouter, который сам выбирает лучшую из доступных бесплатных моделей
  {
    id: 'openrouter/free',
    displayName: 'Auto-Router (Best Free)',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
]

// Endpoint 1: Отдаем фронтенду список доступных моделей
app.get('/api/models', (req, res) => {
  // Фильтруем модели: оставляем только те, для которых в .env есть ключ
  const activeModels = AVAILABLE_MODELS.filter((model) => process.env[model.requiredKey])

  // Отдаем на фронт только безопасные данные (без имен ключей)
  const safeModels = activeModels.map((m) => ({
    id: m.id,
    displayName: m.displayName,
  }))

  res.json(safeModels)
})

// Endpoint 2: Обработка чата
app.post('/api/chat', async (req, res) => {
  const { text, modelId } = req.body

  if (!text || !modelId) {
    return res.status(400).json({ error: 'Текст и ID модели обязательны' })
  }

  // Находим выбранную модель в нашем конфиге
  const targetModel = AVAILABLE_MODELS.find((m) => m.id === modelId)
  if (!targetModel) {
    return res.status(400).json({ error: 'Выбрана неизвестная модель' })
  }

  const apiKey = process.env[targetModel.requiredKey]
  if (!apiKey) {
    return res.status(503).json({ error: 'API ключ для этой модели не настроен на сервере' })
  }

  // Определяем Base URL в зависимости от провайдера
  let baseURL = undefined // По умолчанию для OpenAI
  if (targetModel.provider === 'deepseek') {
    baseURL = 'https://api.deepseek.com/v1' // Или /anthropic, смотря какой endpoint используете
  } else if (targetModel.provider === 'openrouter') {
    baseURL = 'https://openrouter.ai/api/v1'
  }
  // Динамически создаем инстанс OpenAI
  const openai = new OpenAI({ apiKey, baseURL })

  try {
    const response = await openai.chat.completions.create({
      model: targetModel.id,
      messages: [{ role: 'user', content: text }],
    })

    res.json({ reply: response.choices[0].message.content })
  } catch (error) {
    console.error(`Ошибка API (${targetModel.provider}):`, error)
    res.status(500).json({ error: error.message || 'Ошибка ответа ИИ' })
  }
})

app.listen(port, () => {
  console.log(`Backend запущен на порту ${port}`)
})
