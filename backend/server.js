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
  // ПЛАТНЫЕ МОДЕЛИ OPENAI
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

  // ПЛАТНЫЕ МОДЕЛИ DEEPSEEK
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

  // БЕСПЛАТНЫЕ МОДЕЛИ OPENROUTER (Из вашего списка)
  {
    id: 'openrouter/free',
    displayName: '✨ Auto-Router (Лучшая бесплатная)',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter_auto',
  },
  {
    id: 'nvidia/nemotron-3-super:free',
    displayName: 'NVIDIA: Nemotron 3 Super',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'inclusionai/ring-2.6-1t:free',
    displayName: 'inclusionAI: Ring-2.6-1T',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'poolside/laguna-m.1:free',
    displayName: 'Poolside: Laguna M.1',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'openai/gpt-oss-120b:free',
    displayName: 'OpenAI: gpt-oss-120b',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'z.ai/glm-4.5-air:free',
    displayName: 'Z.ai: GLM 4.5 Air',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'minimax/minimax-m2.5:free',
    displayName: 'MiniMax: MiniMax M2.5',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'nvidia/nemotron-3-nano-30b-a3b:free',
    displayName: 'NVIDIA: Nemotron 3 Nano 30B',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'openai/gpt-oss-20b:free',
    displayName: 'OpenAI: gpt-oss-20b',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'baidu/qianfan-cobuddy:free',
    displayName: 'Baidu Qianfan: CoBuddy',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'google/gemma-4-31b-it:free',
    displayName: 'Google: Gemma 4 31B',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'nvidia/nemotron-nano-12b-2-vl:free',
    displayName: 'NVIDIA: Nemotron Nano 12B 2 VL',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'arcee-ai/trinity-large-thinking:free',
    displayName: 'Arcee AI: Trinity Large Thinking',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'deepseek/deepseek-v4-flash:free',
    displayName: 'DeepSeek: DeepSeek V4 Flash',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'google/gemma-4-26b-a4b:free',
    displayName: 'Google: Gemma 4 26B A4B',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'qwen/qwen3-coder-480b-a35b-instruct:free',
    displayName: 'Qwen: Qwen3 Coder 480B',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'qwen/qwen3-next-80b-a3b-instruct:free',
    displayName: 'Qwen: Qwen3 Next 80B',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    displayName: 'Meta: Llama 3.3 70B Instruct',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'liquid/lfm-2.5-1.2b-thinking:free',
    displayName: 'LiquidAI: LFM 2.5 Thinking',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'nousresearch/hermes-3-405b-instruct:free',
    displayName: 'Nous: Hermes 3 405B',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
  {
    id: 'meta-llama/llama-3.2-3b-instruct:free',
    displayName: 'Meta: Llama 3.2 3B',
    requiredKey: 'OPENROUTER_API_KEY',
    provider: 'openrouter',
  },
]

// Endpoint 1: Отдаем фронтенду список доступных моделей
app.get('/api/models', (req, res) => {
  const activeModels = AVAILABLE_MODELS.filter((model) => process.env[model.requiredKey])

  // Теперь мы отдаем еще и поле provider, чтобы фронтенд мог сгруппировать список
  const safeModels = activeModels.map((m) => ({
    id: m.id,
    displayName: m.displayName,
    provider: m.provider,
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
    baseURL = 'https://api.deepseek.com/v1'
  } else if (targetModel.provider === 'openrouter' || targetModel.provider === 'openrouter_auto') {
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
