import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getMyPitches, getProfile } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

import { useToast } from "@/components/ui/use-toast";
import { Pitch } from "@/types";
import { ActivityPitchCard } from "@/components/feed/ActivityPitchCard";

const MyActivity = () => {
  const { toast } = useToast();
  const { data: pitches = [], isLoading } = useQuery({
    queryKey: ["my-pitches"],
    queryFn: getMyPitches,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const handleExternalSubmission = (pitch: Pitch) => {
    if (!pitch.query?.journalist) return;
    const method = pitch.query.preferredContactMethod;
    const journalist = pitch.query.journalist;

    // Copy to clipboard
    navigator.clipboard.writeText(pitch.content);
    toast({
      title: "Pitch copied!",
      description: "Your pitch has been copied to your clipboard.",
    });

    // Open link
    let url = "";
    if (method === "email") {
      url = `mailto:${journalist.email}?subject=${encodeURIComponent(
        "Pitch: " + pitch.query.title
      )}`;
    } else if (method === "x_dm") {
      url = `https://twitter.com/${journalist.xHandle}`;
    } else if (method === "website") {
      url = journalist.website?.startsWith("http")
        ? journalist.website
        : `https://${journalist.website}`;
    }

    if (url) {
      window.open(url, "_blank");
    } else {
      toast({
        title: "Error",
        description: "No contact link available.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">My Activity</h1>
        <p className="text-muted-foreground">
          Track your pitches and responses.
        </p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-20 w-full" />
            </Card>
          ))
        ) : pitches.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <p>No activity found. Start pitching to journalists!</p>
          </Card>
        ) : (
          pitches.map((pitch) => (
            <ActivityPitchCard
              key={pitch.id}
              pitch={pitch}
              currentUserId={profile?.id}
              onExternalSubmission={handleExternalSubmission}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyActivity;
