import { AiModelRepository } from '../../entities/index.js'

const getModelsHandler = (req, res) => {
  // Контроллер просто просит у репозитория готовые данные и отдает их
  const safeModels = AiModelRepository.getSafeActiveModels()
  res.json(safeModels)
}

export { getModelsHandler }
