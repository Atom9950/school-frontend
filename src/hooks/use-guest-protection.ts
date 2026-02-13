import { useNotification } from "@refinedev/core";
import { useGuestMode } from "@/lib/use-guest-mode";
import { disableGuestMode } from "@/lib/guest-mode";
import { useNavigate } from "react-router";

export function useGuestProtection() {
  const { isGuest } = useGuestMode();
  const { open } = useNotification();
  const navigate = useNavigate();

  const protect = (action: string) => {
    if (isGuest) {
      open?.({
        type: "error",
        message: `Guest users cannot ${action}. Please sign up to get full access.`,
      });
      return false;
    }
    return true;
  };

  const protectAndRedirect = (action: string) => {
    if (isGuest) {
      open?.({
        type: "error",
        message: `Guest users cannot ${action}. Please sign up to get full access.`,
      });
      setTimeout(() => {
        disableGuestMode();
        navigate("/login");
      }, 1500);
      return false;
    }
    return true;
  };

  return {
    isGuest,
    protect,
    protectAndRedirect,
  };
}
