import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { UserRole } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api";
import { Loader2, User as UserIcon } from "lucide-react";

export interface ProfileFormData {
  press: string;
  company: string;
  website: string;
  linkedin: string;
  publisherProfile: string;
  xHandle: string;
  categories: string[];
}

interface ProfileFormProps {
  role: UserRole;
  initialData?: Partial<ProfileFormData>;
  onSave: (data: ProfileFormData) => Promise<void>;
  isSaving?: boolean;
  saveButtonText?: string;
}

export const ProfileForm = ({
  role,
  initialData,
  onSave,
  isSaving = false,
  saveButtonText = "Save Changes",
}: ProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    press: "",
    company: "",
    website: "",
    linkedin: "",
    publisherProfile: "",
    xHandle: "",
    categories: [],
    ...initialData,
  });

  // Ensure categories is initialized
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const { data: allCategories = [], isLoading: isLoadingCategories, isError: isCategoriesError } = useQuery(
    {
      queryKey: ["categories"],
      queryFn: getCategories,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default to "Uncategorised" if no categories selected
    const dataToSave = {
      ...formData,
      categories: formData.categories.length > 0 ? formData.categories : ["Uncategorised"],
    };
    onSave(dataToSave);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => {
      const currentCategories = prev.categories || [];
      const newCategories = currentCategories.includes(categoryId)
        ? currentCategories.filter((c) => c !== categoryId)
        : [...currentCategories, categoryId];
      return { ...prev, categories: newCategories };
    });
  };

  if (isLoadingCategories) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              <CardTitle>
                {!initialData ? "Set up profile" : "Update Profile"}
              </CardTitle>
            </div>
            <Button
              type="submit"
              variant="outline"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : saveButtonText}
            </Button>
          </div>
          <CardDescription>Your public profile details.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {role === "journalist" ? (
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
                <Label htmlFor="publisherProfile">Publisher Profile Link</Label>
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
              {role === "journalist"
                ? "Categories you usually cover"
                : "Categories you want to be featured in"}
            </Label>
            <div className="flex flex-wrap gap-2">
              {isCategoriesError || (!isLoadingCategories && allCategories.length === 0) ? (
                <p className="text-sm text-muted-foreground">
                  Categories coming soon
                </p>
              ) : (
                allCategories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={
                      formData.categories.includes(category.id)
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleCategoryToggle(category.id)}
                    className="cursor-pointer hover:bg-primary/90 px-3 py-1 text-sm transition-all"
                  >
                    {category.title}
                  </Badge>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
