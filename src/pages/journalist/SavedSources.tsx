import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

import { SourceCard } from "@/components/journalist/SourceCard";
import { getSavedSources, removeSavedSource } from "@/lib/api";
import { AgencyFounderProfile } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export default function SavedSources() {
  const [sources, setSources] = useState<AgencyFounderProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSources = async () => {
    setIsLoading(true);
    try {
      const data = await getSavedSources();
      setSources(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await removeSavedSource(id);
      toast({ title: "Source removed" });
      setSources(sources.filter((s) => s.userId !== id));
    } catch (error) {
      toast({ title: "Failed to remove source", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Bookmark className="h-8 w-8" />
          Saved Sources
        </h1>
        <p className="text-muted-foreground mt-2">
          Companies and founders you’ve bookmarked.
        </p>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sources.map((source) => (
            <SourceCard
              key={source.userId}
              source={source}
              onRemove={handleRemove}
              showRemove
            />
          ))}
          {sources.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No saved sources yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
