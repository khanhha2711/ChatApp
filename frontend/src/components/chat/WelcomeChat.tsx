import { MessageCircle } from "lucide-react";
import { SidebarInset, SidebarTrigger } from "../ui/sidebar";

const WelcomeChat = () => {
  return (
    <SidebarInset className="flex w-full h-full bg-transparent">
      <SidebarTrigger className="-ml-1" />
      <div className="flex bg-primary-foreground rounded-2xl flex-1 items-center justify-center">
        <div className="text-center">
          <div className="size-24 mx-auto  rounded-full flex items-center justify-center shadow-glow pulse-ring">
            <MessageCircle />
          </div>
          <h2 className="text-2xl font-bold mb-2 ">
            Chào mừng bạn đến với Moji!
          </h2>
          <p className="text-muted-foreground">
            Chọn một cuộc hội thoại để bắt đầu chat!
          </p>
        </div>
      </div>
    </SidebarInset>
  );
};

export default WelcomeChat;
