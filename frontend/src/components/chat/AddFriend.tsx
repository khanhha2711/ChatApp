import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SearchForm from "../addFriendModal/SearchFormByEmail";
import { useState } from "react";
import SendFriendRequest from "../addFriendModal/SendFriendRequest";
import type { User } from "@/types/user";
import { useFriendStore } from "@/stores/useFriendStore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface IFormValues {
  email: string;
  message: string;
}
const AddFriend = () => {
  const [isFound, setIsFound] = useState<boolean | null>(null);
  const [searchUser, setSearchUser] = useState<User>();
  const [searchedEmail, setSearchedEmail] = useState("");
  const { isLoading, searchUserByEmail, sendFriendRequest } = useFriendStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IFormValues>({ defaultValues: { email: "", message: "" } });

  const email = watch("email");

  const handleSearch = handleSubmit(async (data) => {
    const email = data.email.trim();
    if (!email) return;
    setIsFound(null);
    setSearchedEmail(email);

    try {
      const foundUser = await searchUserByEmail(email);
      if (foundUser) {
        setIsFound(true);
        setSearchUser(foundUser);
      } else {
        setIsFound(false);
      }
    } catch (error) {
      console.error(error);
      setIsFound(false);
    }
  });

  const handleSent = handleSubmit(async (data) => {
    if (!searchUser) return;
    try {
      await sendFriendRequest(searchUser._id, data.message.trim());
      toast.success("Gửi lời mời kết bạn thành công");
      handleCancel();
    } catch (error) {
      console.error("Lỗi xảy ra khi gửi lời mời kết bạn", error);
    }
  });

  const handleCancel = () => {
    reset();
    setSearchedEmail("");
    setIsFound(false);
  };
  return (
    <Dialog>
      <DialogTrigger
        render={
          <div>
            <UserPlus size={10} className="cursor-pointer" />
            <p>Thêm bạn mới </p>
          </div>
        }
        className="flex gap-2 border-gray-900 border-1 rounded-2xl px-4 py-1 w-full cursor-pointer "
      ></DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Thêm bạn bè</DialogTitle>
        </DialogHeader>
        {!isFound && (
          <SearchForm
            register={register}
            errors={errors}
            email={email}
            loading={isLoading}
            isFound
            searchUserByEmail={searchedEmail}
            onSubmit={handleSearch}
            onCancel={handleCancel}
          />
        )}
        {isFound && (
          <SendFriendRequest
            register={register}
            loading={isLoading}
            onBack={() => setIsFound(null)}
            searchUserByEmail={searchedEmail}
            onSubmit={handleSent}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddFriend;
