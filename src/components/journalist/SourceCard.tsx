import { Globe, Linkedin, Twitter, X, BookmarkCheck } from "lucide-react";
import { AgencyFounderProfile } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface SourceCardProps {
  source: AgencyFounderProfile;
  onRemove?: (id: string) => void;
  onSave?: (id: string) => void; // For suggested sources
  showRemove?: boolean;
  showSave?: boolean;
}

export function SourceCard({
  source,
  onRemove,
  onSave,
  showRemove,
  showSave,
}: SourceCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
              {source.name.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-base">{source.name}</CardTitle>
              <CardDescription>{source.company}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-3">
        <div className="flex flex-wrap gap-1">
          {source.categories.map((cat) => (
            <Badge key={cat} variant="secondary" className="text-xs capitalize">
              {cat.replace("_", " ")}
            </Badge>
          ))}
        </div>

        <div className="flex gap-3 text-muted-foreground">
          {source.website && (
            <a
              href={source.website}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              <Globe className="h-4 w-4" />
            </a>
          )}
          {source.linkedin && (
            <a
              href={source.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {source.xHandle && (
            <a
              href={`https://twitter.com/${source.xHandle}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              <Twitter className="h-4 w-4" />
            </a>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Link to={`/profile/${source.userId}`}>View Profile</Link>
        </Button>
        {showRemove && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(source.userId)}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="mr-2 h-4 w-4" />
            Remove
          </Button>
        )}
        {showSave && onSave && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSave(source.userId)}
          >
            <BookmarkCheck className="mr-2 h-4 w-4" />
            Save
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
