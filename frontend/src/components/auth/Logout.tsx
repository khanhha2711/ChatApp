import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
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

  return <Button onClick={handleClick}>LogOut</Button>;
};

export default LogOut;
