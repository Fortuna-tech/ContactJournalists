import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  Loader2,
  Trash2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { adminTheme } from "@/styles/adminTheme";

const ITEMS_PER_PAGE = 10;

// Banner Schema
const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  audience: z.enum(["journalist", "founder_agency", "all"], {
    required_error: "Please select an audience",
  }),
  expiryDate: z.string().optional(),
});

type BannerFormData = z.infer<typeof bannerSchema>;

interface Banner {
  id: string;
  title: string;
  description: string | null;
  cta_text: string | null;
  cta_link: string | null;
  audience: "journalist" | "founder_agency" | "all";
  expiry_date: string | null;
  is_active: boolean;
  created_at: string;
}

export default function BannerManagement() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      description: "",
      ctaText: "",
      ctaLink: "",
      audience: "all",
      expiryDate: "",
    },
  });

  // Pagination calculations
  const totalPages = Math.ceil(banners.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBanners = banners.slice(startIndex, endIndex);

  // Load banners on mount
  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const { data, error } = await supabase
        .from("dashboard_banners")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error("Failed to load banners:", error);
      toast.error("Failed to load banners");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: BannerFormData) => {
    setIsSubmitting(true);
    try {
      const { data: newBanner, error } = await supabase
        .from("dashboard_banners")
        .insert({
          title: data.title,
          description: data.description,
          cta_text: data.ctaText,
          cta_link: data.ctaLink,
          audience: data.audience,
          expiry_date: data.expiryDate || null,
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      setBanners((prev) => [newBanner, ...prev]);
      setCurrentPage(1); // Reset to first page to show new item
      toast.success("Banner created successfully!");
      form.reset();
    } catch (error) {
      console.error("Failed to create banner:", error);
      toast.error("Failed to create banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("dashboard_banners")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setBanners((prev) => prev.filter((b) => b.id !== id));
      toast.success("Banner deleted");
    } catch (error) {
      console.error("Failed to delete banner:", error);
      toast.error("Failed to delete banner");
    }
  };

  const getAudienceLabel = (audience: string) => {
    switch (audience) {
      case "journalist":
        return "Journalists";
      case "founder_agency":
        return "Founders / Agencies";
      case "all":
        return "All Users";
      default:
        return audience;
    }
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
          Banner Management
        </h1>
      </div>

      {/* Form Section - Rendered above the list */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Banner headline" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Banner description..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ctaText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Text (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Learn More" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ctaLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Link (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audience *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="journalist">
                            Journalists
                          </SelectItem>
                          <SelectItem value="founder_agency">
                            Founders / Agencies
                          </SelectItem>
                          <SelectItem value="all">All Users</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Create Banner
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* List Section */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Banners</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No banners created yet.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>CTA</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBanners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{banner.title}</p>
                          {banner.description && (
                            <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                              {banner.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getAudienceLabel(banner.audience)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {banner.cta_link && banner.cta_text ? (
                          <a
                            href={banner.cta_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                          >
                            {banner.cta_text}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {banner.expiry_date ? (
                          new Date(banner.expiry_date).toLocaleDateString()
                        ) : (
                          <span className="text-muted-foreground">
                            No expiry
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={banner.is_active ? "default" : "secondary"}
                        >
                          {banner.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(banner.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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
                    {Math.min(endIndex, banners.length)} of {banners.length}{" "}
                    banners
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
