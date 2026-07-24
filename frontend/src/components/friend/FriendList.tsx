import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import UserCard from "./FriendCard";
import { useFriendStore } from "@/stores/useFriendStore";
import RequestCard from "./RequestCard";
import { toast } from "sonner";

const FriendList = () => {
  const { friends, receivedRequests, fetchFriends, fetchFriendRequests } =
    useFriendStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchFriends(), fetchFriendRequests()]);
      } catch (error) {
        toast.error("Không thể tải dữ liệu");
      }
    };

    loadData();
  }, []);

  return (
    <div>
      <Tabs defaultValue="friend">
        <TabsList>
          <TabsTrigger value="friend">Bạn bè</TabsTrigger>
          <TabsTrigger value="request">Yêu cầu kết bạn</TabsTrigger>
        </TabsList>
        <TabsContent value="friend" className="space-y-2">
          {friends.map((friend) => (
            <UserCard key={friend._id} friend={friend} />
          ))}
        </TabsContent>
        <TabsContent value="request" className='space-y-2'>
          {receivedRequests.map((request) => (
            <RequestCard key={request._id} request={request} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FriendList;
