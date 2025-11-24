import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestCard } from "@/components/journalist/RequestCard";
import { getMyQueries, archiveQuery, deleteQuery } from "@/lib/api";
import { Query } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export default function MyRequests() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");
  const { toast } = useToast();

  const fetchQueries = async () => {
    setIsLoading(true);
    try {
      const data = await getMyQueries();
      setQueries(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleArchive = async (id: string) => {
    try {
      await archiveQuery(id, true);
      toast({ title: "Request archived" });
      fetchQueries();
    } catch (e) {
      toast({ title: "Failed to archive", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQuery(id);
      toast({ title: "Request deleted" });
      setQueries(queries.filter((q) => q.id !== id));
    } catch (e) {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const filteredQueries = queries.filter((q) => {
    if (filter === "open") return !q.archivedAt;
    if (filter === "closed") return !!q.archivedAt;
    return true;
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>
          <p className="text-muted-foreground mt-1">
            Manage your story requests and view pitches.
          </p>
        </div>
        <Button asChild>
          <Link to="/journalist/requests/new">
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Link>
        </Button>
      </div>

      <div className="flex items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search requests..."
            className="pl-8"
          />
        </div>
        <Tabs
          defaultValue="all"
          className="w-[400px]"
          onValueChange={(v) => setFilter(v as "all" | "open" | "closed")}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQueries.map((query) => (
            <RequestCard
              key={query.id}
              query={query}
              onArchive={handleArchive}
              onDelete={handleDelete}
            />
          ))}
          {filteredQueries.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No requests found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
