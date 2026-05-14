import { useState, useRef, useEffect } from 'react';
import { Mic, ArrowRight, Send, Loader2, MessageSquare, ChevronDown } from 'lucide-react';

function App() {
  // Состояния приложения
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]); // Хранение истории переписки
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef(null);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Настройка Web Speech API (Голосовой ввод)
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionRef = useRef(null);

  const startRecording = () => {
    if (!SpeechRecognition) {
      setError('Ваш браузер не поддерживает голосовой ввод.');
      return;
    }
    setError('');
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + (prev ? ' ' : '') + transcript);
    };
    recognition.onerror = () => {
      setError('Ошибка при записи голоса.');
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  // Функция отправки сообщения
  const handleSubmit = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    // Переключаем на экран чата, если это первое сообщение
    if (!isChatStarted) setIsChatStarted(true);

    const newUserMessage = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSend }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка сервера');

      setMessages((prev) => [...prev, { role: 'ai', content: data.reply }]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [...prev, { role: 'error', content: err.message }]);
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

  // ==========================================
  // VIEW 1: Стартовый экран (как на скриншоте)
  // ==========================================
  if (!isChatStarted) {
    return (
      <div className="min-h-screen bg-[#0A2540] text-white flex flex-col justify-between p-6 sm:p-12 transition-all duration-500">
        <div className="max-w-3xl w-full mx-auto mt-12 sm:mt-24">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
            <MessageSquare size={24} className="text-white" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold mb-2">Hi there!</h1>
          <h2 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">What would you like to know?</h2>
          <p className="text-gray-300 text-lg sm:text-xl font-light mb-12">
            Use one of the most common prompts below<br className="hidden sm:block" /> or ask your own question
          </p>
        </div>

        <div className="max-w-3xl w-full mx-auto mb-8">
          <form
            onSubmit={handleSubmit}
            className="bg-[#152e4d] border border-[#2e4a6d] rounded-full p-2 flex items-center gap-2 focus-within:border-blue-500 transition-colors shadow-xl"
          >
            <button
              type="button"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              className={`p-3 rounded-full transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-blue-400 hover:bg-[#203a5c]'}`}
              title="Удерживайте для записи голоса"
            >
              <Mic size={24} />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask whatever you want"
              className="flex-1 bg-transparent text-white text-lg placeholder-gray-400 focus:outline-none px-2"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight size={24} />
            </button>
          </form>
          {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: Экран Чата (Привычный интерфейс)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#212121] text-gray-100 flex flex-col font-sans transition-all duration-500">
      {/* Шапка чата */}
      <header className="sticky top-0 z-10 bg-[#212121] text-gray-200 p-3 flex justify-between items-center px-4">
        <button className="flex items-center gap-2 hover:bg-gray-800 p-2 rounded-lg transition-colors text-lg font-medium">
          ChatGPT <span className="text-gray-400 text-sm">3.5</span> <ChevronDown size={16} className="text-gray-400" />
        </button>
      </header>

      {/* Контейнер сообщений */}
      <main className="flex-1 overflow-y-auto scroll-smooth p-4">
        <div className="max-w-3xl mx-auto space-y-6 pb-24">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3 text-base leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#2f2f2f] text-gray-100' // Пузырь пользователя
                    : msg.role === 'error'
                      ? 'bg-red-900/50 text-red-200 border border-red-800' // Ошибка
                      : 'bg-transparent text-gray-100' // Ответ ИИ (без фона)
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 text-gray-400 px-5 py-3">
                <Loader2 size={20} className="animate-spin" />
                <span>ChatGPT печатает...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Панель ввода */}
      <footer className="fixed bottom-0 w-full bg-gradient-to-t from-[#212121] via-[#212121] to-transparent pt-6 pb-6 px-4">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-[#2f2f2f] rounded-[24px] p-2 flex items-end gap-2 focus-within:ring-1 focus-within:ring-gray-500 shadow-lg"
          >
            <button
              type="button"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              className={`p-2 sm:p-3 mb-1 rounded-full transition-colors ${isRecording ? 'text-red-400 bg-red-900/30' : 'text-gray-400 hover:text-gray-200'}`}
              title="Голосовой ввод"
            >
              <Mic size={20} />
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything"
              className="flex-1 bg-transparent text-gray-100 resize-none max-h-32 min-h-[44px] py-3 px-2 focus:outline-none"
              rows="1"
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="mb-1 p-2 sm:p-3 bg-white text-black rounded-full disabled:bg-[#424242] disabled:text-gray-500 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="text-center text-xs text-gray-500 mt-3">
            ChatGPT can make mistakes. Check important info.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;