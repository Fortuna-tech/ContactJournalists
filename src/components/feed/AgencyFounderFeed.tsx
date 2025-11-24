import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import {
  Search,
  FileText,
  Users,
  Mail,
  ExternalLink,
  Trash,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getQueries, getMyPitches, createPitch } from "@/lib/api";
import { Query } from "@/types";
import { useToast } from "@/hooks/use-toast";

import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";

const AgencyFounderFeed = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const authorId = searchParams.get("author_id");
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [pitchContent, setPitchContent] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [expandedPitches, setExpandedPitches] = useState<
    Record<string, boolean>
  >({});
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: userPitches = [] } = useQuery({
    queryKey: ["userPitches"],
    queryFn: () => getMyPitches(),
  });

  const { data: allQueries = [] } = useQuery({
    queryKey: ["allQueries", authorId],
    queryFn: () => getQueries({ journalistId: authorId || undefined }),
  });

  const filteredQueries = categoryFilter
    ? allQueries.filter((q) => q.categoryId === categoryFilter)
    : allQueries;

  const handleClearAuthorFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("author_id");
    setSearchParams(newParams);
  };

  const submitPitchMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedQuery) throw new Error("No query selected");

      return await createPitch({
        queryId: selectedQuery.id,
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allQueries"] });
      queryClient.invalidateQueries({ queryKey: ["userPitches"] });
      setSelectedQuery(null);
      setPitchContent("");
      toast({ title: "Pitch submitted!" });
    },
  });

  const categories = Array.from(
    allQueries.reduce((map, query) => {
      if (!map.has(query.categoryId)) {
        map.set(query.categoryId, query.categoryTitle);
      }
      return map;
    }, new Map<string, string>())
  ).map(([id, title]) => ({ id, title }));

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {authorId && (
          <div className="bg-muted/50 p-4 rounded-lg flex items-center justify-between mb-6">
            <p className="text-sm font-medium">
              Viewing queries from selected journalist
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAuthorFilter}
              className="h-auto p-2"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filter
            </Button>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={categoryFilter === null ? "default" : "outline"}
            onClick={() => setCategoryFilter(null)}
            className="rounded-full cursor-pointer"
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={categoryFilter === category.id ? "default" : "outline"}
              onClick={() => setCategoryFilter(category.id)}
              className="rounded-full cursor-pointer px-2 py-1"
            >
              {category.title}
            </Badge>
          ))}
        </div>

        <div className="space-y-4">
          {filteredQueries.map((query) => {
            const myPitch = userPitches.find((p) => p.queryId === query.id);
            const hasUserPitched = Boolean(myPitch);
            const isExpanded = expandedPitches[query.id] ?? false;
            const shouldShowToggle = (myPitch?.content.length ?? 0) > 320;

            return (
              <Card
                key={query.id}
                className="p-6 cursor-pointer hover:border-primary transition-colors"
                onClick={() => !hasUserPitched && setSelectedQuery(query)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{query.title}</h3>
                      <Badge variant="outline">{query.categoryTitle}</Badge>
                      {hasUserPitched && <Badge>Pitched</Badge>}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {query.description}
                    </p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{query.pitchCount} pitches</span>
                      <span>
                        Posted {new Date(query.datePosted).toLocaleDateString()}
                      </span>
                    </div>
                    {myPitch && (
                      <div
                        className="mt-6 rounded-xl bg-muted/60 p-4 border border-border/60"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          My pitch
                        </div>
                        <p
                          className="mt-3 text-sm leading-relaxed text-foreground"
                          style={
                            isExpanded
                              ? undefined
                              : {
                                  display: "-webkit-box",
                                  WebkitLineClamp: 6,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }
                          }
                        >
                          {myPitch.content}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            Submitted{" "}
                            {new Date(myPitch.createdAt).toLocaleString()}
                          </span>
                          {shouldShowToggle && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={(event) => {
                                event.stopPropagation();
                                setExpandedPitches((prev) => ({
                                  ...prev,
                                  [query.id]: !isExpanded,
                                }));
                              }}
                            >
                              {isExpanded ? "Show less" : "Show more"}
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {filteredQueries.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                No queries available in this category
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Submit Pitch Modal */}
      <Dialog
        open={!!selectedQuery}
        onOpenChange={() => setSelectedQuery(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Your Pitch</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{selectedQuery?.title}</h4>
              <p className="text-sm text-muted-foreground">
                {selectedQuery?.description}
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitPitchMutation.mutate(pitchContent);
              }}
              className="space-y-4"
            >
              <Textarea
                placeholder="Share your expertise and why you'd be a great fit..."
                value={pitchContent}
                onChange={(e) => setPitchContent(e.target.value)}
                required
                rows={6}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={submitPitchMutation.isPending}
              >
                {submitPitchMutation.isPending
                  ? "Submitting..."
                  : "Submit Pitch"}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgencyFounderFeed;
