import { cn } from "@/lib/utils";
import { AvatarBadge } from "../ui/avatar";

const StatusBadge = ({ status }: { status: "online" | "offline" }) => {
  return (
    <AvatarBadge
      className={cn(
        "absolute z-50 top-7 -left-1 size-3 rounded-full border border-card",
        status === "online" && "bg-blue-700",
        status === "offline" && "bg-gray-500",
      )}
    ></AvatarBadge>
  );
};

export default StatusBadge;
