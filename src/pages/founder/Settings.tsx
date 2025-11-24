import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import {
  getProfile,
  getCategories,
  updateProfile,
  createPortalSession,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, CreditCard, Bell } from "lucide-react";
import { useSubscriptionStatus } from "@/hooks/use-subscription";
import { Progress } from "@/components/ui/progress";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const { data: subscription, isLoading: isLoadingSubscription } =
    useSubscriptionStatus();

  const { data: allCategories = [], isLoading: isLoadingCategories } = useQuery(
    {
      queryKey: ["categories"],
      queryFn: getCategories,
    }
  );

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({ title: "Settings updated" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleManageBilling = async () => {
    setIsPortalLoading(true);
    try {
      const { url } = await createPortalSession(window.location.href);
      window.location.href = url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load billing portal",
        variant: "destructive",
      });
    } finally {
      setIsPortalLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    if (!profile) return;

    const currentCategories = profile.categories || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];

    updateProfileMutation.mutate({ categories: newCategories });
  };

  const toggleAlerts = (enabled: boolean) => {
    if (!profile) return;

    updateProfileMutation.mutate({
      meta: {
        ...profile.meta,
        email_alerts: enabled,
      },
    });
  };

  if (isLoadingProfile || isLoadingCategories) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const emailAlertsEnabled = profile?.meta?.email_alerts ?? false;

  const pitchUsageUsed = subscription
    ? subscription.maxPitches - subscription.remainingPitches
    : 0;

  // Avoid division by zero or infinity for display
  const pitchPercent =
    subscription?.maxPitches && subscription.maxPitches > 0
      ? (pitchUsageUsed / subscription.maxPitches) * 100
      : 0;

  const pitchGenUsed = subscription
    ? subscription.maxPitchGen - subscription.remainingPitchGen
    : 0;
  const pitchGenPercent =
    subscription?.maxPitchGen && subscription.maxPitchGen > 0
      ? (pitchGenUsed / subscription.maxPitchGen) * 100
      : 0;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and notifications.
        </p>
      </div>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Configure how you want to be notified about new queries.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="email-alerts" className="flex flex-col space-y-1">
              <span>Email Alerts</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive emails when new queries match your selected categories.
              </span>
            </Label>
            <Switch
              id="email-alerts"
              checked={emailAlertsEnabled}
              onCheckedChange={toggleAlerts}
              disabled={updateProfileMutation.isPending}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <Label>Alert Categories</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Select the categories you want to receive alerts for.
            </p>

            <div className="flex flex-wrap gap-2">
              {allCategories.map((category) => {
                const isSelected = profile?.categories?.includes(category.id);
                return (
                  <Badge
                    key={category.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer hover:bg-primary/90 px-3 py-1 text-sm transition-all ${
                      !isSelected && "hover:bg-muted hover:text-foreground"
                    }`}
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.title}
                  </Badge>
                );
              })}
            </div>
            {allCategories.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No categories available.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Billing Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <CardTitle>Billing</CardTitle>
          </div>
          <CardDescription>
            Manage your subscription and payment details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Current Plan</p>
              <p className="text-sm text-muted-foreground capitalize">
                {subscription?.plan || "Free Trial"} •{" "}
                {subscription?.status || "Inactive"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleManageBilling}
              disabled={isPortalLoading}
            >
              {isPortalLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Manage Billing
            </Button>
          </div>

          {subscription && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Pitches Used</span>
                  <span className="text-muted-foreground">
                    {pitchUsageUsed} /{" "}
                    {subscription.maxPitches >= 9999999
                      ? "Unlimited"
                      : subscription.maxPitches}
                  </span>
                </div>
                <Progress value={pitchPercent} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">AI Pitch Generations</span>
                  <span className="text-muted-foreground">
                    {pitchGenUsed} /{" "}
                    {subscription.maxPitchGen >= 1000
                      ? "Unlimited"
                      : subscription.maxPitchGen}
                  </span>
                </div>
                <Progress value={pitchGenPercent} className="h-2" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Actions */}
      <div className="flex justify-end pt-4">
        <Button variant="destructive" className="gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Settings;
