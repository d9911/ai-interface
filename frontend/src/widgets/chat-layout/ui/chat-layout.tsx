import React from 'react'
import { Loader2 } from 'lucide-react'
import { Message } from '@/entities/message/model/types'
import { Translation } from '@/shared/config/i18n'
import { MessageItem } from '@/entities/message/ui/message-item'

interface ChatLayoutProps {
  messages: Message[]
  isLoading: boolean
  t: Translation
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}

export const ChatLayout = ({ messages, isLoading, t, messagesEndRef }: ChatLayoutProps) => {
  return (
    <main className="flex-1 overflow-y-auto scroll-smooth p-4">
      <div className="max-w-3xl mx-auto w-full space-y-8 pb-32 pt-4">
        {messages.map((msg, index) => (
          <MessageItem key={index} message={msg} />
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
  )
}
