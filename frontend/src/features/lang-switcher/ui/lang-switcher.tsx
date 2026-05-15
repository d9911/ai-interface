import { Globe } from 'lucide-react';
import { Language } from '@/shared/config/i18n';

interface LangSwitcherProps {
  lang: Language;
  toggleLang: () => void;
  langSwitchText: string;
}

export const LangSwitcher = ({ lang, toggleLang, langSwitchText }: LangSwitcherProps) => {
  return (
    <button
      onClick={toggleLang}
      className="flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 rounded-full border border-white/25 text-white hover:bg-white/10 transition-colors font-mono text-[10px] sm:text-xs tracking-widest uppercase shrink-0"
    >
      <Globe size={14} /> 
      <span className="hidden sm:inline">{langSwitchText}</span>
      <span className="sm:hidden">{lang === 'en' ? 'RU' : 'EN'}</span>
    </button>
  );
};
