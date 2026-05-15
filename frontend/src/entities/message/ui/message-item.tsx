import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check } from 'lucide-react'
import { Message } from '@/entities/message/model/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface MessageItemProps {
  message: Message
}

export const MessageItem = ({ message }: MessageItemProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isUser = message.role === 'user'
  const isError = message.role === 'error'

  return (
    <div className={cn('flex group', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'relative max-w-[90%] sm:max-w-[80%] px-5 py-4 text-base font-normal leading-relaxed rounded-[8px] transition-all',
          isUser ? 'bg-[#191919] text-[#ffffff] border border-[#212327]' : isError ? 'bg-transparent text-[#ff7a17] border border-[#ff7a17]/30' : 'bg-transparent text-[#dadbdf]',
        )}
      >
        {!isUser && !isError && (
          <button
            onClick={handleCopy}
            className="absolute -top-3 -right-3 p-1.5 bg-[#191919] border border-[#212327] rounded-md text-[#7d8187] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            title="Copy message"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        )}

        <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
