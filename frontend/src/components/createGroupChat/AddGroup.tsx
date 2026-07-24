import { X } from "lucide-react";
import UserAvatar from "../chat/UserAvatar";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import type { Friend } from "@/types/friend";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { IFormValues } from "../chat/NewGroupChatModal";

const AddGroup = ({
  register,
  errors,
  members,
  groupName,
  handleDelete,
  setIsNext,
  handleSubmit,
}: {
  register: UseFormRegister<IFormValues>;
  errors: FieldErrors<IFormValues>;
  members: Friend[];
  groupName: string;
  handleDelete: (memberId: string) => void;
  setIsNext: (value: boolean) => void;
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <Input placeholder="Nhập tên nhóm" id="name" {...register("name")} />
      {errors.name && <p>{errors.name.message}</p>}

      <div className="flex mt-4 overflow-x-auto mb-4">
        {members.map((member) => (
          <div key={member._id} className="relative w-fit p-2">
            <UserAvatar name={member.name} type="chat" />
            <div
              className="cursor-pointer"
              onClick={() => handleDelete(member._id)}
            >
              <X
                size={15}
                className="absolute z-1000 top-0.5 right-1.5 text-gray-600"
              />
            </div>
          </div>
        ))}
      </div>
      <DialogFooter>
        <Button
          type="button"
          className="cursor-pointer"
          onClick={() => setIsNext(false)}
        >
          Quay lại
        </Button>
        <Button
          disabled={groupName.trim() === "" || members.length < 2}
          type="submit"
          className="cursor-pointer"
        >
          Tạo nhóm
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddGroup;
