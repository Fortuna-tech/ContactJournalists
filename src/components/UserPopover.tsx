import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { getProfile } from "@/lib/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { CreditCard, LogOut } from "lucide-react";

type SupabaseUser = Awaited<
  ReturnType<typeof supabase.auth.getUser>
>["data"]["user"];

const fetchAuthUser = async (): Promise<SupabaseUser> => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("Not authenticated");
  return data.user;
};

const getUserInitials = (value?: string | null) => {
  if (!value) return "U";
  const [first = "", second = ""] = value.trim().split(/\s+/);
  return (first[0] ?? second[0] ?? "U").toUpperCase() + (second[0] ?? "");
};

const UserPopover = () => {
  const navigate = useNavigate();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchAuthUser,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const displayName = useMemo(() => {
    return (
      profile?.name ??
      profile?.full_name ??
      profile?.company ??
      profile?.press ??
      authUser?.user_metadata?.full_name ??
      authUser?.user_metadata?.name ??
      authUser?.email ??
      "User"
    );
  }, [authUser, profile]);

  const email =
    authUser?.email ??
    (typeof profile?.email === "string" ? profile.email : undefined) ??
    "No email";

  const avatarUrl =
    (profile as { avatar_url?: string } | undefined)?.avatar_url ??
    (authUser?.user_metadata?.avatar_url as string | undefined) ??
    (authUser?.user_metadata?.picture as string | undefined) ??
    "";

  const initials = getUserInitials(displayName);

  const handleBilling = () => {
    navigate("/billing");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!authUser) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-semibold leading-none">{displayName}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={handleBilling}
          >
            Billing
            <CreditCard className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={handleSignOut}
          >
            Sign out
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserPopover;
