import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router";

const LogOut = () => {
  const { signOut } = useAuthStore();
  const navigation = useNavigate();

  const handleClick = async () => {
    try {
      await signOut();
      navigation("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      variant="completeGhost"
      onClick={handleClick}
      className="cursor-pointer"
    >
      <LogOutIcon /> Đăng xuất
    </Button>
  );
};

export default LogOut;
