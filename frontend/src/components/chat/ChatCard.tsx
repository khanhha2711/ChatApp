import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import UserAvatar from "./UserAvatar";
import { formatShortTime } from "@/lib/formatTime";
import StatusBadge from "./StatusBadge";

interface IChatCard {
  name: string;
  lastMessage?: string;
  createdAt?: string;
  conversationId: string;
  onSelect: (id: string) => Promise<void>;
  isActive: boolean;
  unreadCount: number;
  online: boolean;
}
const ChatCard = ({
  conversationId,
  name,
  lastMessage,
  createdAt,
  onSelect,
  isActive,
  unreadCount,
  online,
}: IChatCard) => {
  return (
    <Card
      className={cn(" px-2.5 py-1.5 cursor-pointer", isActive && "bg-gray-200")}
      onClick={() => onSelect(conversationId)}
    >
      <div className="relative flex gap-3 items-center">
        <UserAvatar type="sidebar" name={name} className="" />
        <StatusBadge status={online ? "online" : "offline"} />
        {unreadCount > 0 && (
          <div className="absolute -top-1 left-8  bg-red-500 rounded-full w-5 h-5 text-center text-white">
            {unreadCount}
          </div>
        )}
        <div className="space-y-2 flex-1">
          <div className="flex justify-between">
            <p className="font-semibold capitalize">{name}</p>
            <p className="text-sm text-gray-500">
              {formatShortTime(createdAt || "")}
            </p>
          </div>
          <p>{lastMessage}</p>
        </div>
      </div>
    </Card>
  );
};

export default ChatCard;
