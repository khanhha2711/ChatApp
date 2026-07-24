import type { Friend } from "@/types/friend";
import UserAvatar from "../chat/UserAvatar";

interface FriendCardProps {
  friend: Friend;
}

const UserCard = ({ friend }: FriendCardProps) => {
  return (
    <div className="flex gap-4 items-center">
      <UserAvatar type={"chat"} name={friend.name} />
      <p className="font-bold capitalize">{friend.name}</p>
    </div>
  );
};

export default UserCard;
