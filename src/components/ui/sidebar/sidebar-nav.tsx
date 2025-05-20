
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

export interface SidebarNavProps {
  items: {
    name: string;
    path: string;
    icon?: React.ReactNode;
    onClick?: () => Promise<void> | void;
  }[];
  title?: string;
  className?: string;
}

export function SidebarNav({ items, title, className }: SidebarNavProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {title && <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">{title}</h3>}
      {items?.length ? (
        <nav className="grid gap-1 px-2">
          {items.map((item, index) => {
            const isExternal = item.path.startsWith('http');
            
            if (isExternal) {
              return (
                <a
                  key={index}
                  href={item.path}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "justify-start",
                    "cursor-pointer"
                  )}
                  onClick={item.onClick}
                >
                  {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
                  {item.name}
                </a>
              );
            }
            
            return (
              <Link
                key={index}
                to={item.path}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "justify-start",
                  "cursor-pointer"
                )}
                onClick={item.onClick}
              >
                {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
                {item.name}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
