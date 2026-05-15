// frontend/src/shared/context/lang-context.tsx
import { createContext, useContext, useState, ReactNode } from 'react'
// Импортируем ТОЛЬКО то, что реально есть в твоем конфиге
import { Language, translations, Translation } from '@/shared/config/i18n'

interface LangContextType {
  language: Language
  changeLanguage: (lang: Language) => void
  // Добавляем удобную функцию перевода, чтобы не дергать translations напрямую в компонентах
  t: (key: keyof Translation) => string
}

export const LangContext = createContext<LangContextType | undefined>(undefined)

// Получаем начальный язык из localStorage или ставим по умолчанию 'en'
const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('app-lang') as Language
    // Проверяем, что сохраненный язык реально существует в нашем словаре
    if (savedLang && translations[savedLang]) {
      return savedLang
    }
  }
  return 'en'
}

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage)

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('app-lang', lang)
    // Если в будущем подключишь i18next, сюда можно добавить i18n.changeLanguage(lang)
  }

  // Функция для получения текста по ключу
  const t = (key: keyof Translation): string => {
    return translations[language][key] || key
  }

  return <LangContext.Provider value={{ language, changeLanguage, t }}>{children}</LangContext.Provider>
}

// Кастомный хук
export const useLang = () => {
  const context = useContext(LangContext)
  if (!context) {
    throw new Error('useLang должен использоваться внутри LangProvider')
  }
  return context
}
