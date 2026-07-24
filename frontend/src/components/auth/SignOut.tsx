import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const LogOut = () => {
  const logout = useAuthStore((state) => state.logOut);
  const navigate = useNavigate();
  const handleLogOut = () => {
    try {
      logout();
      toast.success("Logout thành công");
      navigate("/signin");
    } catch (error) {
      toast.error("Logout thật bại");
    }
  };
  return (
    <Button
      className="bg-transparent hover:bg-transparent text-black cursor-pointer"
      onClick={handleLogOut}
    >
      LogOut
    </Button>
  );
};

export default LogOut;
