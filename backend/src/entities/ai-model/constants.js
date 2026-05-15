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
    displayName: '✨ Auto-Router (the best free)',
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
  // FREETHEAI (Новый бесплатный провайдер)
  {
    id: 'cat/claude-4-6-sonnet',
    displayName: 'Claude 4.6 Sonnet',
    requiredKey: 'FREETHEAI_API_KEY',
    provider: 'freetheai',
  },
  {
    id: 'rev/claude-sonnet-4.5',
    displayName: 'Claude 4.5 Sonnet',
    requiredKey: 'FREETHEAI_API_KEY',
    provider: 'freetheai',
  },
  {
    id: 'bbg/deepseek-ai/DeepSeek-V4-Pro',
    displayName: 'DeepSeek V4 Pro',
    requiredKey: 'FREETHEAI_API_KEY',
    provider: 'freetheai',
  },
  {
    id: 'bbg/deepseek-ai/DeepSeek-V4-Flash',
    displayName: 'DeepSeek V4 Flash',
    requiredKey: 'FREETHEAI_API_KEY',
    provider: 'freetheai',
  },
  {
    id: 'bbl/gemini-3.0-flash',
    displayName: 'Gemini 3.0 Flash',
    requiredKey: 'FREETHEAI_API_KEY',
    provider: 'freetheai',
  },
  {
    id: 'bbl/gpt-5.4-mini',
    displayName: 'GPT 5.4 Mini',
    requiredKey: 'FREETHEAI_API_KEY',
    provider: 'freetheai',
  },
  {
    id: 'bbg/zai-org/GLM-5.1',
    displayName: 'GLM 5.1',
    requiredKey: 'FREETHEAI_API_KEY',
    provider: 'freetheai',
  },

  // НОВЫЕ АЛЬТЕРНАТИВЫ ИЗ FREE-CLAUDE-CODE

  // NVIDIA NIM (OpenAI-compatible)
  { id: 'nvidia/nemotron-3-super-120b-a12b', displayName: 'NVIDIA NIM: Nemotron 120B', requiredKey: 'NVIDIA_NIM_API_KEY', provider: 'nvidia_nim' },
  { id: 'meta/llama-3.1-70b-instruct', displayName: 'NVIDIA NIM: Llama 3.1 70B', requiredKey: 'NVIDIA_NIM_API_KEY', provider: 'nvidia_nim' },

  // Kimi / Moonshot (OpenAI-compatible)
  { id: 'moonshot-v1-8k', displayName: 'Kimi: Moonshot 8K', requiredKey: 'KIMI_API_KEY', provider: 'kimi' },

  // OpenCode Zen (OpenAI-compatible)
  { id: 'opencode-zen', displayName: 'OpenCode Zen', requiredKey: 'OPENCODE_API_KEY', provider: 'opencode' },

  // Локальные модели (Без ключей, активируются флагами в .env)
  { id: 'local-model', displayName: 'LM Studio (Local)', requiredKey: 'LM_STUDIO_ENABLED', provider: 'lmstudio' },
  { id: 'llama3', displayName: 'Ollama (Local)', requiredKey: 'OLLAMA_ENABLED', provider: 'ollama' },
  { id: 'local-llama', displayName: 'Llama.cpp (Local)', requiredKey: 'LLAMACPP_ENABLED', provider: 'llamacpp' },

  // Экспериментальные (Anthropic-compatible, могут требовать адаптера на клиенте)
  { id: 'claude-3-5-sonnet-20240620', displayName: 'Z.ai API', requiredKey: 'ZAI_API_KEY', provider: 'zai' },
  { id: 'claude-3-haiku-20240307', displayName: 'Wafer API', requiredKey: 'WAFER_API_KEY', provider: 'wafer' },
]

export { AVAILABLE_MODELS }
export default AVAILABLE_MODELS
