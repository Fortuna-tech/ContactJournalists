import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CheckCheck, ExternalLink, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Pitch } from "@/types";
import { PitchComments } from "@/components/journalist/PitchComments";

interface ActivityPitchCardProps {
  pitch: Pitch;
  currentUserId?: string;
  onExternalSubmission: (pitch: Pitch) => void;
}

export function ActivityPitchCard({
  pitch,
  currentUserId,
  onExternalSubmission,
}: ActivityPitchCardProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg mb-1">
              {pitch.query?.title || "Unknown Query"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Sent{" "}
              {formatDistanceToNow(new Date(pitch.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <CheckCheck className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500">Pitch sent</span>
          </div>
        </div>

        <div className="bg-muted/30 p-4 rounded-md text-sm whitespace-pre-wrap">
          {pitch.content}
        </div>

        {pitch.query?.preferredContactMethod &&
          pitch.query.preferredContactMethod !== "platform" &&
          pitch.query.journalist && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-800 flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <p className="font-medium">
                Preferred method for submitting pitches is via{" "}
                {pitch.query.preferredContactMethod === "email"
                  ? "Email"
                  : pitch.query.preferredContactMethod === "x_dm"
                  ? "Twitter/X"
                  : "Website"}
                .
              </p>
              <button
                onClick={() => onExternalSubmission(pitch)}
                className="inline-flex items-center underline font-semibold hover:text-blue-900 cursor-pointer whitespace-nowrap"
              >
                Click here to send <ExternalLink className="ml-1 h-3 w-3" />
              </button>
            </div>
          )}

        <div className="flex items-center gap-2 pt-2 border-t mt-2">
          <Button
            size="sm"
            variant={isCommentsOpen ? "secondary" : "ghost"}
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Reply
          </Button>
        </div>

        <Collapsible open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
          <CollapsibleContent>
            <div className="pt-2">
              <PitchComments
                pitchId={pitch.id}
                currentUserId={currentUserId}
                isJournalist={false}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  );
}
