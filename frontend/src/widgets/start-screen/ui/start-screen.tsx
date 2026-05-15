import { Mic, ArrowRight } from 'lucide-react'
import React from 'react'
import { Translation } from '@/shared/config/i18n'
import s from '../../message-input/ui/message-input.module.scss'
interface StartScreenProps {
  t: Translation
  input: string
  setInput: (val: string) => void
  handleSubmit: (e?: React.FormEvent) => void
  startRecording: () => void
  stopRecording: () => void
  isRecording: boolean
  selectedModel: string
}

export const StartScreen = ({ t, input, setInput, handleSubmit, startRecording, stopRecording, isRecording, selectedModel }: StartScreenProps) => {
  return (
    <div className="max-w-3xl w-full mx-auto flex flex-col items-center text-center mt-12 sm:mt-0">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal mb-2 tracking-tight text-[#ffffff]">{t.greeting}</h1>
      <h2 className="text-3xl sm:text-5xl md:text-7xl font-normal mb-4 sm:mb-6 tracking-tighter text-[#ffffff] leading-tight">{t.question}</h2>
      <p className="text-[#dadbdf] text-sm sm:text-lg md:text-xl font-normal mb-8 sm:mb-12 max-w-[90%] sm:max-w-xl">{t.subtitle}</p>

      <form onSubmit={handleSubmit} className={s.startForm}>
        <button
          type="button"
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`p-2 sm:p-3 rounded-full transition-colors shrink-0 ${isRecording ? 'bg-[#ff7a17] text-white' : 'text-[#dadbdf] hover:bg-[#212327]'}`}
        >
          <Mic className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          className="flex-1 min-w-0 bg-transparent text-white text-sm sm:text-lg placeholder-[#7d8187] focus:outline-none px-1 sm:px-2 font-normal"
        />

        <button
          type="submit"
          disabled={!input.trim() || !selectedModel}
          className="bg-white text-[#0a0a0a] p-2 sm:p-3 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
      </form>
    </div>
  )
}
