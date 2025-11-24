import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Bookmark, Plus, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RequestCard } from "@/components/journalist/RequestCard";
import { SourceCard } from "@/components/journalist/SourceCard";
import {
  getMyQueries,
  getSuggestedSources,
  saveSource,
  archiveQuery,
  deleteQuery,
} from "@/lib/api";
import { Query, AgencyFounderProfile } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [suggestedSources, setSuggestedSources] = useState<
    AgencyFounderProfile[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [queriesData, suggestionsData] = await Promise.all([
        getMyQueries(),
        getSuggestedSources(),
      ]);
      // Filter only open queries for dashboard
      setQueries(queriesData.filter((q) => !q.archivedAt).slice(0, 3));
      setSuggestedSources(suggestionsData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleArchive = async (id: string) => {
    try {
      await archiveQuery(id, true);
      toast({ title: "Request archived" });
      loadData();
    } catch (e) {
      toast({ title: "Failed to archive", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQuery(id);
      toast({ title: "Request deleted" });
      loadData();
    } catch (e) {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const handleSaveSource = async (id: string) => {
    try {
      await saveSource(id);
      toast({ title: "Source saved" });
      // Optionally remove from suggestions or mark as saved
      // For now just show toast
    } catch (e) {
      toast({ title: "Failed to save source", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Journalist Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your story requests and discover new sources.
        </p>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Submit a Story Request
              </CardTitle>
              <CardDescription>
                Tell founders exactly what you need.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/journalist/requests/new">Create Request</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                View Submissions
              </CardTitle>
              <CardDescription>
                See pitches responding to your requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/journalist/requests">My Requests</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-primary" />
                Saved Sources
              </CardTitle>
              <CardDescription>
                Companies and founders you’ve bookmarked.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/journalist/saved-sources">View Saved</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Active Story Requests */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Story Requests</h2>
          <Button asChild variant="link">
            <Link to="/journalist/requests">View All</Link>
          </Button>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {queries.map((query) => (
              <RequestCard
                key={query.id}
                query={query}
                onArchive={handleArchive}
                onDelete={handleDelete}
              />
            ))}
            {queries.length === 0 && (
              <div className="col-span-full text-center py-12 bg-muted/20 rounded-lg">
                <p className="text-muted-foreground mb-4">
                  No active requests.
                </p>
                <Button asChild>
                  <Link to="/journalist/requests/new">
                    Create your first request
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Suggested Sources */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Suggested Sources for Your Beat
        </h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedSources.map((source) => (
              <SourceCard
                key={source.userId}
                source={source}
                onSave={handleSaveSource}
                showSave
              />
            ))}
            {suggestedSources.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No suggestions available at the moment. Try updating your
                categories in settings.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
