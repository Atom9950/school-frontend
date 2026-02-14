import { IResourceItem } from "@refinedev/core";

interface TitleHandlerOptions {
  resource?: IResourceItem;
  action?: "list" | "create" | "edit" | "show" | "clone";
  params?: Record<string, string | undefined>;
  pathname?: string;
}

export const customTitleHandler = ({
  resource,
  action,
  params,
  pathname,
}: TitleHandlerOptions): string => {
  let title = "CampusFlow";

  if (pathname === "/login") {
    title = "CampusFlow - Login";
  } else if (resource?.name) {
    const label = resource.meta?.label || resource.name;
    title = `CampusFlow - ${label}`;

    if (action === "show" && params?.id) {
      title = `CampusFlow - ${label} (#${params.id})`;
    }
  }

  return title;
};
