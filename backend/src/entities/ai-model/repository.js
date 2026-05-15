import AVAILABLE_MODELS from './constants.js'

// Репозиторий — это слой доступа к данным.
const AiModelRepository = {
  // Получить все модели, для которых есть ключ в .env
  getActiveModels: () => {
    return AVAILABLE_MODELS.filter((model) => process.env[model.requiredKey])
  },

  // Найти конкретную модель по ID
  findById: (modelId) => {
    return AVAILABLE_MODELS.find((m) => m.id === modelId)
  },

  // Получить безопасный список для фронтенда (без requiredKey)
  getSafeActiveModels: () => {
    const active = AiModelRepository.getActiveModels()
    return active.map((m) => ({
      id: m.id,
      displayName: m.displayName,
      provider: m.provider,
    }))
  },
}

export { AiModelRepository }
export default AiModelRepository
