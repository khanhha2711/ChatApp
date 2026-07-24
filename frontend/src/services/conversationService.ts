import api from "@/lib/axios";

export const ConversationService = {
  createConversation: async (
    type: "direct" | "group",
    memberIds: string[],
    name?: string,
  ) => {
    const res = await api.post("/conversations", { type, name, memberIds });
    return res.data.conversation;
  },

  getConversations: async () => {
    const res = await api.get("/conversations");

    return res.data.conversations;
  },

  maskAsSeen: async (conversationId: string) => {
    const res = await api.patch(`/conversations/${conversationId}/seen`);
    return res.data;
  },
};
