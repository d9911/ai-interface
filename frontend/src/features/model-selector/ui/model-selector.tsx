import { useState, useEffect } from 'react';
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Model } from '@/entities/message/model/types';
import { Translation } from '@/shared/config/i18n';

interface ModelSelectorProps {
  availableModels: Model[];
  selectedModel: string;
  setSelectedModel: (id: string) => void;
  t: Translation;
}

export const ModelSelector = ({ availableModels, selectedModel, setSelectedModel, t }: ModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const closeMenu = () => {
      setIsOpen(false);
      setTimeout(() => setIsExpanded(false), 200);
    };
    if (isOpen) window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, [isOpen]);

  const autoModel = availableModels.find((m) => m.provider === 'openrouter_auto');
  const freeModels = availableModels.filter((m) => m.provider === 'openrouter');
  const premiumModels = availableModels.filter((m) => m.provider === 'openai' || m.provider === 'deepseek');
  const freeTheAiModels = availableModels.filter((m) => m.provider === 'freetheai');
  const altModels = availableModels.filter((m) => !['openrouter_auto', 'openrouter', 'openai', 'deepseek', 'freetheai'].includes(m.provider));

  const currentModelName = availableModels.find((m) => m.id === selectedModel)?.displayName || t.noModels;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.detail === 3) {
      setIsExpanded(true);
      setIsOpen(true);
    } else {
      setIsOpen((prev) => !prev);
      if (isOpen) {
        setTimeout(() => setIsExpanded(false), 200);
      }
    }
  };

  const handleSelect = (id: string) => {
    setSelectedModel(id);
    setIsOpen(false);
    setTimeout(() => setIsExpanded(false), 200);
  };

  return (
    <div className="relative inline-block w-[60%] sm:w-auto max-w-[200px] sm:max-w-md z-50" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between bg-[#0a0a0a] border border-white/25 text-white font-mono text-[10px] sm:text-xs tracking-widest uppercase py-2 px-3 sm:px-4 rounded-full hover:bg-white/10 focus:outline-none focus:border-white/50 transition-colors"
        title="Triple click to expand fully"
      >
        <span className="truncate mr-2">{currentModelName}</span>
        <ChevronDown size={14} className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-max min-w-[100%] max-w-[85vw] sm:max-w-[300px] bg-[#191919] border border-[#212327] rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div
            className={`overflow-y-auto [scrollbar-width:thin] overscroll-contain py-2 transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[85vh] sm:max-h-[80vh]' : 'max-h-[40vh] sm:max-h-60'}`}
          >
            {availableModels.length === 0 ? (
              <div className="px-4 py-3 text-xs text-[#7d8187] font-mono italic">
                {t.noModels}
              </div>
            ) : (
              <>
                {autoModel && (
                  <div
                    onClick={() => handleSelect(autoModel.id)}
                    className={`px-4 py-2 cursor-pointer font-bold text-xs sm:text-sm hover:bg-[#212327] ${selectedModel === autoModel.id ? 'bg-[#212327] text-white' : 'text-white'}`}
                  >
                    {autoModel.displayName}
                  </div>
                )}

                {freeModels.length > 0 && (
                  <>
                    <div className="px-4 py-1 mt-2 text-[10px] text-[#7d8187] uppercase tracking-widest bg-[#0a0a0a]">── Free Models ──</div>
                    {freeModels.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleSelect(m.id)}
                        className={`px-4 py-2 cursor-pointer font-mono text-xs hover:bg-[#212327] ${selectedModel === m.id ? 'bg-[#212327] text-white' : 'text-[#dadbdf]'}`}
                      >
                        {m.displayName}
                      </div>
                    ))}
                  </>
                )}

                {premiumModels.length > 0 && (
                  <>
                    <div className="px-4 py-1 mt-2 text-[10px] text-[#7d8187] uppercase tracking-widest bg-[#0a0a0a]">── Premium Models ──</div>
                    {premiumModels.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleSelect(m.id)}
                        className={`px-4 py-2 cursor-pointer font-mono text-xs hover:bg-[#212327] ${selectedModel === m.id ? 'bg-[#212327] text-[#ff7a17]' : 'text-[#ff7a17]/80'}`}
                      >
                        {m.displayName}
                      </div>
                    ))}
                  </>
                )}

                {freeTheAiModels.length > 0 && (
                  <>
                    <div className="px-4 py-1 mt-2 text-[10px] text-[#7d8187] uppercase tracking-widest bg-[#0a0a0a]">── FreeTheAI (Top Models) ──</div>
                    {freeTheAiModels.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleSelect(m.id)}
                        className={`px-4 py-2 cursor-pointer font-mono text-xs hover:bg-[#212327] ${selectedModel === m.id ? 'bg-[#212327] text-[#6be74c]' : 'text-[#6be74c]/80'}`}
                      >
                        {m.displayName}
                      </div>
                    ))}
                  </>
                )}

                {altModels.length > 0 && (
                  <>
                    <div className="px-4 py-1 mt-2 text-[10px] text-[#7d8187] uppercase tracking-widest bg-[#0a0a0a]">── Alt & Local Models ──</div>
                    {altModels.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleSelect(m.id)}
                        className={`px-4 py-2 cursor-pointer font-mono text-xs hover:bg-[#212327] ${selectedModel === m.id ? 'bg-[#212327] text-[#ffc285]' : 'text-[#ffc285]/80'}`}
                      >
                        {m.displayName}
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
