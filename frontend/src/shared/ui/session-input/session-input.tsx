import React, { useState } from 'react'
import { Check } from 'lucide-react'

interface SessionInputProps {
  sessionId: string
  setSessionId: (val: string) => void
  wrapperClassName?: string
  inputClassName?: string
}

export const SessionInput = ({ sessionId, setSessionId, wrapperClassName = '', inputClassName = '' }: SessionInputProps) => {
  // Внутренняя логика визуального отклика инкапсулирована здесь
  const [isApplied, setIsApplied] = useState(false)

  const handleApplyId = () => {
    if (!sessionId.trim()) return
    setIsApplied(true)
    setTimeout(() => setIsApplied(false), 2000)
  }

  return (
    <div className={`relative flex items-center ${wrapperClassName}`}>
      <input
        type="text"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        placeholder="Session ID (auto)"
        className={`w-full bg-[#191919] border border-[#212327] rounded-full text-center text-[#7d8187] focus:outline-none focus:border-[#ff7a17]/50 transition-colors pr-10 ${inputClassName}`}
      />
      <button
        type="button"
        onClick={handleApplyId}
        title="Применить ID"
        className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all duration-300 focus:outline-none hover:bg-white/10"
      >
        <Check size={16} className={`transition-colors duration-300 ${isApplied ? 'text-green-500' : 'text-[#7d8187]'}`} />
      </button>
    </div>
  )
}
