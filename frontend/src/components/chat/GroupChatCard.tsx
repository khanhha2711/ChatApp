import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import type { Conversation } from "@/types/chat";
import ChatCard from "./ChatCard";
import { useSocketStore } from "@/stores/useSocketStore";

const GroupChatCard = ({ conversation }: { conversation: Conversation }) => {
  const { user } = useAuthStore();
  const {
    activeConversation,
    conversations,
    setActiveConversation,
    messages,
    getMessages,
  } = useChatStore();
  const { onlineUsers } = useSocketStore();

  const participants =
    conversations.find((convo) => convo._id === activeConversation)
      ?.participants || [];

  const unreadCount = conversation.participants.find(
    (p) => p._id === user?._id,
  );

  const online = participants.some((participant) =>
    onlineUsers.includes(participant._id),
  );

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      await getMessages(id);
    }
  };
  return (
    <ChatCard
      conversationId={conversation._id}
      name={conversation.group?.name || "CN"}
      createdAt={conversation.lastMessageAt || undefined}
      isActive={activeConversation === conversation._id}
      onSelect={handleSelectConversation}
      unreadCount={unreadCount}
      online={online}
    />
  );
};

export default GroupChatCard;
