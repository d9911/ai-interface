import { useState, useRef, useEffect } from 'react'
import React from 'react'
import { ModelSelector } from '@/features/model-selector/ui/model-selector'
import { LangSwitcher } from '@/features/lang-switcher/ui/lang-switcher'
import { StartScreen } from '@/widgets/start-screen/ui/start-screen'
import { ChatLayout } from '@/widgets/chat-layout/ui/chat-layout'
import { MessageInput } from '@/widgets/message-input/ui/message-input'
import { translations, Language } from '@/shared/config/i18n'
import { Message, Model } from '@/entities/message/model/types'
import { useLang } from '@/shared/context/lang-context'

export const HomePage = () => {
  const { language: lang, changeLanguage } = useLang()

  const [isChatStarted, setIsChatStarted] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [availableModels, setAvailableModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState('')

  const t = translations[lang]
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('/api/models')
        const data = await res.json()
        setAvailableModels(data)
        if (data.length > 0) {
          setSelectedModel(data[0].id)
        }
      } catch (err) {
        console.error('Ошибка загрузки моделей:', err)
      }
    }
    fetchModels()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  const recognitionRef = useRef<any>(null)

  const toggleLang = () => changeLanguage(lang === 'en' ? 'ru' : 'en')

  const startRecording = () => {
    if (!SpeechRecognition) return setError(t.voiceNotSupported)
    setError('')
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = lang === 'ru' ? 'ru-RU' : 'en-US'
    recognition.interimResults = false

    recognition.onstart = () => setIsRecording(true)
    recognition.onresult = (e: any) => setInput((prev) => prev + (prev ? ' ' : '') + e.results[0][0].transcript)
    recognition.onerror = () => {
      setError(t.voiceError)
      setIsRecording(false)
    }
    recognition.onend = () => setIsRecording(false)
    recognition.start()
  }

  const stopRecording = () => recognitionRef.current?.stop()

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() || !selectedModel) return

    if (!isChatStarted) setIsChatStarted(true)

    const newUserMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, newUserMessage])
    setInput('')
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newUserMessage.content,
          modelId: selectedModel,
          history: messages, // Send history for context
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Server error')

      setMessages((prev) => [...prev, { role: 'ai', content: data.reply }])
    } catch (err: any) {
      setError(err.message)
      setMessages((prev) => [...prev, { role: 'error', content: err.message }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (!isChatStarted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 font-sans transition-colors duration-500 overflow-x-hidden">
        <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex justify-between items-start sm:items-center gap-2">
          <ModelSelector availableModels={availableModels} selectedModel={selectedModel} setSelectedModel={setSelectedModel} t={t} />
          <LangSwitcher lang={lang} toggleLang={toggleLang} langSwitchText={t.langSwitch} />
        </div>

        <StartScreen
          t={t}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          selectedModel={selectedModel}
        />
        {error && <p className="text-[#ff7a17] text-sm mt-4 font-mono uppercase tracking-wider">{error}</p>}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#dadbdf] flex flex-col font-sans transition-colors duration-500">
      <header className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#212327] p-4">
        <div className="max-w-3xl w-full mx-auto flex justify-between items-center">
          <ModelSelector availableModels={availableModels} selectedModel={selectedModel} setSelectedModel={setSelectedModel} t={t} />
          <button onClick={toggleLang} className="px-3 py-1.5 rounded-full border border-white/25 text-white hover:bg-white/10 transition-colors font-mono text-xs tracking-widest uppercase">
            {t.langSwitch}
          </button>
        </div>
      </header>

      <ChatLayout messages={messages} isLoading={isLoading} t={t} messagesEndRef={messagesEndRef} />

      <MessageInput
        t={t}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        lang={lang}
        startRecording={startRecording}
        stopRecording={stopRecording}
        isRecording={isRecording}
        isLoading={isLoading}
        selectedModel={selectedModel}
        handleKeyDown={handleKeyDown}
      />
    </div>
  )
}
