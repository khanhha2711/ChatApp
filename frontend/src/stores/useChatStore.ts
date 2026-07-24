import { ConversationService } from "@/services/conversationService";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { messageService } from "@/services/messageService";

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  isLoading: false,
  activeConversation: null,
  messages: {},
  convoLoading: false,
  messLoading: false,
  setActiveConversation: (id) => set({ activeConversation: id }),
  reset: () => {
    set({
      conversations: [],
      messages: {},
      activeConversation: null,
      isLoading: false,
      messLoading: false,
    });
  },
  createConversation: async (type, name, memberIds) => {
    try {
      set({ convoLoading: true });
      const conversation = await ConversationService.createConversation(
        type,
        memberIds,
        name,
      );
      set((state) => {
        const exists = state.conversations.some(
          (c) => c._id.toString() === conversation._id.toString(),
        );

        return {
          conversations: exists
            ? state.conversations
            : [conversation, ...state.conversations],
          activeConversation: conversation._id,
        };
      });
    } catch (error) {
      console.error("Lỗi xảy ra khi tạo conversation:", error);
    } finally {
      set({ convoLoading: false });
    }
  },

  getConversation: async () => {
    try {
      set({ isLoading: true });

      const conversations = await ConversationService.getConversations();
      set({ conversations, isLoading: false });
    } catch (error) {
      console.error("Lỗi xảy ra khi lấy coversation:", error);
      set({ isLoading: false });
    }
  },

  getMessages: async (conversationId) => {
    const { activeConversation, messages } = get();
    const { user } = useAuthStore.getState();

    const convoId = conversationId ?? activeConversation;

    if (!convoId) return;

    const current = messages?.[convoId];

    const nextCursor =
      current?.nextCursor === undefined ? "" : current?.nextCursor;

    if (nextCursor === null) {
      return;
    }

    set({ messLoading: true });

    try {
      const { messages: fetchMessage, cursor } =
        await messageService.getMessages(convoId, nextCursor);

      const processed = fetchMessage.map((mess) => ({
        ...mess,
        isOwn: mess.senderId === user?._id,
      }));

      set((state) => {
        const prev = state.messages[convoId]?.items ?? [];
        const merged = prev.length > 0 ? [...processed, ...prev] : processed;

        return {
          messages: {
            ...state.messages,
            [convoId]: {
              items: merged,
              hasMore: !!cursor,
              nextCursor: cursor ?? null,
            },
          },
        };
      });
    } catch (error) {
      console.error("Lỗi xảy ra khi fetchMessages", error);
    } finally {
      set({ messLoading: false });
    }
  },

  sendDirectMessage: async (recipientId, content) => {
    try {
      set({ messLoading: true });
      const { activeConversation } = get();
      if (!activeConversation) return;
      await messageService.sendDirectMessage(
        recipientId,
        content,
        activeConversation,
      );
    } catch (error) {
      console.error("Có lỗi xảy ra khi gửi tin nhắn: ", error);
      throw error;
    } finally {
      set({ messLoading: false });
    }
  },

  sendGroupMessage: async (content) => {
    try {
      set({ messLoading: true });
      const { activeConversation } = get();
      if (!activeConversation) return;

      await messageService.sendGroupMessage(activeConversation, content);
    } catch (error) {
      console.error("Có lỗi xảy ra khi gửi tin nhắn: ", error);
      throw error;
    } finally {
      set({ messLoading: false });
    }
  },

  addMessage: async (message) => {
    try {
      const { user } = useAuthStore.getState();
      const { getMessages } = get();

      message.isOwn = message.senderId === user?._id;
      const convoId = message.conversationId;

      let prevItems = get().messages[convoId]?.items ?? [];

      if (prevItems.length === 0) {
        await getMessages(message.conversationId);
        prevItems = get().messages[convoId]?.items ?? [];
      }

      set((state) => {
        if (prevItems.some((m) => m._id === message._id)) return state;

        return {
          messages: {
            ...state.messages,
            [convoId]: {
              items: [...prevItems, message],
              hasMore: state.messages[convoId].hasMore,
              nextCursor: state.messages[convoId].nextCursor ?? undefined,
            },
          },
        };
      });
    } catch (error) {
      console.error("Lỗi xảy khi ra add message:", error);
    }
  },

  updateConversation: (conversation) => {
    console.log(conversation);
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c._id === conversation._id
          ? {
              ...c,
              unreadCount: conversation.unreadCount,
              lastMessage: conversation.lastMessage,
              lastMessageAt: conversation.lastMessageAt,
            }
          : c,
      ),
    }));
  },

  maskAsSeen: async () => {
    try {
      const { activeConversation, conversations } = get();

      if (!activeConversation) {
        return;
      }

      const convo = conversations.find((c) => c._id === activeConversation);

      if (!convo) return;

      if (convo.unreadCount === 0) return;

      await ConversationService.maskAsSeen(activeConversation);
    } catch (error) {
      console.error("Có lỗi xảy ra khi gửi tin nhắn: ", error);
      throw error;
    }
  },

  addConvo: (conversation) => {
    try {
      const { conversations } = get();

      const exists = conversations.some(
        (c) => c._id.toString() === conversation._id.toString(),
      );

      set((state) => ({
        conversations: exists
          ? state.conversations
          : [...state.conversations, conversation],
        activeConversation: conversation._id,
      }));
    } catch (error) {
      console.error("Có lỗi xảy ra khi tạo nhóm chat: ", error);
      throw error;
    }
  },
}));
