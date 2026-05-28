
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface AppState {
  currentPage: 'home' | 'syntax' | 'examples' | 'assistant';
  apiKey: string;
  baseUrl: string;
  modelName: string;
  conversations: Conversation[];
  currentConversationId: string | null;
  setPage: (page: AppState['currentPage']) => void;
  setApiConfig: (config: { apiKey: string; baseUrl: string; modelName: string }) => void;
  createConversation: () => string;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  deleteConversation: (conversationId: string) => void;
  setCurrentConversation: (conversationId: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentPage: 'home',
      apiKey: '',
      baseUrl: 'https://api.openai.com/v1',
      modelName: 'gpt-4o',
      conversations: [],
      currentConversationId: null,

      setPage: (page) => set({ currentPage: page }),

      setApiConfig: (config) => set(config),

      createConversation: () => {
        const id = Date.now().toString();
        const conversation: Conversation = {
          id,
          title: '新对话',
          messages: [],
          createdAt: new Date(),
        };
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          currentConversationId: id,
        }));
        return id;
      },

      addMessage: (conversationId, message) => {
        const newMessage: Message = {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date(),
        };
        set((state) => ({
          conversations: state.conversations.map((conv) => {
            if (conv.id === conversationId) {
              const updatedConv = {
                ...conv,
                messages: [...conv.messages, newMessage],
              };
              // 更新标题
              if (conv.messages.length === 0 && message.role === 'user') {
                updatedConv.title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
              }
              return updatedConv;
            }
            return conv;
          }),
        }));
      },

      deleteConversation: (conversationId) => {
        set((state) => {
          const newConversations = state.conversations.filter((c) => c.id !== conversationId);
          let newCurrentId = state.currentConversationId;
          if (state.currentConversationId === conversationId) {
            newCurrentId = newConversations.length > 0 ? newConversations[0].id : null;
          }
          return {
            conversations: newConversations,
            currentConversationId: newCurrentId,
          };
        });
      },

      setCurrentConversation: (conversationId) => set({ currentConversationId: conversationId }),
    }),
    {
      name: 'st-assistant-storage',
    }
  )
);
