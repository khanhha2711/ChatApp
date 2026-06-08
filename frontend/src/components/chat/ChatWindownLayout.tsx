import { useChatStore } from "@/stores/useChatStore";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import ChatWindowSkeleton from "./ChatWindowSkeleton";
import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";
import ChatWindownBody from "./ChatWindownBody";
import MessagesInput from "./MessagesInput";
import { useEffect } from "react";

const ChatWindownLayout = () => {
  const {
    activeConversationId,
    conversations,
    messageLoading: loading,
    messages,
    markAsSeen,
  } = useChatStore();

  const selectedConvo =
    conversations.find(
      (conversation) => conversation._id === activeConversationId,
    ) ?? null;

  useEffect(() => {
    if (!selectedConvo) {
      return;
    }
    const markSeen = async () => {
      try {
        await markAsSeen();
      } catch (error) {
        console.error("Lỗi khi markSeen", error);
      }
    };
    markSeen();
  });
  if (!selectedConvo) {
    return <ChatWelcomeScreen />;
  }

  if (loading) {
    return <ChatWindowSkeleton />;
  }

  return (
    <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
      <ChatWindowHeader />

      <div className="flex-1 overflow-y-auto bg-primary-foreground">
        <ChatWindownBody />
      </div>

      <MessagesInput selectedConvo={selectedConvo} />
    </SidebarInset>
  );
};

export default ChatWindownLayout;
