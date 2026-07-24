import api from "@/lib/axios";
import type { Message } from "@/types/chat";

interface FetchMessageProps {
  messages: Message[];
  cursor?: string;
}
const pageLimit = 50;
export const messageService = {
  async getMessages(id: string, cursor?: string): Promise<FetchMessageProps> {
    const params: Record<string, string | number> = {
      limit: pageLimit,
    };

    if (cursor) {
      params.cursor = cursor;
    }
    const res = await api.get(`/conversations/${id}/messages`, {
      params,
    });
    return { messages: res.data.messages, cursor: res.data.nextCursor };
  },

  sendDirectMessage: async (
    recipientId: string,
    content: string,
    conversationId: string,
  ) => {
    const res = await api.post("/messages/direct", {
      recipientId,
      content,
      conversationId,
    });
    return res.data.message;
  },

  sendGroupMessage: async (conversationId: string, content: string) => {
    const res = await api.post("/messages/group", {
      conversationId,
      content,
    });
    return res.data.message;
  },
};
