import React from "react";
import { Label } from "../ui/label";
import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import type { UseFormRegister } from "react-hook-form";
import type { IFormValues } from "../chat/AddFriend";

interface SendRequestProps {
  register: UseFormRegister<IFormValues>;
  searchUserByEmail: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  loading: boolean;
}
const SendFriendRequest = ({
  register,
  searchUserByEmail,
  onSubmit,
  onBack,
  loading,
}: SendRequestProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-2">
        <span className="text-green-500">
          Tìm thấy{" "}
          <span className="font-semibold pb-2">@{searchUserByEmail}</span> rồi
          nè 🎉
        </span>{" "}
        <Label>Giới thiệu</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Chào bạn - có thể kết bạn được không? "
        />
        <DialogFooter>
          <div className="flex w-full gap-2">
            <DialogClose
              render={
                <Button type="button" onClick={onBack} className="flex-1">
                  Cancel
                </Button>
              }
            ></DialogClose>
            <Button type="submit" disabled={loading} className=" flex-1">
              {loading ? (
                <span>Đang gửi ...</span>
              ) : (
                <>
                  <UserPlus />
                  <p>Kết bạn</p>
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </div>
    </form>
  );
};

export default SendFriendRequest;
