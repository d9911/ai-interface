import { AiModelRepository } from '../../entities/index.js'
import { getBaseUrlByProvider } from '../../infrastructure/llm/provider-config.js'
import { saveMessageToSession, createSession, getSessionMessages } from './history.js'
import OpenAI from 'openai'

const chatHandler = async (req, res) => {
  let { text, modelId, sessionId } = req.body
  const ip = req.ip || req.connection.remoteAddress

  if (!text || !modelId) {
    return res.status(400).json({ error: 'Текст и ID модели обязательны' })
  }

  // Если sessionId нет, создаем новую сессию
  if (!sessionId || sessionId.trim() === '') {
    const newSession = createSession(ip)
    sessionId = newSession.id
  }

  // 1. Ищем модель
  const targetModel = AiModelRepository.findById(modelId)
  if (!targetModel) return res.status(400).json({ error: 'Выбрана неизвестная модель' })

  // 2. Достаем ключ
  const isLocal = ['lmstudio', 'ollama', 'llamacpp'].includes(targetModel.provider)
  const apiKey = isLocal ? 'local' : process.env[targetModel.requiredKey]
  if (!apiKey) return res.status(503).json({ error: 'API ключ не настроен' })

  // 3. Получаем URL
  const baseURL = getBaseUrlByProvider(targetModel.provider)

  // === МАГИЯ КОНТЕКСТА НАЧИНАЕТСЯ ЗДЕСЬ ===

  // Достаем предыдущие сообщения из памяти бэкенда
  const previousMessages = getSessionMessages(ip, sessionId)

  // Формируем массив для отправки в ИИ (только role и content)
  const contextMessages = previousMessages.map((msg) => ({
    role: msg.role === 'error' ? 'system' : msg.role, // Игнорируем или меняем системные ошибки
    content: msg.content,
  }))

  // Добавляем текущий вопрос пользователя в контекст
  contextMessages.push({ role: 'user', content: text })

  // Сохраняем вопрос пользователя в нашу историю (в памяти)
  saveMessageToSession(ip, sessionId, { role: 'user', content: text })

  // 4. Запрос к ИИ

  const openai = new OpenAI({ apiKey, baseURL })

  try {
    const response = await openai.chat.completions.create({
      model: targetModel.id,
      messages: contextMessages, // <--- ОТПРАВЛЯЕМ ПОЛНУЮ ИСТОРИЮ
      // messages: [{ role: 'user', content: text }],
      stream: true,
    })

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    let fullAiResponse = ''

    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        fullAiResponse += content
        res.write(`data: ${JSON.stringify({ text: content, sessionId })}\n\n`)
      }
    }

    // Сохраняем ответ ИИ в историю
    saveMessageToSession(ip, sessionId, { role: 'ai', content: fullAiResponse })

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error) {
    console.error(`Ошибка API (${targetModel.provider}):`, error)
    if (!res.headersSent) {
      if (error.status === 403 && error.error?.type === 'daily_checkin_required') {
        return res.status(403).json({ error: 'Требуется активация ключа FreeTheAI...' })
      }
      return res.status(500).json({ error: error.message || 'Ошибка ИИ' })
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Произошла ошибка при генерации' })}\n\n`)
      res.end()
    }
  }
}

export { chatHandler }
export default chatHandler
