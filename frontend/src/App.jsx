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

  // UI компонент для выбора модели (xAI style)
// UI компонент для выбора модели (Сгруппированный xAI style)
  const ModelSelector = () => {
    // Группируем модели для красивого отображения
    const autoModel = availableModels.find(m => m.provider === 'openrouter_auto');
    const freeModels = availableModels.filter(m => m.provider === 'openrouter');
    const premiumModels = availableModels.filter(m => m.provider === 'openai' || m.provider === 'deepseek');

    return (
      <div className="relative inline-block">
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="appearance-none bg-transparent border border-white/25 text-white font-mono text-xs tracking-widest uppercase py-2 pl-4 pr-10 rounded-full hover:bg-white/10 focus:outline-none focus:border-white/50 transition-colors cursor-pointer max-w-[250px] sm:max-w-md truncate"
          disabled={availableModels.length === 0}
        >
          {availableModels.length === 0 ? (
            <option value="" className="bg-[#191919]">{t.noModels}</option>
          ) : (
            <>
              {/* Авто-маршрутизатор (всегда сверху) */}
              {autoModel && (
                <option value={autoModel.id} className="bg-[#191919] text-white font-bold">
                  {autoModel.displayName}
                </option>
              )}

              {/* Группа бесплатных моделей */}
              {freeModels.length > 0 && (
                <optgroup label="── Free OpenRouter Models ──" className="bg-[#0a0a0a] text-[#7d8187] font-sans">
                  {freeModels.map(m => (
                    <option key={m.id} value={m.id} className="bg-[#191919] text-white font-mono">
                      {m.displayName}
                    </option>
                  ))}
                </optgroup>
              )}

              {/* Группа платных моделей (если ключи добавлены в .env) */}
              {premiumModels.length > 0 && (
                <optgroup label="── Premium / Paid Models ──" className="bg-[#0a0a0a] text-[#7d8187] font-sans">
                  {premiumModels.map(m => (
                    <option key={m.id} value={m.id} className="bg-[#191919] text-[#ff7a17] font-mono">
                      {m.displayName}
                    </option>
                  ))}
                </optgroup>
              )}
            </>
          )}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/70" />
      </div>
    );
  };
  // VIEW 1: Стартовый экран

  if (!isChatStarted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 sm:p-12 font-sans transition-colors duration-500">
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <ModelSelector />
          <button onClick={toggleLang} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/25 text-white hover:bg-white/10 transition-colors font-mono text-xs tracking-widest uppercase">
            <Globe size={14} /> {t.langSwitch}
          </button>
        </div>

        <div className="max-w-3xl w-full mx-auto flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl font-normal mb-2 tracking-tight text-[#ffffff]">{t.greeting}</h1>
          <h2 className="text-5xl sm:text-7xl font-normal mb-6 tracking-tighter text-[#ffffff]">{t.question}</h2>
          <p className="text-[#dadbdf] text-lg sm:text-xl font-normal mb-12 max-w-xl">{t.subtitle}</p>

          <form onSubmit={handleSubmit} className="w-full bg-[#191919] border border-[#212327] rounded-full p-2 flex items-center gap-2 focus-within:border-white/50 transition-colors">
            <button type="button" onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={startRecording} onTouchEnd={stopRecording} className={`p-3 rounded-full transition-colors ${isRecording ? 'bg-[#ff7a17] text-white' : 'text-[#dadbdf] hover:bg-[#212327]'}`}>
              <Mic size={24} />
            </button>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.placeholder} className="flex-1 bg-transparent text-white text-lg placeholder-[#7d8187] focus:outline-none px-2 font-normal" />
            <button type="submit" disabled={!input.trim() || !selectedModel} className="bg-white text-[#0a0a0a] p-3 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <ArrowRight size={24} />
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