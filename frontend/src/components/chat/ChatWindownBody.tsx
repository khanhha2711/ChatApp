import { useChatStore } from "@/stores/useChatStore";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import { cn } from "@/lib/utils";
import MessageItem from "./MessageItem";

const ChatWindownBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
  } = useChatStore();

  const [lastMessageStatus, setLastMessageStatus] = useState<
    "delivered" | "seen"
  >("delivered");

  const messages = allMessages[activeConversationId!]?.items ?? [];
  const selectedConvo = conversations.find(
    (c) => c._id === activeConversationId,
  );

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastMessage = selectedConvo?.lastMessage;

    if (!lastMessage) {
      return;
    }

    const seenBy = selectedConvo?.seenBy ?? [];
    console.log(seenBy);
    setLastMessageStatus(seenBy.length > 0 ? "seen" : "delivered");
  }, [selectedConvo]);

  useLayoutEffect(() => {
    if (!messageEndRef.current) {
      return;
    }
    messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeConversationId]);
  if (!selectedConvo) {
    return <ChatWelcomeScreen />;
  }
  if (!messages?.length) {
    return <div>Chưa có tin nhắn nào trong cuộc trò chuyện này.</div>;
  }
  return (
    <div className="py-4 px-6 bg-primary-foreground h-full flex flex-col overflow-hidden">
      <div className="flex flex-col overflow-y-auto overflow-x-hidden beautiful-scrollbar">
        {messages.map((message, index) => (
          <MessageItem
            key={message._id}
            message={message}
            index={index}
            messages={messages}
            selectedConvo={selectedConvo}
            lastMessageStatus={lastMessageStatus}
          />
        ))}
        <div ref={messageEndRef}></div>
      </div>
    </div>
  );
};

export default ChatWindownBody;
