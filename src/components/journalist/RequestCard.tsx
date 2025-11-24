import { format } from "date-fns";
import {
  Calendar,
  MessageSquare,
  MoreHorizontal,
  Eye,
  Edit,
  Archive,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Query } from "@/types";

interface RequestCardProps {
  query: Query;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RequestCard({ query, onArchive, onDelete }: RequestCardProps) {
  const isClosed = !!query.archivedAt;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {query.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {query.description}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/journalist/requests/${query.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchive(query.id)}>
                <Archive className="mr-2 h-4 w-4" />
                {isClosed ? "Re-open" : "Close Request"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(query.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">{query.categoryTitle}</Badge>
          {query.deadline && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Due {format(new Date(query.deadline), "MMM d")}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{query.pitchCount} Pitches</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge variant={isClosed ? "outline" : "default"}>
            {isClosed ? "Closed" : "Open"}
          </Badge>
        </div>
        <Button variant="secondary" size="sm" asChild>
          <Link to={`/journalist/requests/${query.id}`}>View Pitches</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
