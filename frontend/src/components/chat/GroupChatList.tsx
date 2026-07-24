import type { Conversation } from "@/types/chat";
import GroupChatCard from "./GroupChatCard";

const GroupChatList = ({
  conversations,
  isLoading,
}: {
  conversations: Conversation[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  const GroupConversations =
    conversations?.filter((c) => c.type === "group") || [];
  if (GroupConversations.length === 0) {
    return <p>Chưa có cuộc trò chuyện</p>;
  }

  return (
    <div className="space-y-2">
      {GroupConversations.map((conversation) => (
        <GroupChatCard conversation={conversation} key={conversation._id} />
      ))}
    </div>
  );
};

export default GroupChatList;
