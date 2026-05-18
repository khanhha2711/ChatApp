import LogOut from "@/components/auth/logout";
import { useAuthStore } from "@/stores/useAuthStore";

const ChatAppPage = () => {
  const user  = useAuthStore(s => s.user);
  return (
    <div>
      <p>{user?.displayName}</p>
      <LogOut />
    </div>
  );
};

export default ChatAppPage;
