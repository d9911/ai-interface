import { Mic, Send } from 'lucide-react'
import React, { useRef, useEffect } from 'react'
import { Translation } from '@/shared/config/i18n'
import s from './message-input.module.scss' // Импорт стилей

interface MessageInputProps {
  t: Translation
  input: string
  setInput: (val: string) => void
  handleSubmit: (e?: React.FormEvent) => void
  lang: string
  startRecording: () => void
  stopRecording: () => void
  isRecording: boolean
  isLoading: boolean
  selectedModel: string
  handleKeyDown: (e: React.KeyboardEvent) => void
}

export const MessageInput = ({ t, input, setInput, handleSubmit, startRecording, stopRecording, isRecording, isLoading, selectedModel, handleKeyDown }: MessageInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Эффект для автоматической подстройки высоты
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto' // Сбрасываем для пересчета
      const nextHeight = textarea.scrollHeight
      // Высота установится сама через CSS max-height, если текст слишком большой
      textarea.style.height = `${nextHeight}px`
    }
  }, [input])

  return (
    <footer className={s.footer}>
      <div className={s.container}>
        <div className="container-form">
          <form
            onSubmit={handleSubmit}
            className={`${s.form} relative flex w-full items-center gap-1 p-1 border border-[#212327] bg-[#191919]/80 backdrop-blur-md  shadow-2xl transition-all focus-within:border-[#ff7a17]/50 sm:p-2 sm:gap-2`}
          >
            <button
              type="button"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`${s.iconButton} ${isRecording ? s.recording : ''}`}
            >
              <Mic size={20} />
            </button>

            <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={t.placeholder} className={s.textarea} rows={1} />

            <button type="submit" disabled={isLoading || !input.trim() || !selectedModel} className={s.sendButton}>
              <Send size={18} />
            </button>
          </form>
        </div>
        <div className={s.disclaimer}>{t.disclaimer}</div>
      </div>
    </footer>
  )
}
