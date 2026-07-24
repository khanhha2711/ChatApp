"use client";

import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Moon, Sun } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Switch } from "../ui/switch";
import NewGroupChatModal from "../chat/NewGroupChatModal";
import GroupChatList from "../chat/GroupChatList";
import DirectChatList from "../chat/DirectChatList";
import AddFriend from "../chat/AddFriend";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import FriendList from "../friend/FriendList";
import CreateNewChat from "../chat/CreateNewChat";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();
  const { conversations, getConversation, isLoading, setActiveConversation } =
    useChatStore();

  useEffect(() => {
    void getConversation();
  }, [getConversation]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex justify-between items-center py-2">
              <h2>Moji</h2>
              <div className="flex gap-x-2 items-center">
                <Sun size={20} />
                <Switch />
                <Moon size={20} />
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenuButton title="Thêm bạn mới" className="cursor-pointer">
          <AddFriend />
        </SidebarMenuButton>
        {/* group */}
        <SidebarGroup>
          <Tabs defaultValue="chat">
            <TabsList variant="line">
              <TabsTrigger value="chat">Đoạn chat</TabsTrigger>
              <TabsTrigger value="friend">Bạn bè</TabsTrigger>
            </TabsList>
            <TabsContent value="chat">
              {/* direct */}
              <div className="flex justify-between">
                <SidebarMenuButton className="w-fit">
                  <CreateNewChat />
                </SidebarMenuButton>
              </div>

              <SidebarGroup>
                <SidebarGroupContent>
                  <DirectChatList
                    conversations={conversations}
                    isLoading={isLoading}
                    setActiveConversation={setActiveConversation}
                  />
                </SidebarGroupContent>
              </SidebarGroup>
              {/* Nhóm */}
              <SidebarGroup>
                <SidebarGroupLabel className="uppercase">
                  nhóm chat
                </SidebarGroupLabel>
                <SidebarGroupAction title="Tạo nhóm" className="cursor-pointer">
                  <NewGroupChatModal />
                </SidebarGroupAction>
                <SidebarGroupContent>
                  <GroupChatList
                    conversations={conversations}
                    isLoading={isLoading}
                    setActiveConversation={setActiveConversation}
                  />
                </SidebarGroupContent>
              </SidebarGroup>
            </TabsContent>
            <TabsContent value="friend">
              <FriendList />
            </TabsContent>
          </Tabs>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
