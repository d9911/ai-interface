// backend/src/infrastructure/llm/provider-config.js

export const getBaseUrlByProvider = (provider) => {
  const providerUrls = {
    deepseek: 'https://api.deepseek.com/v1',
    openrouter: 'https://openrouter.ai/api/v1',
    openrouter_auto: 'https://openrouter.ai/api/v1',
    freetheai: 'https://api.freetheai.xyz/v1',
    nvidia_nim: 'https://integrate.api.nvidia.com/v1',
    kimi: 'https://api.moonshot.ai/v1',
    opencode: 'https://opencode.ai/zen/v1',
    zai: process.env.ZAI_BASE_URL || 'https://api.z.ai/api/coding/paas/v4',
    wafer: 'https://pass.wafer.ai/v1',
    lmstudio: process.env.LM_STUDIO_BASE_URL || 'http://localhost:1234/v1',
    llamacpp: process.env.LLAMACPP_BASE_URL || 'http://localhost:8080/v1',
    ollama: (process.env.OLLAMA_BASE_URL || 'http://localhost:11434') + '/v1',
  };

  // Возвращаем URL или undefined (чтобы OpenAI SDK использовал свой дефолтный)
  return providerUrls[provider];
};