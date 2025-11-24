import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { getProfile } from "@/lib/api";
import { useSubscriptionStatus } from "@/hooks/use-subscription";

const PressPitchGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: subscription, isLoading: isLoadingSubscription } =
    useSubscriptionStatus();
  const [formData, setFormData] = useState({
    beat: "",
    businessInfo: "",
    websiteUrl: "",
    additionalInfo: "",
  });
  const [generatedPitch, setGeneratedPitch] = useState<{
    subject: string;
    body: string;
  } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          const profile = await getProfile();
          if (profile) {
            setFormData((prev) => ({
              ...prev,
              businessInfo: profile.company
                ? `${profile.company} - ${
                    profile.meta?.bio || "Innovative company"
                  }`
                : prev.businessInfo,
              websiteUrl: profile.website || prev.websiteUrl,
            }));
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
    loadProfile();
  }, []);

  const handleGenerate = async () => {
    if (!formData.beat || !formData.businessInfo) {
      toast.error(
        "Please fill in the required fields (Beat and Business Info)"
      );
      return;
    }

    if (
      subscription?.remainingPitchGen <= 0 &&
      subscription?.maxPitchGen < 9999999 &&
      !isLoadingSubscription
    ) {
      toast.error("You have reached your monthly pitch generation limit.", {
        action: {
          label: "Upgrade",
          onClick: () => (window.location.href = "/founder/settings"),
        },
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedPitch(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-pitch",
        {
          body: formData,
        }
      );

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedPitch(data);
      toast.success("Pitch generated successfully!");
    } catch (error) {
      console.error("Error generating pitch:", error);
      toast.error("Failed to generate pitch. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: "subject" | "body") => {
    navigator.clipboard.writeText(text);
    toast.success(
      `${
        type === "subject" ? "Subject line" : "Email body"
      } copied to clipboard`
    );
  };

  const copyAll = () => {
    if (!generatedPitch) return;
    const text = `Subject: ${generatedPitch.subject}\n\n${generatedPitch.body}`;
    navigator.clipboard.writeText(text);
    toast.success("Full pitch copied to clipboard");
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">AI Press Pitch Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate compelling press pitches in seconds using advanced AI.
          Perfect for founders and agencies looking to secure media coverage.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="beat">
                What is the main topic or beat you are pitching?
              </Label>
              <Input
                id="beat"
                placeholder="e.g. New sustainable fashion tech, AI in healthcare..."
                value={formData.beat}
                onChange={(e) =>
                  setFormData({ ...formData, beat: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessInfo">
                Tell us about your business or story
              </Label>
              <Textarea
                id="businessInfo"
                placeholder="e.g. We just launched the world's first..."
                className="min-h-[100px]"
                value={formData.businessInfo}
                onChange={(e) =>
                  setFormData({ ...formData, businessInfo: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL (optional)</Label>
              <Input
                id="websiteUrl"
                type="url"
                placeholder="https://yourcompany.com"
                value={formData.websiteUrl}
                onChange={(e) =>
                  setFormData({ ...formData, websiteUrl: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                We'll scan your website to add relevant details to the pitch.
              </p>
            </div>

            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Pitch...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Pitch
                </>
              )}
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          {generatedPitch ? (
            <Card className="p-6 space-y-6 bg-muted/30 border-primary/20">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Generated Pitch</h2>
                <Button variant="outline" size="sm" onClick={copyAll}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy All
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="subject"
                    className="text-xs uppercase text-muted-foreground font-bold"
                  >
                    Subject Line
                  </Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      copyToClipboard(generatedPitch.subject, "subject")
                    }
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <Input
                  id="subject"
                  value={generatedPitch.subject}
                  onChange={(e) =>
                    setGeneratedPitch({
                      ...generatedPitch,
                      subject: e.target.value,
                    })
                  }
                  className="font-medium"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="body"
                    className="text-xs uppercase text-muted-foreground font-bold"
                  >
                    Email Body
                  </Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(generatedPitch.body, "body")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <Textarea
                  id="body"
                  value={generatedPitch.body}
                  onChange={(e) =>
                    setGeneratedPitch({
                      ...generatedPitch,
                      body: e.target.value,
                    })
                  }
                  className="min-h-[300px] font-sans"
                />
              </div>
            </Card>
          ) : (
            <Card className="p-6 flex flex-col items-center justify-center h-full min-h-[400px] text-center text-muted-foreground space-y-4 bg-muted/10 border-dashed">
              <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center">
                <Wand2 className="h-8 w-8 opacity-50" />
              </div>
              <div className="max-w-xs">
                <p className="font-medium text-foreground">Ready to generate</p>
                <p className="text-sm mt-1">
                  Fill out the form on the left and let our AI craft the perfect
                  pitch for you.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PressPitchGenerator;
