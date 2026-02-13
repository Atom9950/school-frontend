import { isGuestMode } from "./guest-mode";

export function useGuestMode() {
  return {
    isGuest: isGuestMode(),
  };
}

export function useGuardAction(actionName: string) {
  const { isGuest } = useGuestMode();

  if (isGuest) {
    return {
      blocked: true,
      message: `Guest users cannot ${actionName.toLowerCase()}. Please sign up to get full access.`,
    };
  }

  return {
    blocked: false,
    message: null,
  };
}
