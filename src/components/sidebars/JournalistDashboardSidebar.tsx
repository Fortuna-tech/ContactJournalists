import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FileText, Bookmark, Settings, HelpCircle, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const items = [
  {
    title: "My Requests",
    url: "/journalist/requests",
    icon: FileText,
  },
  {
    title: "Saved Sources",
    url: "/journalist/saved-sources",
    icon: Bookmark,
  },
  {
    title: "Settings",
    url: "/journalist/settings",
    icon: Settings,
  },
  {
    title: "Help",
    url: "/journalist/help",
    icon: HelpCircle,
  },
];

export function JournalistDashboardSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="bg-background border-none mt-10">
      <SidebarContent className="pl-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => (
                <SidebarMenuItem
                  className="py-1 pl-4 text- w-auto hover:bg-muted rounded-full hover:text-primary"
                  key={item.title}
                >
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname.startsWith(item.url)}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span className="text-lg font-light tracking-tight">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
