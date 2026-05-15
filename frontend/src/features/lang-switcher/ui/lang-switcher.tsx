// frontend/src/features/lang-switcher/ui/lang-switcher.tsx
import { useContext } from 'react'
import { Globe } from 'lucide-react'
import { Language, translations } from '@/shared/config/i18n'
import { LangContext } from '@/shared/context/lang-context' // Импортируем сам контекст, а не хук

// Делаем все пропсы опциональными для обратной совместимости
interface LangSwitcherProps {
  lang?: Language
  toggleLang?: () => void
  langSwitchText?: string
}

export const LangSwitcher = ({ lang: propLang, toggleLang: propToggleLang, langSwitchText: propLangSwitchText }: LangSwitcherProps) => {
  // Пытаемся получить данные из контекста (может быть undefined, если провайдера нет)
  const langContext = useContext(LangContext)

  // Логика приоритета: если передан пропс, используем его. Иначе - берем из контекста.
  const lang = propLang ?? langContext?.language ?? 'en'

  const toggleLang =
    propToggleLang ??
    (() => {
      langContext?.changeLanguage(lang === 'en' ? 'ru' : 'en')
    })

  // Если текст не передали через пропс, берем его из словаря i18n на основе текущего языка
  const langSwitchText = propLangSwitchText ?? translations[lang].langSwitch

  return (
    <button
      onClick={toggleLang}
      className="flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 rounded-full border border-white/25 text-white hover:bg-white/10 transition-colors font-mono text-[10px] sm:text-xs tracking-widest uppercase shrink-0"
    >
      <Globe size={14} />
      <span className="hidden sm:inline">{langSwitchText}</span>
      <span className="sm:hidden">{lang === 'en' ? 'RU' : 'EN'}</span>
    </button>
  )
}
