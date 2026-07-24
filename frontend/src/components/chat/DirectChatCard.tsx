import type { Conversation } from "@/types/chat";
import ChatCard from "./ChatCard";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSocketStore } from "@/stores/useSocketStore";

const DirectChatCard = ({ conversation }: { conversation: Conversation }) => {
  const { user } = useAuthStore();
  const {
    activeConversation,
    setActiveConversation,
    messages,
    getMessages,
    maskAsSeen,
  } = useChatStore();
  const { onlineUsers } = useSocketStore();

  const otherUser = conversation.participants.find((p) => p._id !== user?._id);
  const unreadCount = conversation.unreadCount || 0;

  const online = onlineUsers.includes(otherUser?._id || "");

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    await maskAsSeen();
    if (!messages[id]) {
      await getMessages(id);
    }
  };
  return (
    <ChatCard
      conversationId={conversation._id}
      name={otherUser?.name || "CN"}
      lastMessage={conversation.lastMessage?.content}
      createdAt={conversation.lastMessageAt || undefined}
      isActive={activeConversation === conversation._id}
      onSelect={handleSelectConversation}
      unreadCount={unreadCount}
      online={online}
    />
  );
};

export default DirectChatCard;
