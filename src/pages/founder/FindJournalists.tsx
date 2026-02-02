import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Mail, Eye, X } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  searchJournalists,
  saveContact,
  getSavedContactEmails,
} from "@/lib/api";
import { JournalistProfile } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  TOPIC_LIST,
  getTopicsForJournalist,
  journalistMatchesTopics,
} from "@/lib/smart-topics";

// Primary topics shown by default (most relevant for founders)
const PRIMARY_TOPICS = [
  "AI",
  "Startups",
  "Technology",
  "Business",
  "Marketing",
  "Finance",
  "Wellness",
  "Mental Health",
  "Parenting",
  "Lifestyle",
];

const FindJournalists = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const { toast } = useToast();
  const [savingId, setSavingId] = useState<string | null>(null);

  // Fetch all journalists (we filter client-side for topics)
  const { data: allJournalists = [], isLoading } = useQuery({
    queryKey: ["journalists", searchTerm],
    queryFn: () =>
      searchJournalists({
        searchTerm: searchTerm || undefined,
      }),
    enabled: true,
  });

  // Apply topic filtering client-side
  const journalists = useMemo(() => {
    if (selectedTopics.length === 0) return allJournalists;
    return allJournalists.filter((j) => journalistMatchesTopics(j, selectedTopics));
  }, [allJournalists, selectedTopics]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const clearFilters = () => {
    setSelectedTopics([]);
  };

  const displayedTopics = showAllTopics ? TOPIC_LIST : PRIMARY_TOPICS;

  // Get saved contacts with emails
  const { data: savedEmails = {}, refetch: refetchSaved } = useQuery({
    queryKey: ["saved-contact-emails"],
    queryFn: getSavedContactEmails,
  });

  const isSaved = (id: string) => id in savedEmails;
  const getEmail = (id: string) => savedEmails[id];

  const handleShowEmail = async (journalist: JournalistProfile) => {
    if (isSaved(journalist.userId)) {
      // Already saved, email is shown
      return;
    }

    try {
      setSavingId(journalist.userId);
      await saveContact(journalist.userId);
      toast({
        title: "Contact Added",
        description: `${journalist.name} added to your contacts.`,
      });
      // Refetch to get the email
      await refetchSaved();
      // Also invalidate saved-contacts query
      queryClient.invalidateQueries({ queryKey: ["saved-contacts"] });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add contact.";
      // Only show error toast if it's not the quota limit error (which shows its own toast)
      if (errorMessage !== "Contact limit reached") {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Find Journalists</h1>
        <p className="text-muted-foreground">
          Search publicly available journalist contact information.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by publication name..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="w-32">Search</Button>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-medium text-foreground text-sm mr-2">Topics:</span>
            {displayedTopics.map((topic) => (
              <Badge
                key={topic}
                variant={selectedTopics.includes(topic) ? "default" : "outline"}
                className="cursor-pointer hover:opacity-80 transition-all"
                onClick={() => toggleTopic(topic)}
              >
                {topic}
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowAllTopics(!showAllTopics)}
            >
              {showAllTopics ? "Show less" : `+${TOPIC_LIST.length - PRIMARY_TOPICS.length} more`}
            </Button>
          </div>

          {selectedTopics.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Active filters:</span>
              {selectedTopics.map((topic) => (
                <Badge
                  key={topic}
                  variant="secondary"
                  className="cursor-pointer gap-1"
                  onClick={() => toggleTopic(topic)}
                >
                  {topic}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground h-6 px-2"
                onClick={clearFilters}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          All journalist data shown is processed under legitimate interest per
          GDPR Article 6(1)(f).
        </p>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Publication</TableHead>
              <TableHead>Topics</TableHead>
              <TableHead>Queries</TableHead>
              <TableHead className="text-right">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  Loading...
                </TableCell>
              </TableRow>
            ) : journalists.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No journalists found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              journalists.map((journalist) => (
                <TableRow
                  key={journalist.userId}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() =>
                    navigate(`/feed/?author_id=${journalist.userId}`)
                  }
                >
                  <TableCell className="font-medium">
                    {journalist.name}
                  </TableCell>
                  <TableCell>
                    {journalist.press || "Unknown Publication"}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const topics = getTopicsForJournalist(journalist);
                      if (topics.length === 0) {
                        return (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            Uncategorised
                          </Badge>
                        );
                      }
                      return (
                        <div className="flex flex-wrap gap-1">
                          {topics.slice(0, 3).map((topic) => (
                            <Badge
                              key={topic}
                              variant="secondary"
                              className="text-xs"
                            >
                              {topic}
                            </Badge>
                          ))}
                          {topics.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{topics.length - 3}
                            </Badge>
                          )}
                        </div>
                      );
                    })()}
                  </TableCell>
                  <TableCell>{journalist.queryCount}</TableCell>
                  <TableCell className="text-right">
                    {isSaved(journalist.userId) ? (
                      <div className="flex items-center justify-end gap-2">
                        <Mail className="h-4 w-4 text-slate-500" />
                        <a
                          href={`mailto:${getEmail(journalist.userId)}`}
                          className="text-black font-medium hover:text-purple-600 hover:underline transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {getEmail(journalist.userId)}
                        </a>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={savingId === journalist.userId}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowEmail(journalist);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {savingId === journalist.userId
                          ? "Adding..."
                          : "Show Email"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default FindJournalists;
