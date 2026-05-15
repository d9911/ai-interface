import 'dotenv/config.js'

import express from 'express'
import cors from 'cors'
import { getModelsHandler } from '../features/models/controller.js'
import chatHandler from '../features/chat/controller.js'
import { getSessionByIdHandler, getSessionsHandler } from '#features/chat/history.js'

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Регистрируем роуты
app.get('/api/models', getModelsHandler)
app.get('/api/chats', getSessionsHandler)
app.get('/api/chats/:id', getSessionByIdHandler)
app.post('/api/chat', chatHandler)

app.listen(port, () => {
  console.log(`🚀 Бэкенд запущен на порту ${port}`)
})
