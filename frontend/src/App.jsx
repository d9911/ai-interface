import { useState, useRef, useEffect } from 'react';
import { Mic, ArrowRight, Send, Loader2, Globe, ChevronDown } from 'lucide-react';

const translations = {
  en: {
    greeting: "Hi there.",
    question: "What would you like to know?",
    subtitle: "Use one of the most common prompts below or ask your own question.",
    placeholder: "Ask whatever you want...",
    assistant: "AI ASSISTANT",
    typing: "Assistant is thinking...",
    disclaimer: "AI can make mistakes. Check important info.",
    voiceNotSupported: "Your browser does not support voice input.",
    voiceError: "Error during voice recording.",
    langSwitch: "RU",
    noModels: "No models available"
  },
  ru: {
    greeting: "Привет.",
    question: "Что вы хотите узнать?",
    subtitle: "Используйте частые запросы или задайте свой собственный вопрос.",
    placeholder: "Спросите о чем угодно...",
    assistant: "ИИ АССИСТЕНТ",
    typing: "Ассистент думает...",
    disclaimer: "ИИ может допускать ошибки. Проверяйте важную информацию.",
    voiceNotSupported: "Ваш браузер не поддерживает голосовой ввод.",
    voiceError: "Ошибка при записи голоса.",
    langSwitch: "EN",
    noModels: "Нет доступных моделей"
  }
};

