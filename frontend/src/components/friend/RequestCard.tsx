import type { FriendRequest } from "@/types/friend";
import UserAvatar from "../chat/UserAvatar";
import { Button } from "../ui/button";
import { formatShortTime } from "@/lib/formatTime";
import { useFriendStore } from "@/stores/useFriendStore";
import { toast } from "sonner";
import { useState } from "react";

interface RequestCardProps {
  request: FriendRequest;
}

const RequestCard = ({ request }: RequestCardProps) => {
  const { acceptFriendRequest, rejectFriendRequest } = useFriendStore();
  const [loading, setLoading] = useState<boolean>(false);

  const handleAccept = async () => {
    try {
      setLoading(true);
      await acceptFriendRequest(request._id);
    } catch (error) {
      toast.error("Có lỗi xảy ra hãy thực hiện lại");
    } finally {
      setLoading(false);
    }
  };
  const handleReject = async () => {
    try {
      setLoading(true);

      await rejectFriendRequest(request._id);
    } catch (error) {
      toast.error("Có lỗi xảy ra hãy thực hiện lại");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex gap-2 w-full items-center">
      <UserAvatar type={"sidebar"} name={request.from?.name} />
      <div className="w-full space-y-2">
        <div className="flex justify-between">
          <p className="font-bold capitalize">{request.from?.name}</p>
          <p>{formatShortTime(request.createdAt)}</p>
        </div>
        <p>{request.message}</p>
        <div className="flex gap-2 w-full pt-2">
          <Button className="flex-1" onClick={handleAccept} disabled={loading}>
            {loading ? <p>Đang xử lý ...</p> : <p> Xác nhận</p>}{" "}
          </Button>
          <Button className="flex-1" onClick={handleReject} disabled={loading}>
            {loading ? <p>Đang xử lý ...</p> : <p> Xóa</p>}{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
