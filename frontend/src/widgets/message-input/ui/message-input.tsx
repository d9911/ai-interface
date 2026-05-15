import { Mic, Send } from 'lucide-react'
import React from 'react'
import { Translation } from '@/shared/config/i18n'

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
  return (
    <footer className="fixed bottom-0 w-full bg-[#0a0a0a] border-t border-[#212327] pt-4 pb-6 px-4">
      <div className="max-w-3xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="bg-[#191919] border border-[#212327] rounded-[8px] p-2 flex items-end gap-2 focus-within:border-[#7d8187] transition-colors">
          <button
            type="button"
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`p-2 sm:p-3 mb-1 rounded-full transition-colors ${isRecording ? 'text-[#ff7a17]' : 'text-[#7d8187] hover:text-white hover:bg-[#212327]'}`}
          >
            <Mic size={20} />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.placeholder}
            className="flex-1 bg-transparent text-[#ffffff] resize-none max-h-32 min-h-[44px] py-3 px-2 focus:outline-none font-normal"
            rows={1}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !selectedModel}
            className="mb-1 p-2 sm:p-3 bg-white text-[#0a0a0a] rounded-full disabled:bg-[#212327] disabled:text-[#7d8187] transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
        <div className="text-center text-xs text-[#7d8187] mt-3 font-normal">{t.disclaimer}</div>
      </div>
    </footer>
  )
}