function App() {
  const [lang, setLang] = useState('en');
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // Состояния для моделей
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');

  const t = translations[lang];
  const messagesEndRef = useRef(null);

  // 1. Загрузка списка моделей с бэкенда при старте
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/models');
        const data = await res.json();
        setAvailableModels(data);
        if (data.length > 0) {
          setSelectedModel(data[0].id); // Выбираем первую доступную по умолчанию
        }
      } catch (err) {
        console.error("Ошибка загрузки моделей:", err);
      }
    };
    fetchModels();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionRef = useRef(null);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'ru' : 'en');

  const startRecording = () => {
    if (!SpeechRecognition) return setError(t.voiceNotSupported);
    setError('');
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = lang === 'ru' ? 'ru-RU' : 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (e) => setInput(prev => prev + (prev ? ' ' : '') + e.results[0][0].transcript);
    recognition.onerror = () => { setError(t.voiceError); setIsRecording(false); };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const stopRecording = () => recognitionRef.current?.stop();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || !selectedModel) return;

    if (!isChatStarted) setIsChatStarted(true);

    const newUserMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Отправляем выбранную модель на бэкенд
        body: JSON.stringify({ text: newUserMessage.content, modelId: selectedModel }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');

      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (err) {
      setError(err.message);
      setMessages(prev => [...prev, { role: 'error', content: err.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

// UI компонент для выбора модели (Кастомный Dropdown с пасхалкой на тройной клик)
  const ModelSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // Состояние для тройного клика

    // Закрытие при клике вне элемента
    useEffect(() => {
      const closeMenu = () => {
        setIsOpen(false);
        setTimeout(() => setIsExpanded(false), 200); // Сбрасываем высоту с небольшой задержкой для плавности
      };
      if (isOpen) window.addEventListener('click', closeMenu);
      return () => window.removeEventListener('click', closeMenu);
    }, [isOpen]);

    const autoModel = availableModels.find(m => m.provider === 'openrouter_auto');
    const freeModels = availableModels.filter(m => m.provider === 'openrouter');
    const premiumModels = availableModels.filter(m => m.provider === 'openai' || m.provider === 'deepseek');

    const currentModelName = availableModels.find(m => m.id === selectedModel)?.displayName || t.noModels;

    // Обработчик кликов (одиночный = открыть/закрыть, тройной = расширить)
    const handleToggle = (e) => {
      if (e.detail === 3) {
        setIsExpanded(true);
        setIsOpen(true);
      } else if (e.detail === 1) {
        // Срабатывает только на первый клик, чтобы не мешать двойным/тройным кликам
        if (isOpen) {
          setIsOpen(false);
          setTimeout(() => setIsExpanded(false), 200);
        } else {
          setIsOpen(true);
        }
      }
    };

    // Функция выбора модели
    const handleSelect = (id) => {
      setSelectedModel(id);
      setIsOpen(false);
      setTimeout(() => setIsExpanded(false), 200);
    };

    return (
      <div
        className="relative inline-block w-[60%] sm:w-auto max-w-[200px] sm:max-w-md z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleToggle}
          className="w-full flex items-center justify-between bg-[#0a0a0a] border border-white/25 text-white font-mono text-[10px] sm:text-xs tracking-widest uppercase py-2 px-3 sm:px-4 rounded-full hover:bg-white/10 focus:outline-none focus:border-white/50 transition-colors"
          disabled={availableModels.length === 0}
          title="Triple click to expand fully"
        >
          <span className="truncate mr-2">{currentModelName}</span>
          <ChevronDown size={14} className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && availableModels.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-max min-w-[100%] max-w-[85vw] sm:max-w-[300px] bg-[#191919] border border-[#212327] rounded-xl shadow-2xl overflow-hidden flex flex-col">

            {/* Динамическая высота: обычная или на весь экран */}
            <div className={`overflow-y-auto [scrollbar-width:thin] overscroll-contain py-2 transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[85vh] sm:max-h-[80vh]' : 'max-h-[40vh] sm:max-h-60'}`}>

              {/* Авто-маршрутизатор */}
              {autoModel && (
                <div
                  onClick={() => handleSelect(autoModel.id)}
                  className={`px-4 py-2 cursor-pointer font-bold text-xs sm:text-sm hover:bg-[#212327] ${selectedModel === autoModel.id ? 'bg-[#212327] text-white' : 'text-white'}`}
                >
                  {autoModel.displayName}
                </div>
              )}

              {/* Группа бесплатных моделей */}
              {freeModels.length > 0 && (
                <>
                  <div className="px-4 py-1 mt-2 text-[10px] text-[#7d8187] uppercase tracking-widest bg-[#0a0a0a]">── Free Models ──</div>
                  {freeModels.map(m => (
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

              {/* Группа платных моделей */}
              {premiumModels.length > 0 && (
                <>
                  <div className="px-4 py-1 mt-2 text-[10px] text-[#7d8187] uppercase tracking-widest bg-[#0a0a0a]">── Premium Models ──</div>
                  {premiumModels.map(m => (
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
            </div>
          </div>
        )}
      </div>
    );
  };
  // VIEW 1: Стартовый экран
if (!isChatStarted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 font-sans transition-colors duration-500 overflow-x-hidden">

        {/* Адаптивная шапка */}
        <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex justify-between items-start sm:items-center gap-2">
          <ModelSelector />
          <button onClick={toggleLang} className="flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 rounded-full border border-white/25 text-white hover:bg-white/10 transition-colors font-mono text-[10px] sm:text-xs tracking-widest uppercase shrink-0">
            <Globe size={14} /> <span className="hidden sm:inline">{t.langSwitch}</span><span className="sm:hidden">{lang === 'en' ? 'RU' : 'EN'}</span>
          </button>
        </div>

        {/* Адаптивные заголовки */}
        <div className="max-w-3xl w-full mx-auto flex flex-col items-center text-center mt-12 sm:mt-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal mb-2 tracking-tight text-[#ffffff]">
            {t.greeting}
          </h1>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-normal mb-4 sm:mb-6 tracking-tighter text-[#ffffff] leading-tight">
            {t.question}
          </h2>
          <p className="text-[#dadbdf] text-sm sm:text-lg md:text-xl font-normal mb-8 sm:mb-12 max-w-[90%] sm:max-w-xl">
            {t.subtitle}
          </p>

<form
            onSubmit={handleSubmit}
            className="w-full bg-[#191919] border border-[#212327] rounded-full p-1 sm:p-2 flex items-center gap-1 sm:gap-2 focus-within:border-white/50 transition-colors"
          >
            <button
              type="button"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`p-2 sm:p-3 rounded-full transition-colors shrink-0 ${isRecording ? 'bg-[#ff7a17] text-white' : 'text-[#dadbdf] hover:bg-[#212327]'}`}
            >
              {/* Убрали size={24}, добавили классы ширины и высоты */}
              <Mic className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              // Уменьшили текст для мобилок (text-sm) и добавили min-w-0, чтобы инпут не распирал форму
              className="flex-1 min-w-0 bg-transparent text-white text-sm sm:text-lg placeholder-[#7d8187] focus:outline-none px-1 sm:px-2 font-normal"
            />

            <button
              type="submit"
              disabled={!input.trim() || !selectedModel}
              className="bg-white text-[#0a0a0a] p-2 sm:p-3 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              {/* Убрали size={24}, добавили классы ширины и высоты */}
              <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </form>
          {error && <p className="text-[#ff7a17] text-sm mt-4 font-mono uppercase tracking-wider">{error}</p>}
        </div>
      </div>
    );
  }

  // VIEW 2: Экран Чата

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#dadbdf] flex flex-col font-sans transition-colors duration-500">

      <header className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#212327] p-4">
        <div className="max-w-3xl w-full mx-auto flex justify-between items-center">
          <ModelSelector />
          <button onClick={toggleLang} className="px-3 py-1.5 rounded-full border border-white/25 text-white hover:bg-white/10 transition-colors font-mono text-xs tracking-widest uppercase">
            {t.langSwitch}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scroll-smooth p-4">
        <div className="max-w-3xl mx-auto w-full space-y-6 pb-32 pt-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] sm:max-w-[80%] px-5 py-4 text-base font-normal leading-relaxed ${msg.role === 'user' ? 'bg-[#191919] text-[#ffffff] border border-[#212327] rounded-[8px]' : msg.role === 'error' ? 'bg-transparent text-[#ff7a17] border border-[#ff7a17]/30 rounded-[8px]' : 'bg-transparent text-[#dadbdf]'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3 text-[#7d8187] px-5 py-3 font-mono text-xs uppercase tracking-widest">
                <Loader2 size={16} className="animate-spin" />
                <span>{t.typing}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="fixed bottom-0 w-full bg-[#0a0a0a] border-t border-[#212327] pt-4 pb-6 px-4">
        <div className="max-w-3xl mx-auto w-full">
          <form onSubmit={handleSubmit} className="bg-[#191919] border border-[#212327] rounded-[8px] p-2 flex items-end gap-2 focus-within:border-[#7d8187] transition-colors">
            <button type="button" onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={startRecording} onTouchEnd={stopRecording} className={`p-2 sm:p-3 mb-1 rounded-full transition-colors ${isRecording ? 'text-[#ff7a17]' : 'text-[#7d8187] hover:text-white hover:bg-[#212327]'}`}>
              <Mic size={20} />
            </button>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={t.placeholder} className="flex-1 bg-transparent text-[#ffffff] resize-none max-h-32 min-h-[44px] py-3 px-2 focus:outline-none font-normal" rows="1" />
            <button type="submit" disabled={isLoading || !input.trim() || !selectedModel} className="mb-1 p-2 sm:p-3 bg-white text-[#0a0a0a] rounded-full disabled:bg-[#212327] disabled:text-[#7d8187] transition-colors">
              <Send size={18} />
            </button>
          </form>
          <div className="text-center text-xs text-[#7d8187] mt-3 font-normal">{t.disclaimer}</div>
        </div>
      </footer>
    </div>
  );
}

export default App;