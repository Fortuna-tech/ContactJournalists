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
import { DashboardBanner } from "@/components/DashboardBanner";
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
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Dashboard Banners */}
        <DashboardBanner />

        {authorId && (
          <div className="bg-white/50 p-4 rounded-2xl border-2 border-black flex items-center justify-between mb-6">
            <p className="text-sm font-medium text-black">
              Viewing queries from selected journalist
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAuthorFilter}
              className="site-btn-ghost h-auto"
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
            className={`rounded-full cursor-pointer px-4 py-1.5 text-sm font-medium transition-all ${
              categoryFilter === null
                ? "site-pill-active"
                : "site-pill-inactive"
            }`}
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={categoryFilter === category.id ? "default" : "outline"}
              onClick={() => setCategoryFilter(category.id)}
              className={`rounded-full cursor-pointer px-4 py-1.5 text-sm font-medium transition-all ${
                categoryFilter === category.id
                  ? "site-pill-active"
                  : "site-pill-inactive"
              }`}
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
                className="p-4 sm:p-6 cursor-pointer bg-[#F5F5DC] border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150"
                onClick={() => !hasUserPitched && setSelectedQuery(query)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-lg sm:text-xl text-black">{query.title}</h3>
                      <Badge variant="outline" className="rounded-full border-2 border-black/20 text-slate-600 text-xs">
                        {query.categoryTitle}
                      </Badge>
                      {hasUserPitched && (
                        <Badge className="rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs">
                          Pitched
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-600 mb-4 text-sm sm:text-base">
                      {query.description}
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500">
                      <span>{query.pitchCount} pitches</span>
                      <span>
                        Posted {new Date(query.datePosted).toLocaleDateString()}
                      </span>
                    </div>
                    {myPitch && (
                      <div
                        className="mt-6 rounded-2xl bg-white/60 p-4 border-2 border-black/20"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500 font-semibold">
                          <span className="h-2 w-2 rounded-full bg-[#D8B4FE]" />
                          My pitch
                        </div>
                        <p
                          className="mt-3 text-sm leading-relaxed text-black"
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
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                          <span>
                            Submitted{" "}
                            {new Date(myPitch.createdAt).toLocaleString()}
                          </span>
                          {shouldShowToggle && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="site-btn-ghost h-7 px-2 text-xs"
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
            <Card className="p-8 sm:p-12 text-center bg-[#F5F5DC] border-2 border-black rounded-2xl">
              <p className="text-slate-500">
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
        <DialogContent className="bg-[#F5F5DC] border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] max-w-lg mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-black">Submit Your Pitch</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-black">{selectedQuery?.title}</h4>
              <p className="text-sm text-slate-600">
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
                className="bg-white/50 border-2 border-black rounded-2xl focus:border-purple-500 focus:ring-purple-500/50 text-black placeholder:text-slate-500 caret-black"
              />
              <Button
                type="submit"
                className="w-full site-btn-primary"
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
