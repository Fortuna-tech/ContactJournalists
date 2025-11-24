import { useState } from "react";
import { format } from "date-fns";
import {
  Mail,
  Bookmark,
  ExternalLink,
  Linkedin,
  GlobeIcon,
  MessageSquare,
} from "lucide-react";
import { Pitch } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { saveSource } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { PitchComments } from "@/components/journalist/PitchComments";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface PitchCardProps {
  pitch: Pitch;
  currentUserId?: string;
  isJournalist?: boolean;
}

export function PitchCard({
  pitch,
  currentUserId,
  isJournalist = false,
}: PitchCardProps) {
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const handleSaveSource = async () => {
    try {
      await saveSource(pitch.userId);
      setIsSaved(true);
      toast({ title: "Source saved" });
    } catch (error) {
      toast({ title: "Failed to save source", variant: "destructive" });
    }
  };

  const authorName = pitch.author?.name || "Unknown";
  const authorCompany = pitch.author?.company || "";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{authorName}</CardTitle>
            <CardDescription>{authorCompany}</CardDescription>
          </div>
          <Badge variant="secondary">
            {format(new Date(pitch.createdAt), "MMM d")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {pitch.content}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-0 items-stretch">
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            {pitch.author?.website && (
              <Button asChild variant="ghost" size="sm">
                <a href={pitch.author.website} target="_blank" rel="noreferrer">
                  <GlobeIcon className="mr-2 h-4 w-4" />
                  Website
                </a>
              </Button>
            )}
            {pitch.author?.linkedin && (
              <Button asChild variant="ghost" size="sm">
                <a
                  href={pitch.author.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </a>
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                (window.location.href = `mailto:?subject=Re: ${authorName}'s Pitch`)
              }
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button
              size="sm"
              variant={isCommentsOpen ? "secondary" : "ghost"}
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Reply
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveSource}
              disabled={isSaved}
            >
              <Bookmark
                className={`mr-2 h-4 w-4 ${isSaved ? "fill-current" : ""}`}
              />
              {isSaved ? "Saved" : "Save Source"}
            </Button>
          </div>
        </div>

        <Collapsible open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
          <CollapsibleContent>
            <div className="pt-2">
              <PitchComments
                pitchId={pitch.id}
                currentUserId={currentUserId}
                isJournalist={isJournalist}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardFooter>
    </Card>
  );
}
