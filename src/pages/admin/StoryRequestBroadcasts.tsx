import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Plus,
  Loader2,
  Trash2,
  ArrowLeft,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  createQuery,
  getQueries,
  getCategories,
  sendBroadcastAlerts,
} from "@/lib/api";
import { Query, Category } from "@/types";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

// Story Request Schema - matches createQuery requirements
const storyRequestItemSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Please select a category"),
  deadline: z.date().optional(),
});

const storyRequestFormSchema = z.object({
  requests: z
    .array(storyRequestItemSchema)
    .min(1, "At least one story request is required"),
});

type StoryRequestFormData = z.infer<typeof storyRequestFormSchema>;

export default function StoryRequestBroadcasts() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storyRequests, setStoryRequests] = useState<Query[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const form = useForm<StoryRequestFormData>({
    resolver: zodResolver(storyRequestFormSchema),
    defaultValues: {
      requests: [
        { title: "", description: "", categoryId: "", deadline: undefined },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "requests",
  });

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

  const handleSave = async (
    data: StoryRequestFormData,
    sendAlerts: boolean
  ) => {
    setIsSubmitting(true);
    try {
      const createdQueries: Query[] = [];

      for (const request of data.requests) {
        const query = await createQuery({
          title: request.title,
          description: request.description || "",
          categoryId: request.categoryId,
          deadline: request.deadline,
          preferredContactMethod: "platform",
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

      form.reset({
        requests: [
          { title: "", description: "", categoryId: "", deadline: undefined },
        ],
      });
    } catch (error) {
      console.error("Failed to save story requests:", error);
      toast.error("Failed to save story requests");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.title || categoryId;
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Story Request Broadcasts</h1>
      </div>

      {/* Form Section - Rendered above the list */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Story Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Story Request #{index + 1}
                    </span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`requests.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Looking for experts on AI safety..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`requests.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide more details about what you need..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4 items-center justify-center">
                    <FormField
                      control={form.control}
                      name={`requests.${index}.categoryId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category / Beat *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`requests.${index}.deadline`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col mt-2">
                          <FormLabel>Deadline (Optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                  append({
                    title: "",
                    description: "",
                    categoryId: "",
                    deadline: undefined,
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Story Request
              </Button>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isSubmitting}
                  onClick={form.handleSubmit((data) => handleSave(data, false))}
                >
                  {isSubmitting && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Save
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={form.handleSubmit((data) => handleSave(data, true))}
                >
                  {isSubmitting && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Save & Send Alerts
                </Button>
              </div>
            </form>
          </Form>
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
                    <TableRow key={request.id}>
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
    </div>
  );
}
