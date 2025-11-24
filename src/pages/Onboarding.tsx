import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { UserRole } from "@/types";
import { supabase } from "@/lib/supabaseClient";
import { updateProfile } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import PricingSelection from "@/components/onboarding/PricingSelection";
import { ProfileForm, ProfileFormData } from "@/components/profile/ProfileForm";

const Onboarding = () => {
  const [step, setStep] = useState<"role" | "details" | "pricing">("role");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const forcedStep = searchParams.get("step");
    if (forcedStep === "plan") {
      setStep("pricing");
    }
  }, [searchParams]);

  const completeMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      if (!selectedRole) throw new Error("Please select a role");

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const updateData = {
        press: "",
        company: "",
        website: "",
        meta: {},
        role: selectedRole,
        onboarding_complete: true,
        categories: data.categories,
        linkedin: data.linkedin,
        x_handle: data.xHandle,
      };

      if (selectedRole === "journalist") {
        updateData.press = data.press;
        updateData.meta = { publisherProfile: data.publisherProfile };
      } else {
        updateData.company = data.company;
        updateData.website = data.website;
      }

      await updateProfile(updateData);
    },
    onSuccess: () => {
      toast({
        title: "Profile complete!",
        description: "Welcome to Contact Journalist.",
      });

      if (selectedRole === "journalist") {
        navigate("/feed");
      } else {
        setStep("pricing");
      }
    },
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep("details");
  };

  const handleProfileSave = async (data: ProfileFormData) => {
    completeMutation.mutate(data);
  };

  if (step === "pricing") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <PricingSelection onSkip={() => navigate("/feed")} />
      </div>
    );
  }

  if (step === "role") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">What's your role?</h1>
            <p className="text-muted-foreground">
              Choose the option that best describes you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card
              className="p-8 cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleRoleSelect("journalist")}
            >
              <div className="text-center space-y-2">
                <div className="text-4xl mb-4">📰</div>
                <h3 className="font-semibold text-lg">Journalist</h3>
                <p className="text-sm text-muted-foreground">
                  Looking for sources and quotes
                </p>
              </div>
            </Card>

            <Card
              className="p-8 cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleRoleSelect("agency")}
            >
              <div className="text-center space-y-2">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="font-semibold text-lg">PR Agency</h3>
                <p className="text-sm text-muted-foreground">
                  Pitching client stories
                </p>
              </div>
            </Card>

            <Card
              className="p-8 cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleRoleSelect("founder")}
            >
              <div className="text-center space-y-2">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="font-semibold text-lg">Founder</h3>
                <p className="text-sm text-muted-foreground">
                  Sharing expertise
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Complete your profile</h1>
            <p className="text-muted-foreground">
              Help us personalize your experience
            </p>
          </div>

          <ProfileForm
            role={selectedRole!}
            onSave={handleProfileSave}
            saveButtonText={
              completeMutation.isPending ? "Completing..." : "Complete Profile"
            }
            isSaving={completeMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
