import { SidebarInset, SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import UserAvatar from "./UserAvatar";
import ChatBody from "./ChatBody";
import InputChat from "./InputChat";
import WelcomeChat from "./WelcomeChat";
import { useChatStore } from "@/stores/useChatStore";
import ChatSkeleton from "../skeleton/chatSkeleton";

const ChatLayout = () => {
  const { activeConversation, conversations, isLoading } = useChatStore();
  const selectedConversation = conversations.find(
    (convo) => convo._id === activeConversation,
  );

  if (!selectedConversation) {
    return <WelcomeChat />;
  }

  if (isLoading) {
    return <ChatSkeleton />;
  }
  return (
    <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden shadow-sm rounded-2xl">
      <header className="sticky top-0 z-10 px-4 py-2 flex items-center border-b-1">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-3" />
          <div className="flex items-center gap-2">
            <UserAvatar
              name={
                selectedConversation?.group?.name ||
                selectedConversation?.participants[0]?.name ||
                ""
              }
              type="chat"
            />
            <p className="font-bold">
              {selectedConversation?.group?.name ||
                selectedConversation?.participants[0]?.name ||
                ""}
            </p>
          </div>
        </div>
      </header>
      <ChatBody />
      <InputChat />
    </SidebarInset>
  );
};

export default ChatLayout;
