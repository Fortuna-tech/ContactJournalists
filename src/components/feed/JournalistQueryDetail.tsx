import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPitchesForQuery, updatePitchStatus } from "@/lib/api";
import { Pitch, Query } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type OutletContextType = {
  queries: Query[];
};

type LocationState = {
  query?: Query;
};

const JournalistQueryDetail = () => {
  const { queryId } = useParams<{ queryId: string }>();
  const navigate = useNavigate();
  const { queries = [] } = useOutletContext<OutletContextType>();
  const location = useLocation();
  const locationQuery = (location.state as LocationState | null)?.query;
  const activeQuery =
    queries.find((query) => query.id === queryId) ?? locationQuery ?? null;

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: pitches = [],
    isLoading: pitchesLoading,
    isError,
  } = useQuery({
    queryKey: ["pitches", queryId],
    queryFn: () => getPitchesForQuery(queryId!),
    enabled: !!queryId,
  });

  const updatePitchMutation = useMutation({
    mutationFn: async ({
      pitch,
      status,
    }: {
      pitch: Pitch;
      status: Pitch["status"];
    }) => updatePitchStatus(pitch.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pitches", queryId] });
      toast({ title: "Pitch updated!" });
    },
  });

  if (!queryId) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="w-fit"
          onClick={() => navigate("/feed")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to feed
        </Button>
        <h3 className="text-lg font-medium pr-4">Pitches ({pitches.length})</h3>
      </div>

      <Card className="p-6 space-y-6">
        {activeQuery ? (
          <div className="space-y-4">
            {pitchesLoading && (
              <p className="text-muted-foreground">Loading pitches...</p>
            )}
            {isError && (
              <p className="text-destructive">
                Unable to load pitches right now.
              </p>
            )}
            {!pitchesLoading && pitches.length === 0 && (
              <p className="text-muted-foreground">No pitches yet.</p>
            )}
            {pitches.map((pitch) => (
              <Card key={pitch.id} className="p-2 space-y-4 border-none">
                <p>{pitch.content}</p>
                <div className="flex flex-wrap gap-2 justify-between">
                  <Badge
                    variant={
                      pitch.status === "pending" ? "outline" : "secondary"
                    }
                    className={cn(
                      "text-xs py-0.5",
                      pitch.status === "responded"
                        ? "text-muted-foreground bg-muted"
                        : "text-primary bg-green-500/10"
                    )}
                  >
                    {pitch.status}
                  </Badge>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={
                        pitch.status === "responded" ? "default" : "outline"
                      }
                      disabled={updatePitchMutation.isPending}
                      onClick={() =>
                        updatePitchMutation.mutate({
                          pitch,
                          status: "responded",
                        })
                      }
                    >
                      Respond
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        pitch.status === "archived" ? "secondary" : "outline"
                      }
                      disabled={updatePitchMutation.isPending}
                      onClick={() =>
                        updatePitchMutation.mutate({
                          pitch,
                          status: "archived",
                        })
                      }
                    >
                      Archive
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-semibold">Query not found</p>
            <p className="text-sm text-muted-foreground">
              The query you&apos;re looking for is unavailable. It may have been
              removed or you may not have access to it.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default JournalistQueryDetail;
