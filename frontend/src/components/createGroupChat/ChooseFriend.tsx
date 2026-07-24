import { cn } from "@/lib/utils";
import UserCard from "../friend/FriendCard";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import type { Friend } from "@/types/friend";

const ChooseFriend = ({
  displayFriends,
  setKeyword,
  handleChooseMember,
  members,
  setIsNext,
}: {
  displayFriends: Friend[];
  setKeyword: (value: string) => void;
  handleChooseMember: (friend: Friend) => void;
  members: Friend[];
  setIsNext: (value: boolean) => void;
}) => {
  return (
    <div>
      <Input
        placeholder="Nhập tên bạn cần tìm"
        onChange={(e) => setKeyword(e.target.value)}
      />
      <div className="mt-4 max-h-80 overflow-y-auto mb-4 space-y-2">
        {displayFriends.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Không có bạn bè
          </p>
        ) : (
          displayFriends.map((friend) => (
            <div
              key={friend._id}
              onClick={() => handleChooseMember(friend)}
              className={cn(
                "cursor-pointer hover:bg-muted rounded-md p-2",
                members.find((member) => member._id === friend._id) &&
                  "bg-blue-200 p-2 hover:bg-blue-200",
              )}
            >
              <UserCard friend={friend} />
            </div>
          ))
        )}
      </div>
      <DialogFooter>
        <Button onClick={() => setIsNext(true)}>Tiếp tục</Button>
      </DialogFooter>
    </div>
  );
};

export default ChooseFriend;
