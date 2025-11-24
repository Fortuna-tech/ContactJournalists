import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Home,
  Search,
  Users,
  Mail,
  Activity,
  Settings,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const items = [
  {
    title: "Home",
    url: "/feed",
    icon: Home,
    end: true,
  },
  {
    title: "Find Journalists",
    url: "/feed/find-journalists",
    icon: Search,
  },
  {
    title: "AI Press Pitch",
    url: "/feed/pitch-generator",
    icon: Sparkles,
  },
  {
    title: "Media Lists",
    url: "/feed/media-lists",
    icon: Users,
  },
  {
    title: "Saved Contacts",
    url: "/feed/saved-contacts",
    icon: Mail,
  },
  {
    title: "My Activity",
    url: "/feed/activity",
    icon: Activity,
  },
  {
    title: "Settings",
    url: "/feed/settings",
    icon: Settings,
  },
  {
    title: "Help",
    url: "/feed/help",
    icon: HelpCircle,
  },
];

export function FounderDashboardSidebar() {
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
                    isActive={
                      item.end
                        ? location.pathname === item.url
                        : location.pathname.startsWith(item.url)
                    }
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
