import { Users2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import { useFriendStore } from "@/stores/useFriendStore";
import type { Friend } from "@/types/friend";
import ChooseFriend from "../createGroupChat/ChooseFriend";
import AddGroup from "../createGroupChat/AddGroup";
import { useChatStore } from "@/stores/useChatStore";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

export interface IFormValues {
  name: string;
}

const NewGroupChatModal = () => {
  const [keyword, setKeyword] = useState("");
  const [members, setMembers] = useState<Friend[]>([]);
  const [searchFriends, setSearchFriends] = useState<Friend[]>([]);
  const { friends, fetchFriends, searchFriend } = useFriendStore();
  const [isNext, setIsNext] = useState<boolean>(false);
  const { createConversation } = useChatStore();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IFormValues>({ defaultValues: { name: "" } });

  const name = watch("name");

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!keyword.trim()) {
        setSearchFriends([]);
        return;
      }

      try {
        const result = await searchFriend(keyword);
        setSearchFriends(result);
      } catch {
        setSearchFriends([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword, searchFriend]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const handleChooseMember = (friend: Friend) => {
    setMembers((prev) => {
      const exists = prev.some((member) => member._id === friend._id);
      if (exists) {
        return prev.filter((member) => member._id !== friend._id);
      }
      return [...prev, friend];
    });
  };

  const handleDelete = (memberId: string) => {
    setMembers((prev) => {
      const newMembers = prev.filter((member) => member._id !== memberId);
      if (newMembers.length === 0) {
        setIsNext(false);
      }
      return newMembers;
    });
  };

  const handleSent = handleSubmit(async (data) => {
    try {
      if (members.length < 2) {
        toast.error("Thêm thành viên");
      }
      const memberIds = members.map((member) => member._id);
      await createConversation("group", data.name, memberIds);
      handleCancel();
    } catch (error) {
      toast.error("Có lỗi xảy ra hãy thực hiện lại");
      return;
    }
  });

  const handleCancel = () => {
    reset();
    setSearchFriends([]);
    setKeyword("");
    setMembers([]);
    setIsNext(false);
    setOpen(false);
  };

  const displayFriends = keyword.trim() ? searchFriends : friends;
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value) {
          handleCancel();
        }
      }}
    >
      <DialogTrigger
        render={<Users2 className="cursor-pointer" size={15} />}
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo nhóm chat</DialogTitle>
        </DialogHeader>
        {isNext ? (
          <AddGroup
            register={register}
            errors={errors}
            members={members}
            groupName={name}
            handleDelete={handleDelete}
            setIsNext={setIsNext}
            handleSubmit={handleSent}
          />
        ) : (
          <ChooseFriend
            displayFriends={displayFriends}
            handleChooseMember={handleChooseMember}
            members={members}
            setKeyword={setKeyword}
            setIsNext={setIsNext}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewGroupChatModal;
