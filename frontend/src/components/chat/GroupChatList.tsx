import { useChatStore } from "@/stores/useChatStore";
import React from "react";
import GroupMessageCard from "./GroupMessageCard";

const GroupChatList = () => {
  const { conversations } = useChatStore();

  if (!conversations) {
    return;
  }

  const groupConversations = conversations.filter(
    (conversation) => conversation.type === "group",
  );
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {groupConversations.map((conversation) => (
        <GroupMessageCard conversation={conversation} key={conversation._id} />
      ))}
    </div>
  );
};

export default GroupChatList;
