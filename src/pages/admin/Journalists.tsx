import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { JournalistForm } from "@/components/admin/JournalistForm";
import {
  getJournalistsAdmin,
  createJournalistAdmin,
  updateJournalistAdmin,
  AdminJournalistProfile,
} from "@/lib/api";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Pencil,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

export default function JournalistsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const pageSize = 20;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch journalists
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-journalists", page, debouncedSearch],
    queryFn: () =>
      getJournalistsAdmin({ page, pageSize, search: debouncedSearch }),
  });

  const journalists = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createJournalistAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-journalists"] });
      toast.success("Journalist created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Record<string, unknown>;
    }) => updateJournalistAdmin(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-journalists"] });
      toast.success("Journalist updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  const handleCreate = async (data: Record<string, unknown>) => {
    await createMutation.mutateAsync(
      data as Parameters<typeof createJournalistAdmin>[0]
    );
  };

  const handleUpdate =
    (journalist: AdminJournalistProfile) =>
    async (data: Record<string, unknown>) => {
      await updateMutation.mutateAsync({ id: journalist.id, updates: data });
    };

  const getSubscriptionBadge = (
    billing: AdminJournalistProfile["billing_account"]
  ) => {
    if (!billing) return null;

    const status = billing.status;
    const variant =
      status === "active"
        ? "default"
        : status === "trialing"
        ? "secondary"
        : "outline";

    return (
      <div className="space-y-1">
        <Badge variant={variant} className="capitalize">
          {status}
        </Badge>
        {billing.current_period_end && (
          <p className="text-xs text-muted-foreground">
            {billing.cancel_at_period_end ? "Cancels" : "Renews"}{" "}
            {format(new Date(billing.current_period_end), "MMM d, yyyy")}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Journalists</h1>
          <p className="text-muted-foreground">
            {totalCount} total journalist{totalCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <JournalistForm
            onSubmit={handleCreate}
            title="Add New Journalist"
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Journalist
              </Button>
            }
          />
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or publication..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Publication</TableHead>
              <TableHead>Links</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-red-500"
                >
                  Failed to load journalists
                </TableCell>
              </TableRow>
            ) : journalists.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground"
                >
                  No journalists found
                </TableCell>
              </TableRow>
            ) : (
              journalists.map((journalist) => (
                <TableRow key={journalist.id}>
                  <TableCell className="font-medium">
                    {journalist.full_name || "—"}
                  </TableCell>
                  <TableCell>{journalist.email || "—"}</TableCell>
                  <TableCell>{journalist.press || "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {journalist.website && (
                        <a
                          href={
                            journalist.website.startsWith("http")
                              ? journalist.website
                              : `https://${journalist.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {journalist.linkedin && (
                        <a
                          href={
                            journalist.linkedin.startsWith("http")
                              ? journalist.linkedin
                              : `https://${journalist.linkedin}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-blue-600"
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      )}
                      {journalist.x_handle && (
                        <a
                          href={`https://x.com/${journalist.x_handle.replace(
                            "@",
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getSubscriptionBadge(journalist.billing_account)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(journalist.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <JournalistForm
                      defaultValues={{
                        full_name: journalist.full_name || "",
                        email: journalist.email || "",
                        press: journalist.press || "",
                        company: journalist.company || "",
                        website: journalist.website || "",
                        linkedin: journalist.linkedin || "",
                        x_handle: journalist.x_handle || "",
                      }}
                      onSubmit={handleUpdate(journalist)}
                      title="Edit Journalist"
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1 + Math.max(0, page - 3);
                if (pageNum > totalPages) return null;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setPage(pageNum)}
                      isActive={page === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
