import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { UserRole } from "@/types";
import { supabase } from "@/lib/supabaseClient";
import { updateProfile } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import PricingSelection from "@/components/onboarding/PricingSelection";

const CATEGORIES = [
  "Technology",
  "Business",
  "Healthcare",
  "Finance",
  "Marketing",
  "Lifestyle",
  "Entertainment",
  "Sports",
  "Politics",
  "Science",
];

const Onboarding = () => {
  const [step, setStep] = useState<"role" | "details" | "pricing">("role");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    press: "",
    company: "",
    website: "",
    linkedin: "",
    publisherProfile: "",
    xHandle: "",
  });

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
    mutationFn: async () => {
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
        categories: selectedCategories,
        linkedin: formData.linkedin,
        x_handle: formData.xHandle,
      };

      if (selectedRole === "journalist") {
        updateData.press = formData.press;
        updateData.meta = { publisherProfile: formData.publisherProfile };
      } else {
        updateData.company = formData.company;
        updateData.website = formData.website;
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

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeMutation.mutate();
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
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Complete your profile</h1>
            <p className="text-muted-foreground">
              Help us personalize your experience
            </p>
          </div>

          <Card className="p-8 space-y-6">
            {selectedRole === "journalist" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="press">Press / Publication</Label>
                  <Input
                    id="press"
                    value={formData.press}
                    onChange={(e) =>
                      setFormData({ ...formData, press: e.target.value })
                    }
                    placeholder="e.g., TechCrunch"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publisherProfile">
                    Publisher Profile Link
                  </Label>
                  <Input
                    id="publisherProfile"
                    type="url"
                    value={formData.publisherProfile}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        publisherProfile: e.target.value,
                      })
                    }
                    placeholder="https://..."
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="Your company name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    placeholder="https://..."
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <Input
                id="linkedin"
                type="url"
                value={formData.linkedin}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin: e.target.value })
                }
                placeholder="https://linkedin.com/in/..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="xHandle">X (Twitter) Handle</Label>
              <Input
                id="xHandle"
                value={formData.xHandle}
                onChange={(e) =>
                  setFormData({ ...formData, xHandle: e.target.value })
                }
                placeholder="@username"
                required
              />
            </div>

            <div className="space-y-3">
              <Label>
                {selectedRole === "journalist"
                  ? "Categories you usually cover"
                  : "Categories you want to be featured in"}
              </Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant={
                      selectedCategories.includes(category)
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleCategoryToggle(category)}
                    className="rounded-full"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          <Button
            type="submit"
            className="w-full h-12"
            disabled={
              selectedCategories.length === 0 || completeMutation.isPending
            }
          >
            {completeMutation.isPending ? "Completing..." : "Complete Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
