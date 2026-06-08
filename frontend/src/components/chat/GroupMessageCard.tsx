import type { Conversation } from "@/types/chat";
import ChatCard from "./ChatCard";
import { useAuthStore } from "@/stores/useAuthStore";
import UserAvatar from "./userAvatar";
import StatusBadge from "./StatusBadge";
import UnreadCountBadge from "./UnreadCountBadge";
import { useChatStore } from "@/stores/useChatStore";
import GroupChatAvatar from "./GroupChatAvatar";

const GroupMessageCard = ({ conversation }: { conversation: Conversation }) => {
  const { user } = useAuthStore();

  const {
    activeConversationId,
    setActiveConversation,
    messages,
    fetchMessages,
  } = useChatStore();

  if (!user) return null;

  const unreadCount = conversation.unreadCounts[user._id];
  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      await fetchMessages();
    }
  };
  return (
    <ChatCard
      conversationId={conversation._id}
      name={conversation.group.name ?? ""}
      timestamp={
        conversation.lastMessage?.createdAt
          ? new Date(conversation.lastMessage.createdAt)
          : undefined
      }
      isActive={activeConversationId === conversation._id}
      onSelect={handleSelectConversation}
      unreadCount={unreadCount}
      leftSection={
        <>
          {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
          <GroupChatAvatar
            participants={conversation.participants}
            type="sidebar"
          />
        </>
      }
      subtitle={<div>{conversation.participants.length} thành viên</div>}
    ></ChatCard>
  );
};

export default GroupMessageCard;
