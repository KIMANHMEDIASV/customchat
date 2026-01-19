'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { conversationsAPI, chatAPI } from '@/lib/api';
import { Conversation, Message } from '@/types';
import Sidebar from '@/components/chat/Sidebar';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';
import ModelSelector from '@/components/chat/ModelSelector';
import { LogOut } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>();
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const createNewConversation = async () => {
    try {
      const response = await conversationsAPI.create({
        title: 'New Chat',
        modelId: selectedModelId,
      });
      setCurrentConversation(response.data);
      setMessages([]);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const loadConversation = async (id: string) => {
    try {
      const response = await conversationsAPI.getOne(id);
      setCurrentConversation(response.data);
      setMessages(response.data.messages || []);
      setSelectedModelId(response.data.modelId || undefined);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentConversation) {
      await createNewConversation();
      return;
    }

    setSending(true);
    try {
      const response = await chatAPI.sendMessage({
        conversationId: currentConversation.id,
        content,
        modelId: selectedModelId,
      });

      const { userMessage, assistantMessage } = response.data;
      setMessages((prev) => [...prev, userMessage, assistantMessage]);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      alert(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Sidebar
        currentConversationId={currentConversation?.id}
        onSelectConversation={loadConversation}
        onNewConversation={createNewConversation}
      />

      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between bg-white dark:bg-gray-800">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {currentConversation?.title || 'New Chat'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {currentConversation && (
          <ModelSelector
            selectedModelId={selectedModelId}
            onSelectModel={setSelectedModelId}
          />
        )}

        <MessageList messages={messages} />

        <ChatInput
          onSend={handleSendMessage}
          disabled={sending || !selectedModelId}
        />
      </div>
    </div>
  );
}
