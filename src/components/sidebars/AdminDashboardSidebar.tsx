import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Users, Upload, LayoutDashboard, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

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
    <Sidebar className="bg-background border-none mt-10">
      <SidebarContent className="pl-4">
        <SidebarGroup>
          <div className="flex items-center gap-2 px-4 py-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">Admin</span>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => (
                <SidebarMenuItem
                  className="py-1 pl-4 text- w-auto hover:bg-muted rounded-full hover:text-primary"
                  key={item.title}
                >
                  <SidebarMenuButton asChild isActive={isActive(item)}>
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
