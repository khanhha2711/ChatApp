import { SquarePen, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useFriendStore } from "@/stores/useFriendStore";
import type { Friend } from "@/types/friend";
import UserCard from "../friend/FriendCard";
import { useChatStore } from "@/stores/useChatStore";
import { toast } from "sonner";

const CreateNewChat = () => {
  const { searchFriend } = useFriendStore();
  const { createConversation } = useChatStore();
  const [keyword, setKeyWord] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (keyword.trim()) {
        const result = await searchFriend(keyword);
        setFriends(result);
      } else {
        setFriends([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  const handleCreateConversation = async (friendId: string) => {
    try {
      await createConversation("direct", "", [friendId]);
      setOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra hãy thực hiện lại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <SquarePen />
          <p>Tạo đoạn chat mới</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đoạn chat mới</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Nhập tên bạn cần tìm"
          onChange={(e) => setKeyWord(e.target.value)}
        />
        <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
          {friends.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Không tìm thấy bạn bè
            </p>
          ) : (
            friends.map((friend) => (
              <div
                key={friend._id}
                onClick={() => handleCreateConversation(friend._id)}
                className="cursor-pointer hover:bg-muted rounded-md"
              >
                <UserCard friend={friend} />
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewChat;
