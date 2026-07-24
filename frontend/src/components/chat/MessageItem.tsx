import { cn } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import type { Message, Participant } from "@/types/chat";
import { formatMessageTime } from "@/lib/formatTime";

const MessageItem = ({
  messages,
  message,
  participant,
  index,
}: {
  messages: Message[];
  message: Message;
  participant: Participant[];
  index: number;
}) => {
  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;

  const isShowTime =
    index === 0 ||
    new Date(message?.createdAt ?? 0).getTime() -
      new Date(prev?.createdAt ?? 0).getTime() >
      30000;

  const isGroupBreak = isShowTime || message.senderId !== prev?.senderId;

  return (
    <div className={cn("flex", message.isOwn && " justify-end ")}>
      {!message.isOwn && (
        <div className="w-10 flex items-center">
          {isGroupBreak && (
            <UserAvatar
              name={
                participant.find((p) => p._id === message.senderId)?.name ||
                "CN"
              }
              type="chat"
              className="mr-2"
            />
          )}
        </div>
      )}
      <div className="relative group w-fit">
        <p
          className={cn(
            "rounded-lg p-2",
            message.isOwn ? "bg-blue-500 text-white " : "bg-gray-200 ",
          )}
        >
          {message.content}
        </p>
        <p
          className={cn(
            "absolute top-1/2 -translate-y-1/2 hidden group-hover:block  whitespace-nowrap text-xs text-gray-500",
            message.isOwn ? "right-full mr-2" : "left-full ml-2",
          )}
        >
          {formatMessageTime(message.createdAt || "")}
        </p>
      </div>
    </div>
  );
};

export default MessageItem;
