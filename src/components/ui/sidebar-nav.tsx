
import React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface SidebarNavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

interface SidebarNavProps {
  items: SidebarNavItem[];
  className?: string;
}

export function SidebarNav({ items, className }: SidebarNavProps) {
  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "justify-start gap-3 px-3 py-2 h-auto",
            item.isActive
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "transition-colors"
          )}
        >
          {item.icon}
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}
