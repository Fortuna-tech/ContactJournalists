import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PitchCard } from "@/components/journalist/PitchCard";
import { getQuery, getPitchesForQuery, getProfile } from "@/lib/api";
import { Query, Pitch } from "@/types";

export default function RequestDetails() {
  const { id } = useParams<{ id: string }>();
  const [query, setQuery] = useState<Query | null>(null);
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const [queryData, pitchesData, profileData] = await Promise.all([
          getQuery(id),
          getPitchesForQuery(id),
          getProfile(),
        ]);
        setQuery(queryData);
        setPitches(pitchesData);
        setCurrentUserId(profileData.id);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!query) return <div className="p-8">Request not found</div>;

  return (
    <div className="container mx-auto py-8">
      <Button
        asChild
        variant="ghost"
        className="mb-6 pl-0 hover:pl-0 hover:bg-transparent"
      >
        <Link
          to="/journalist/requests"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Requests
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold">{query.title}</h1>
              {query.archivedAt && <Badge variant="outline">Closed</Badge>}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span>{query.categoryTitle}</span>
              </div>
              {query.deadline && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Deadline: {format(new Date(query.deadline), "PPP")}
                  </span>
                </div>
              )}
              <span>Posted {format(new Date(query.datePosted), "PPP")}</span>
            </div>

            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                {query.description}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Pitches ({pitches.length})
            </h2>
            <div className="grid gap-4">
              {pitches.length > 0 ? (
                pitches.map((pitch) => (
                  <PitchCard
                    key={pitch.id}
                    pitch={pitch}
                    currentUserId={currentUserId}
                    isJournalist={true}
                  />
                ))
              ) : (
                <p className="text-muted-foreground italic">
                  No pitches received yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-muted/30 rounded-lg p-6 border">
            <h3 className="font-semibold mb-4">Request Details</h3>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground mb-1">Status</dt>
                <dd className="font-medium">
                  {query.archivedAt ? "Closed" : "Open"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-1">
                  Preferred Contact
                </dt>
                <dd className="font-medium capitalize">
                  {query.preferredContactMethod?.replace("_", " ") || "Email"}
                </dd>
              </div>
              {query.attachmentUrl && (
                <div>
                  <dt className="text-muted-foreground mb-1">Attachment</dt>
                  <dd className="font-medium">
                    <a
                      href={query.attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Document
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 text-sm text-orange-100">
            <p className="flex items-start gap-4">
              <AlertCircle className="h-8 w-8 text-orange-500" />
              You will only receive pitches in response to the specific story
              requests you submitted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
