'use client';

import { useState, useEffect } from 'react';
import { conversationsAPI } from '@/lib/api';
import { Conversation } from '@/types';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';

interface SidebarProps {
  currentConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}

export default function Sidebar({
  currentConversationId,
  onSelectConversation,
  onNewConversation,
}: SidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const response = await conversationsAPI.getAll();
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this conversation?')) return;

    try {
      await conversationsAPI.delete(id);
      setConversations(conversations.filter((c) => c.id !== id));
      if (currentConversationId === id) {
        onNewConversation();
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      <div className="p-4">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={20} />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {loading ? (
          <div className="text-center text-gray-400 py-4">Loading...</div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`flex items-center justify-between p-3 mb-1 rounded-lg cursor-pointer transition-colors ${
                currentConversationId === conv.id
                  ? 'bg-gray-800'
                  : 'hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <MessageSquare size={16} />
                <span className="truncate text-sm">{conv.title}</span>
              </div>
              <button
                onClick={(e) => handleDelete(conv.id, e)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
