import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getQueries, getCategories, sendBroadcastAlerts } from "@/lib/api";
import {
  createQueryAdmin,
  updateQueryAdmin,
  deleteQueryAdmin,
} from "@/lib/admin-api";
import { Query, Category } from "@/types";
import AdminStoryRequestForm, {
  StoryRequestFormValues,
  queryToFormValues,
} from "@/components/admin/AdminStoryRequestForm";
import { adminTheme } from "@/styles/adminTheme";

const ITEMS_PER_PAGE = 10;

// Type for pending requests (before they're submitted)
interface PendingRequest {
  id: string; // Temporary ID for React key
  values: StoryRequestFormValues;
}

export default function StoryRequestBroadcasts() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storyRequests, setStoryRequests] = useState<Query[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Bulk creation state - list of pending requests
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([
    { id: crypto.randomUUID(), values: getEmptyFormValues() },
  ]);

  // Edit modal state
  const [editingQuery, setEditingQuery] = useState<Query | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination calculations
  const totalPages = Math.ceil(storyRequests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRequests = storyRequests.slice(startIndex, endIndex);

  // Load categories and queries on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [queriesData, categoriesData] = await Promise.all([
          getQueries(),
          getCategories(),
        ]);
        setStoryRequests(queriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  function getEmptyFormValues(): StoryRequestFormValues {
    return {
      title: "",
      description: "",
      categoryId: "",
      deadline: undefined,
      journalistId: "",
    };
  }

  const handleAddRequest = () => {
    setPendingRequests((prev) => [
      ...prev,
      { id: crypto.randomUUID(), values: getEmptyFormValues() },
    ]);
  };

  const handleRemoveRequest = (id: string) => {
    if (pendingRequests.length > 1) {
      setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleUpdatePendingRequest = (
    id: string,
    values: StoryRequestFormValues
  ) => {
    setPendingRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, values } : r))
    );
  };

  const handleBulkSubmit = async (sendAlerts: boolean) => {
    // Validate all requests have required fields
    const invalidRequests = pendingRequests.filter(
      (r) =>
        !r.values.title ||
        r.values.title.length < 5 ||
        !r.values.categoryId ||
        !r.values.journalistId
    );

    if (invalidRequests.length > 0) {
      toast.error(
        "Please fill in all required fields (title, category, and journalist) for each request."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const createdQueries: Query[] = [];

      for (const request of pendingRequests) {
        const query = await createQueryAdmin({
          title: request.values.title,
          description: request.values.description || "",
          category_id: request.values.categoryId,
          journalist_id: request.values.journalistId,
          deadline: request.values.deadline?.toISOString() || null,
          preferred_contact_method: "email",
        });
        createdQueries.push(query);
      }

      // Add to local state
      setStoryRequests((prev) => [...createdQueries, ...prev]);
      setCurrentPage(1); // Reset to first page to show new items

      if (sendAlerts) {
        try {
          const queryIds = createdQueries.map((q) => q.id);
          const result = await sendBroadcastAlerts(queryIds);
          toast.success(
            `${createdQueries.length} story request(s) saved and ${result.sent} alert(s) sent!`
          );
        } catch (alertError) {
          console.error("Failed to send alerts:", alertError);
          toast.warning(
            `${createdQueries.length} story request(s) saved, but failed to send alerts.`
          );
        }
      } else {
        toast.success(`${createdQueries.length} story request(s) saved!`);
      }

      // Reset form to single empty request
      setPendingRequests([
        { id: crypto.randomUUID(), values: getEmptyFormValues() },
      ]);
    } catch (error) {
      console.error("Failed to save story requests:", error);
      toast.error("Failed to save story requests");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowClick = (query: Query) => {
    setEditingQuery(query);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (data: StoryRequestFormValues) => {
    if (!editingQuery) return;

    setIsUpdating(true);
    try {
      const updated = await updateQueryAdmin(editingQuery.id, {
        title: data.title,
        description: data.description || "",
        category_id: data.categoryId,
        deadline: data.deadline?.toISOString() || null,
        preferred_contact_method:
          editingQuery.preferredContactMethod || "platform",
      });

      // Update local state
      setStoryRequests((prev) =>
        prev.map((q) => (q.id === updated.id ? updated : q))
      );

      toast.success("Story request updated successfully!");
      setIsEditModalOpen(false);
      setEditingQuery(null);
    } catch (error) {
      console.error("Failed to update story request:", error);
      toast.error("Failed to update story request");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!editingQuery) return;

    setIsDeleting(true);
    try {
      await deleteQueryAdmin(editingQuery.id);

      // Remove from local state
      setStoryRequests((prev) => prev.filter((q) => q.id !== editingQuery.id));

      toast.success("Story request deleted successfully!");
      setIsEditModalOpen(false);
      setEditingQuery(null);
    } catch (error) {
      console.error("Failed to delete story request:", error);
      toast.error("Failed to delete story request");
    } finally {
      setIsDeleting(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.title || categoryId;
  };

  return (
    <div className={adminTheme.container + " space-y-8"}>
      <div className="flex items-center gap-4">
        <Link to="/admin">
          <button className={adminTheme.iconBtn}>
            <ArrowLeft className="h-4 w-4" />
          </button>
        </Link>
        <h1 className={adminTheme.pageTitle} style={adminTheme.pageTitleStyle}>
          Story Request Broadcasts
        </h1>
      </div>

      {/* Bulk Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Story Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {pendingRequests.map((request, index) => (
            <div
              key={request.id}
              className="p-4 border rounded-lg space-y-4 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Story Request #{index + 1}
                </span>
                {pendingRequests.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRequest(request.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>

              <AdminStoryRequestForm
                categories={categories}
                defaultValues={request.values}
                onSubmit={async () => {}} // Not used in bulk mode
                onChange={(values) =>
                  handleUpdatePendingRequest(request.id, values)
                }
                isLoading={false}
                showJournalistField
                hideButtons
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleAddRequest}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Story Request
          </Button>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => handleBulkSubmit(false)}
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Save
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleBulkSubmit(true)}
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Save & Send Alerts
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* List Section */}
      <Card>
        <CardHeader>
          <CardTitle>Past Story Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : storyRequests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No story requests created yet.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Pitches</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRequests.map((request) => (
                    <TableRow
                      key={request.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(request)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.title}</p>
                          {request.description && (
                            <p className="text-sm text-muted-foreground truncate max-w-[400px]">
                              {request.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getCategoryName(request.categoryId)}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.pitchCount}</TableCell>
                      <TableCell>
                        {new Date(request.datePosted).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, storyRequests.length)} of{" "}
                    {storyRequests.length} requests
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground px-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Story Request</DialogTitle>
          </DialogHeader>
          {editingQuery && (
            <AdminStoryRequestForm
              categories={categories}
              defaultValues={queryToFormValues(editingQuery)}
              onSubmit={handleUpdate}
              onDelete={handleDelete}
              isLoading={isUpdating}
              isDeleting={isDeleting}
              submitLabel="Update"
              showDelete
              showJournalistField
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
