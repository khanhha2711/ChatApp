import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { loading, accessToken, refreshToken, user, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  const init = async () => {
    if (!accessToken) {
      await refreshToken();
    }
    if (accessToken && !user) {
      await fetchMe();
    }
    setStarting(false);
  };

  useEffect(() => {
    init();
  }, []);

  if (starting || loading) {
    return <div>Đang tải ...</div>;
  }
  if (!accessToken) {
    return <Navigate to={"/signin"} />;
  }
  return <Outlet></Outlet>;
};

export default ProtectedRoute;
