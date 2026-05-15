import { Loader2 } from 'lucide-react';
import React from 'react';
import { Message } from '@/entities/message/model/types';
import { Translation } from '@/shared/config/i18n';

interface ChatLayoutProps {
  messages: Message[];
  isLoading: boolean;
  t: Translation;
  messagesEndRef: React.RefObject<HTMLDivElement | null>; // Fixed the type here
}

export const ChatLayout = ({ messages, isLoading, t, messagesEndRef }: ChatLayoutProps) => {
  return (
    <main className="flex-1 overflow-y-auto scroll-smooth p-4">
      <div className="max-w-3xl mx-auto w-full space-y-6 pb-32 pt-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[90%] sm:max-w-[80%] px-5 py-4 text-base font-normal leading-relaxed ${
                msg.role === 'user' ? 'bg-[#191919] text-[#ffffff] border border-[#212327] rounded-[8px]' : 
                msg.role === 'error' ? 'bg-transparent text-[#ff7a17] border border-[#ff7a17]/30 rounded-[8px]' : 
                'bg-transparent text-[#dadbdf]'
              }`}
            >
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
  );
};
