'use client';

import { Message } from '@/types';
import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <Bot size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-xl">Start a conversation with AI</p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.role === 'user' ? 'justify-end' : ''
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
            )}
            
            <div
              className={`max-w-3xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-2xl px-4 py-2'
                  : 'bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2'
              }`}
            >
              {message.role === 'user' ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              )}
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
