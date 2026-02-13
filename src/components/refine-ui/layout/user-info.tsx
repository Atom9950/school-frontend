import { UserAvatar } from "@/components/refine-ui/layout/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetIdentity } from "@refinedev/core";
import { isGuestMode } from "@/lib/guest-mode";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatar?: string;
};

export function UserInfo() {
  const { data: user, isLoading: userIsLoading } = useGetIdentity<User>();
  const guestMode = isGuestMode();

  if (guestMode) {
    return (
      <div className={cn("flex", "items-center", "gap-x-2")}>
        <div
          className={cn(
            "h-10 w-10 rounded-full bg-amber-200 flex items-center justify-center text-sm font-bold text-amber-900"
          )}
        >
          G
        </div>
        <div
          className={cn(
            "flex",
            "flex-col",
            "justify-between",
            "h-10",
            "text-left"
          )}
        >
          <span className={cn("text-sm", "font-medium", "text-muted-foreground")}>
            Guest User
          </span>
          <span className={cn("text-xs", "text-amber-600")}>Limited access</span>
        </div>
      </div>
    );
  }

  if (userIsLoading || !user) {
    return (
      <div className={cn("flex", "items-center", "gap-x-2")}>
        <Skeleton className={cn("h-10", "w-10", "rounded-full")} />
        <div className={cn("flex", "flex-col", "justify-between", "h-10")}>
          <Skeleton className={cn("h-4", "w-32")} />
          <Skeleton className={cn("h-4", "w-24")} />
        </div>
      </div>
    );
  }

  const { firstName, lastName, email } = user;

  return (
    <div className={cn("flex", "items-center", "gap-x-2")}>
      <UserAvatar />
      <div
        className={cn(
          "flex",
          "flex-col",
          "justify-between",
          "h-10",
          "text-left"
        )}
      >
        <span className={cn("text-sm", "font-medium", "text-muted-foreground")}>
          {firstName} {lastName}
        </span>
        <span className={cn("text-xs", "text-muted-foreground")}>{email}</span>
      </div>
    </div>
  );
}

UserInfo.displayName = "UserInfo";
