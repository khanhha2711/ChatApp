import ChatLayout from "@/components/chat/ChatLayout";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {  SidebarProvider } from "@/components/ui/sidebar";

const HomePage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-screen w-full p-2">
        <ChatLayout />
      </div>
    </SidebarProvider>
  );
};

export default HomePage;
