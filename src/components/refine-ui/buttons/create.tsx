"use client";

import { Button } from "@/components/ui/button";
import { type BaseKey, useCreateButton, useNotification } from "@refinedev/core";
import { Plus } from "lucide-react";
import React from "react";
import { useGuestMode } from "@/lib/use-guest-mode";
import { disableGuestMode } from "@/lib/guest-mode";
import { useNavigate } from "react-router";

type CreateButtonProps = {
  /**
   * Resource name for API data interactions. `identifier` of the resource can be used instead of the `name` of the resource.
   * @default Inferred resource name from the route
   */
  resource?: BaseKey;
  /**
   * Access Control configuration for the button
   * @default `{ enabled: true, hideIfUnauthorized: false }`
   */
  accessControl?: {
    enabled?: boolean;
    hideIfUnauthorized?: boolean;
  };
  /**
   * `meta` property is used when creating the URL for the related action and path.
   */
  meta?: Record<string, unknown>;
} & React.ComponentProps<typeof Button>;

export const CreateButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  CreateButtonProps
>(({ resource, accessControl, meta, children, onClick, ...rest }, ref) => {
  const { hidden, disabled, LinkComponent, to, label } = useCreateButton({
    resource,
    accessControl,
    meta,
  });
  const { isGuest } = useGuestMode();
  const { open } = useNotification();
  const navigate = useNavigate();

  const isDisabled = disabled || rest.disabled || isGuest;
  const isHidden = hidden || rest.hidden;

  if (isHidden) return null;

  const handleClick = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (isDisabled && isGuest) {
      e.preventDefault();
      open?.({
        type: "error",
        message: "Guest users cannot create items. Please sign up to get full access.",
      });
      return;
    }
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <Button {...rest} ref={ref} disabled={isDisabled} asChild>
      <LinkComponent
        to={to}
        replace={false}
        onClick={handleClick}
      >
        {children ?? (
          <div className="flex items-center gap-2 font-semibold">
            <Plus className="w-4 h-4" />
            <span>{label ?? "Create"}</span>
          </div>
        )}
      </LinkComponent>
    </Button>
  );
});

CreateButton.displayName = "CreateButton";
