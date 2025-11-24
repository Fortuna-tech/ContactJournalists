import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Outlet, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CategorySelector from "@/components/categories/CategorySelector";
import {
  getMyQueries,
  createQuery,
  updateQuery,
  archiveQuery,
} from "@/lib/api";
import { Query } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Plus, Pencil, Archive } from "lucide-react";
import UserPopover from "@/components/UserPopover";

type NewQueryFormState = {
  title: string;
  description: string;
  categoryId: string;
};

const LOCAL_STORAGE_KEY = "journalist-feed-new-query";

const getEmptyFormState = (): NewQueryFormState => ({
  title: "",
  description: "",
  categoryId: "",
});

const getStoredFormState = (): NewQueryFormState => {
  if (typeof window === "undefined") {
    return getEmptyFormState();
  }

  const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) {
    return getEmptyFormState();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<NewQueryFormState>;
    return {
      title: parsed.title ?? "",
      description: parsed.description ?? "",
      categoryId: parsed.categoryId ?? "",
    };
  } catch {
    return getEmptyFormState();
  }
};

const JournalistFeed = () => {
  const navigate = useNavigate();
  const [newQuery, setNewQuery] =
    useState<NewQueryFormState>(getStoredFormState);
  const [newQueryFormOpen, setNewQueryFormOpen] = useState(false);
  const [editingQueryId, setEditingQueryId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: queries = [], isLoading } = useQuery({
    queryKey: ["queries", "mine"],
    queryFn: () => getMyQueries(),
  });

  const createMutation = useMutation({
    mutationFn: async (data: NewQueryFormState) => {
      return await createQuery(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queries", "mine"] });
      toast({ title: "Query posted!" });
      setNewQuery(getEmptyFormState());
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      queryId,
      data,
    }: {
      queryId: string;
      data: NewQueryFormState;
    }) => {
      return await updateQuery(queryId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queries", "mine"] });
      toast({ title: "Query updated!" });
      setEditingQueryId(null);
      setNewQuery(getEmptyFormState());
      setNewQueryFormOpen(false);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async (queryId: string) => archiveQuery(queryId),
    onSuccess: (_, archivedId) => {
      queryClient.invalidateQueries({ queryKey: ["queries", "mine"] });
      toast({ title: "Query archived" });
      if (editingQueryId === archivedId) {
        setEditingQueryId(null);
        setNewQuery(getEmptyFormState());
        setNewQueryFormOpen(false);
      }
    },
  });

  const isFormDirty = useMemo(
    () =>
      newQuery.title.trim().length > 0 ||
      newQuery.description.trim().length > 0,
    [newQuery.description, newQuery.title]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isFormDirty || newQuery.categoryId) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newQuery));
    } else {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [isFormDirty, newQuery]);

  useEffect(() => {
    if (!isFormDirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFormDirty]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setNewQuery((prev) => ({ ...prev, categoryId }));
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newQuery.categoryId) return;
    if (editingQueryId) {
      updateMutation.mutate({ queryId: editingQueryId, data: newQuery });
      return;
    }
    createMutation.mutate(newQuery);
  };

  const handleCardClick = (query: Query) => {
    navigate(`/feed/${query.id}`, { state: { query } });
  };

  const isEditing = Boolean(editingQueryId);
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">My Queries</h1>
            <p className="text-muted-foreground">
              Manage what you&apos;re sourcing and review responses on demand.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!newQueryFormOpen && (
              <Button
                variant="default"
                size="lg"
                onClick={() => setNewQueryFormOpen(true)}
              >
                <Plus className="w-4 h-4" />
                New query
              </Button>
            )}
            <UserPopover />
          </div>
        </div>

        <Card
          className={cn(
            "p-6 shadow-none",
            newQueryFormOpen ? "block" : "hidden"
          )}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">
                {isEditing ? "Edit query" : "Create a new query"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isEditing
                  ? "Update and resubmit your sourcing details."
                  : "Your draft auto-saves locally until you submit it."}
              </p>
            </div>
            <Input
              className="w-full"
              placeholder="Query title"
              value={newQuery.title}
              onChange={(e) =>
                setNewQuery((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
            <Textarea
              placeholder="Describe what you're looking for..."
              value={newQuery.description}
              onChange={(e) =>
                setNewQuery((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
              rows={8}
            />
            <CategorySelector
              selectedCategoryId={newQuery.categoryId || null}
              onSelect={handleCategorySelect}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  setNewQuery(getEmptyFormState());
                  setEditingQueryId(null);
                  setNewQueryFormOpen(false);
                }}
              >
                {isEditing ? "Cancel edit" : "Discard"}
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || !newQuery.categoryId}
              >
                {createMutation.isPending
                  ? "Posting..."
                  : updateMutation.isPending
                  ? "Saving..."
                  : isEditing
                  ? "Save changes"
                  : "Post query"}
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          {isLoading && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Loading your queries...</p>
            </Card>
          )}
          {!isLoading && queries.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                No queries yet. Create your first query to get started!
              </p>
            </Card>
          )}
          {queries.map((query) => (
            <Card
              key={query.id}
              className="p-6 cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleCardClick(query)}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2">{query.title}</h3>

                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {query.description}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                    <div className="flex flex-wrap gap-4 text-muted-foreground">
                      <Badge variant="outline">{query.categoryTitle}</Badge>
                      <span>{query.pitchCount} pitches</span>
                      <span>
                        Posted {new Date(query.datePosted).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={archiveMutation.isPending}
                        onClick={(event) => {
                          event.stopPropagation();
                          setNewQuery({
                            title: query.title,
                            description: query.description,
                            categoryId: query.categoryId,
                          });
                          setEditingQueryId(query.id);
                          setNewQueryFormOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={archiveMutation.isPending}
                        onClick={(event) => {
                          event.stopPropagation();
                          archiveMutation.mutate(query.id);
                        }}
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Outlet context={{ queries }} />
      </div>
    </div>
  );
};

export default JournalistFeed;
