import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, LogOut, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { getProfile, updateProfile } from "@/lib/api";
import { supabase } from "@/lib/supabaseClient";
import CategorySelector from "@/components/categories/CategorySelector";

import { Checkbox } from "@/components/ui/checkbox";

const profileFormSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters."),
  press: z.string().min(2, "Publication/Outlet name is required."),
  company: z.string().optional(),
  website: z
    .string()
    .url("Please enter a valid URL.")
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url("Please enter a valid LinkedIn URL.")
    .optional()
    .or(z.literal("")),
  x_handle: z.string().optional(),
  categories: z.array(z.string()).optional(),
  visibility: z.object({
    website: z.boolean().default(true),
    linkedin: z.boolean().default(true),
    x_handle: z.boolean().default(true),
  }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [initialMeta, setInitialMeta] = useState<Record<string, any>>({});

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: "",
      press: "",
      company: "",
      website: "",
      linkedin: "",
      x_handle: "",
      categories: [],
      visibility: {
        website: true,
        linkedin: true,
        x_handle: true,
      }
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getProfile();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const meta = profile.meta as any || {};
        setInitialMeta(meta);

        // Extract data carefully from potential meta fields or direct fields
        form.reset({
          full_name:
            profile.full_name || (profile.meta?.full_name as string) || "",
          press: profile.press || "",
          company: profile.company || "",
          website: profile.website || "",
          linkedin: profile.linkedin || "",
          x_handle: profile.x_handle || "",
          categories: profile.categories || [],
          visibility: {
            website: meta.visibility?.website !== false,
            linkedin: meta.visibility?.linkedin !== false,
            x_handle: meta.visibility?.x_handle !== false,
          }
        });
      } catch (error) {
        console.error("Failed to load profile", error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [form, toast]);

  async function onSubmit(data: ProfileFormValues) {
    setIsSaving(true);
    try {
      await updateProfile({
        press: data.press,
        company: data.company,
        website: data.website,
        linkedin: data.linkedin,
        x_handle: data.x_handle,
        categories: data.categories,
        meta: {
          ...initialMeta,
          full_name: data.full_name,
          visibility: data.visibility,
        },
      });

      toast({
        title: "Profile updated",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleDeactivate = async () => {
    // Placeholder for account deletion logic
    toast({
      title: "Account Deactivation",
      description: "Please contact support to permanently delete your account.",
    });
  };

  if (isLoading) {
    return <div className="p-8">Loading settings...</div>;
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and account preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your public profile details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="press"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publication / Outlet</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. TechCrunch" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Self-employed" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Website / Portfolio</FormLabel>
                      <FormField
                        control={form.control}
                        name="visibility.website"
                        render={({ field: visField }) => (
                          <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={visField.value}
                                onCheckedChange={visField.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-xs text-muted-foreground cursor-pointer">
                              Public
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormField
                          control={form.control}
                          name="visibility.linkedin"
                          render={({ field: visField }) => (
                            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={visField.value}
                                  onCheckedChange={visField.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-xs text-muted-foreground cursor-pointer">
                                Public
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/in/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="x_handle"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>X (Twitter) Handle</FormLabel>
                        <FormField
                          control={form.control}
                          name="visibility.x_handle"
                          render={({ field: visField }) => (
                            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={visField.value}
                                  onCheckedChange={visField.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-xs text-muted-foreground cursor-pointer">
                                Public
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormControl>
                        <Input placeholder="@handle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beats / Categories</FormLabel>
                    <FormControl>
                      <CategorySelector
                        selectedCategoryId={field.value?.[0] || null} // Simple selector for now, assuming single select or first one
                        onSelect={(id) => {
                          field.onChange([id]);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Select your primary beat. (Currently selected:{" "}
                      {field.value?.join(", ")})
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Manage your account status and session.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Log out</p>
              <p className="text-sm text-muted-foreground">
                Sign out of your account on this device.
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-destructive">Deactivate Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently remove your account and all data.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Deactivate
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeactivate}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, deactivate my account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
