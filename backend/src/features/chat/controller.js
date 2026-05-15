import { AiModelRepository } from '../../entities/index.js'
import OpenAI from 'openai'

const chatHandler = async (req, res) => {
  const { text, modelId } = req.body

  if (!text || !modelId) {
    return res.status(400).json({ error: 'Текст и ID модели обязательны' })
  }

  // 1. Ищем модель через репозиторий
  const targetModel = AiModelRepository.findById(modelId)
  if (!targetModel) {
    return res.status(400).json({ error: 'Выбрана неизвестная модель' })
  }

  // 2. Достаем ключ
  const isLocal = ['lmstudio', 'ollama', 'llamacpp'].includes(targetModel.provider)
  const apiKey = isLocal ? 'local' : process.env[targetModel.requiredKey]

  if (!apiKey) return res.status(503).json({ error: 'API ключ не настроен' })

  // 3. Полный роутинг URL для всех провайдеров
  let baseURL = undefined // По умолчанию летит на OpenAI

  if (targetModel.provider === 'deepseek') {
    baseURL = 'https://api.deepseek.com/v1'
  } else if (targetModel.provider === 'openrouter' || targetModel.provider === 'openrouter_auto') {
    baseURL = 'https://openrouter.ai/api/v1'
  } else if (targetModel.provider === 'freetheai') {
    baseURL = 'https://api.freetheai.xyz/v1'
  } else if (targetModel.provider === 'nvidia_nim') {
    baseURL = 'https://integrate.api.nvidia.com/v1'
  } else if (targetModel.provider === 'kimi') {
    baseURL = 'https://api.moonshot.ai/v1'
  } else if (targetModel.provider === 'opencode') {
    baseURL = 'https://opencode.ai/zen/v1'
  } else if (targetModel.provider === 'zai') {
    baseURL = process.env.ZAI_BASE_URL || 'https://api.z.ai/api/coding/paas/v4'
  } else if (targetModel.provider === 'wafer') {
    baseURL = 'https://pass.wafer.ai/v1'
  } else if (targetModel.provider === 'lmstudio') {
    baseURL = process.env.LM_STUDIO_BASE_URL || 'http://localhost:1234/v1'
  } else if (targetModel.provider === 'llamacpp') {
    baseURL = process.env.LLAMACPP_BASE_URL || 'http://localhost:8080/v1'
  } else if (targetModel.provider === 'ollama') {
    baseURL = (process.env.OLLAMA_BASE_URL || 'http://localhost:11434') + '/v1'
  }

  // 4. Запрос с правильным URL
  const openai = new OpenAI({ apiKey, baseURL })

  try {
    const response = await openai.chat.completions.create({
      model: targetModel.id,
      messages: [{ role: 'user', content: text }],
    })
    res.json({ reply: response.choices[0].message.content })
  } catch (error) {
    console.error(`Ошибка API (${targetModel.provider}):`, error)
    if (error.status === 403 && error.error?.type === 'daily_checkin_required') {
      return res.status(403).json({ error: 'Требуется активация ключа FreeTheAI...' })
    }
    res.status(500).json({ error: error.message || 'Ошибка ИИ' })
  }
}

export { chatHandler }
export default chatHandler