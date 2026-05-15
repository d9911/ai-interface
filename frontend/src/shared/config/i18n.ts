export interface Translation {
  readonly greeting: string
  readonly question: string
  readonly subtitle: string
  readonly placeholder: string
  readonly assistant: string
  readonly typing: string
  readonly disclaimer: string
  readonly voiceNotSupported: string
  readonly voiceError: string
  readonly langSwitch: string
  readonly noModels: string
}

export const translations: Record<Language, Translation> = {
  en: {
    greeting: 'Hi there.',
    question: 'What would you like to know?',
    subtitle: 'Use one of the most common prompts below or ask your own question.',
    placeholder: 'Ask whatever you want...',
    assistant: 'AI ASSISTANT',
    typing: 'Assistant is thinking...',
    disclaimer: 'AI can make mistakes. Check important info.',
    voiceNotSupported: 'Your browser does not support voice input.',
    voiceError: 'Error during voice recording.',
    langSwitch: 'RU',
    noModels: 'No models available',
  },
  ru: {
    greeting: 'Привет.',
    question: 'Что вы хотите узнать?',
    subtitle: 'Используйте частые запросы или задайте свой собственный вопрос.',
    placeholder: 'Спросите о чем угодно...',
    assistant: 'ИИ АССИСТЕНТ',
    typing: 'Ассистент думает...',
    disclaimer: 'ИИ может допускать ошибки. Проверяйте важную информацию.',
    voiceNotSupported: 'Ваш браузер не поддерживает голосовой ввод.',
    voiceError: 'Ошибка при записи голоса.',
    langSwitch: 'EN',
    noModels: 'Нет доступных моделей',
  },
}

export type Language = 'en' | 'ru'
