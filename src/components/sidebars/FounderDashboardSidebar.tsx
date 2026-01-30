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
    <Sidebar className="bg-[#F5F5DC] border-none mt-10">
      <SidebarContent className="pl-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => {
                const isActive = item.end
                  ? location.pathname === item.url
                  : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem
                    className={`py-1 pl-4 w-auto rounded-full transition-all duration-150 ${
                      isActive
                        ? "bg-[#D8B4FE] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        : "hover:bg-white/50 border-2 border-transparent"
                    }`}
                    key={item.title}
                  >
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url} className="text-black">
                        <item.icon className="text-black" />
                        <span className="text-lg font-light tracking-tight text-black">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
