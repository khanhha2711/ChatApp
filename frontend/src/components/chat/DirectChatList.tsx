import type { Conversation } from "@/types/chat";
import DirectChatCard from "./DirectChatCard";

const DirectChatList = ({
  conversations,
  isLoading,
}: {
  conversations: Conversation[];
  isLoading: boolean;
  setActiveConversation: (id: string) => void;
}) => {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  const directConversations =
    conversations?.filter((c) => c.type === "direct") || [];
  if (directConversations.length === 0) {
    return <p>Chưa có cuộc trò chuyện</p>;
  }

  return (
    <div className="space-y-2">
      {directConversations.map((conversation) => (
        <DirectChatCard conversation={conversation} key={conversation._id} />
      ))}
    </div>
  );
};

export default DirectChatList;
