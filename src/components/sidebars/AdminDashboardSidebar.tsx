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
  Users,
  Upload,
  LayoutDashboard,
  Shield,
  Image,
  Megaphone,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { adminTheme } from "@/styles/adminTheme";

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Journalists",
    url: "/admin/journalists",
    icon: Users,
  },
  {
    title: "CSV Import",
    url: "/admin/import",
    icon: Upload,
  },
  {
    title: "Banners",
    url: "/admin/banners",
    icon: Image,
  },
  {
    title: "Story Requests",
    url: "/admin/story-requests",
    icon: Megaphone,
  },
];

export function AdminDashboardSidebar() {
  const location = useLocation();

  const isActive = (item: (typeof items)[0]) => {
    if (item.exact) {
      return location.pathname === item.url;
    }
    return location.pathname.startsWith(item.url);
  };

  return (
    <Sidebar className={adminTheme.sidebar}>
      <SidebarContent className="pt-6">
        <SidebarGroup>
          <div className={adminTheme.sidebarHeader}>
            <Shield className={adminTheme.sidebarIcon} />
            <span className={adminTheme.sidebarTitle}>Admin</span>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 mt-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item)}>
                    <Link 
                      to={item.url}
                      className={isActive(item) ? adminTheme.sidebarItemActive : adminTheme.sidebarItem}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className={adminTheme.sidebarItemText}>
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
