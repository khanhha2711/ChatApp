import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import MessageItem from "./MessageItem";
import { useEffect, useRef } from "react";

const ChatBody = () => {
  const {
    activeConversation,
    messages: allMessages,
    conversations,
  } = useChatStore();

  const myId = useAuthStore.getState().user?._id;

  const messages = activeConversation
    ? (allMessages[activeConversation]?.items ?? [])
    : [];

  const convo = conversations.find((c) => c._id === activeConversation);

  if (!convo) return;
  const statusMessage =
    (convo.lastMessage?.seenBy?.length ?? 0) > 0 ? "Đã xem" : "Đã gửi";

  const participant = convo.participants.filter((p) => p._id !== myId);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [activeConversation, messages.length]);

  return (
    <div className="flex-1 overflow-y-scroll ">
      {messages.map((message, index) => (
        <div
          key={message._id}
          className={cn(
            "flex flex-col mt-2 mx-4 relative group",
            message.isOwn ? "justify-end" : "justify-start",
          )}
        >
          <MessageItem
            messages={messages}
            message={message}
            participant={participant}
            index={index}
          />
          {message.isOwn && message._id === convo.lastMessage?._id && (
            <p className="text-right text-sm ">{statusMessage}</p>
          )}
        </div>
      ))}
      <div ref={bottomRef}></div>
    </div>
  );
};

export default ChatBody;
