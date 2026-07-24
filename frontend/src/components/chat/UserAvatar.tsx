import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface IUserAvatar {
  type: "sidebar" | "chat" | "profile";
  name: string;
  className?: string;
}
const UserAvatar = ({ type, name = "CN", className }: IUserAvatar) => {
  return (
    <Avatar
      className={cn(
        className ?? "",
        type === "sidebar" && "size-10 text-base",
        type === "chat" && "size-8 text-sm",
        type === "profile" && "size-24 text-3xl shadow-md",
      )}
    >
      <AvatarFallback className="bg-blue-500 text-white font-semibold">
        {name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
