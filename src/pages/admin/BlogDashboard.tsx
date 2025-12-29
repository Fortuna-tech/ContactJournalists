import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { calculateSEOScore, extractSEOData } from "@/lib/blog-seo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Edit, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "scheduled" | "published";
  publish_date: string | null;
  last_updated: string;
  word_count: number;
  seo_score: number;
  meta_description: string | null;
  content: string | null;
}

const BLOG_ADMIN_PASSWORD = import.meta.env.VITE_BLOG_ADMIN_PASSWORD || "admin123";

export default function BlogDashboard() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if password is already in session storage
  useEffect(() => {
    const storedAuth = sessionStorage.getItem("blog_admin_authenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
      loadBlogs();
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === BLOG_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("blog_admin_authenticated", "true");
      setPasswordError("");
      loadBlogs();
    } else {
      setPasswordError("Incorrect password");
      setPassword("");
    }
  };

  const loadBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      // First, sync existing blog posts from the codebase
      try {
        await syncBlogPosts();
      } catch (syncError) {
        console.error("Error syncing blogs:", syncError);
        // Continue even if sync fails - table might not exist yet
      }

      // Then load from database
      const { data, error: dbError } = await supabase
        .from("blogs")
        .select("*")
        .order("last_updated", { ascending: false });

      if (dbError) {
        // If table doesn't exist, show helpful message
        if (dbError.code === "42P01" || dbError.message.includes("does not exist")) {
          setError("Blogs table not found. Please run the database migration first.");
          setBlogs([]);
          return;
        }
        throw dbError;
      }

      // Calculate SEO scores for blogs that need it or have content updates
      const blogsWithSEO = await Promise.all(
        (data || []).map(async (blog) => {
          if (blog.content && blog.content.trim().length > 0) {
            const seoData = extractSEOData(
              blog.title,
              blog.meta_description || undefined,
              blog.content
            );
            const seoScore = calculateSEOScore(seoData);

            // Update SEO score in database if it changed
            if (blog.seo_score !== seoScore || blog.word_count !== seoData.wordCount) {
              await supabase
                .from("blogs")
                .update({ 
                  seo_score: seoScore, 
                  word_count: seoData.wordCount,
                  last_updated: new Date().toISOString()
                })
                .eq("id", blog.id);
            }

            return { ...blog, seo_score: seoScore, word_count: seoData.wordCount };
          }
          return blog;
        })
      );

      setBlogs(blogsWithSEO);
    } catch (error: any) {
      console.error("Error loading blogs:", error);
      setError(error?.message || "Failed to load blogs. Please check the database connection.");
      toast({
        title: "Error loading blogs",
        description: error?.message || "Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const syncBlogPosts = async () => {
    // Define existing blog posts from the codebase
    const existingBlogs = [
      {
        title: "How To Pitch Journalists on Twitter (Full Breakdown)",
        slug: "how-to-pitch-journalists-on-twitter",
        status: "published" as const,
        publish_date: "2025-12-27T00:00:00Z",
        meta_description: "Learn how to pitch journalists on Twitter. Real strategies from a founder who got press coverage through Twitter. Full breakdown of what works and what doesn't.",
      },
      {
        title: "The Fastest Ways to Get Press Coverage Without an Agency",
        slug: "the-fastest-ways-to-get-press-coverage-without-an-agency",
        status: "published" as const,
        publish_date: "2025-12-19T00:00:00Z",
      },
      {
        title: "7 Press Pitch Examples That Actually Get Replies",
        slug: "press-pitch-examples-that-get-replies",
        status: "published" as const,
        publish_date: "2025-11-16T00:00:00Z",
      },
      {
        title: "The Ultimate Guide to the Best Platforms for Contacting Journalists in 2026",
        slug: "ultimate-guide-best-platforms-contacting-journalists-2026",
        status: "published" as const,
        publish_date: "2025-12-01T00:00:00Z",
      },
      {
        title: "How to Get Press for Your Brand Without a PR Agency",
        slug: "how-to-get-press-for-your-brand-without-a-pr-agency",
        status: "published" as const,
        publish_date: "2025-01-01T00:00:00Z",
      },
      {
        title: "Free Small Business P&L Template (Google Sheets + Excel)",
        slug: "free-small-business-pl-template-google-sheets-excel",
        status: "published" as const,
        publish_date: "2025-11-15T00:00:00Z",
      },
    ];

    // Upsert blogs
    for (const blog of existingBlogs) {
      const { data: existing } = await supabase
        .from("blogs")
        .select("id")
        .eq("slug", blog.slug)
        .single();

      if (!existing) {
        // For new blogs, set default values - content can be added later via edit
        const seoData = extractSEOData(blog.title, blog.meta_description, "");
        const seoScore = calculateSEOScore(seoData);

        await supabase.from("blogs").insert({
          title: blog.title,
          slug: blog.slug,
          status: blog.status,
          publish_date: blog.publish_date,
          word_count: 0, // Will be calculated when content is added
          seo_score: seoScore,
          meta_description: blog.meta_description || null,
          content: null, // Content can be added via edit functionality
        });
      } else {
        // Update existing blogs with meta description if missing
        if (blog.meta_description) {
          const { data: existingBlog } = await supabase
            .from("blogs")
            .select("meta_description")
            .eq("id", existing.id)
            .single();

          if (!existingBlog?.meta_description) {
            const seoData = extractSEOData(blog.title, blog.meta_description, existingBlog?.content || "");
            const seoScore = calculateSEOScore(seoData);

            await supabase
              .from("blogs")
              .update({
                meta_description: blog.meta_description,
                seo_score: seoScore,
              })
              .eq("id", existing.id);
          }
        }
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      published: "default",
      scheduled: "secondary",
      draft: "outline",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-base-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-base-800 border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-5 w-5 text-white" />
              <CardTitle className="text-white">Blog Admin Access</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  className={passwordError ? "border-red-500" : ""}
                />
                {passwordError && (
                  <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-900 text-slate-200 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Blog Admin Dashboard</h1>
            <p className="text-slate-400">Manage all blog posts and track SEO performance</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              sessionStorage.removeItem("blog_admin_authenticated");
              setIsAuthenticated(false);
            }}
          >
            Logout
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading blogs...</p>
          </div>
        ) : error ? (
          <Card className="bg-base-800 border-white/10">
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-red-400 mb-4">{error}</p>
                <p className="text-slate-400 text-sm mb-4">
                  Make sure you've run the database migration:
                </p>
                <code className="block bg-base-900 p-3 rounded text-sm text-slate-300 mb-4">
                  supabase/migrations/20251223000000_create_blogs_table.sql
                </code>
                <Button
                  onClick={() => {
                    setError(null);
                    loadBlogs();
                  }}
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-base-800 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-slate-300">Title</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Publish Date</TableHead>
                    <TableHead className="text-slate-300">Last Updated</TableHead>
                    <TableHead className="text-slate-300">Word Count</TableHead>
                    <TableHead className="text-slate-300">SEO Score</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                        No blog posts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    blogs.map((blog) => (
                      <TableRow key={blog.id} className="border-white/10">
                        <TableCell className="font-medium text-white">
                          {blog.title}
                        </TableCell>
                        <TableCell>{getStatusBadge(blog.status)}</TableCell>
                        <TableCell className="text-slate-400">
                          {formatDate(blog.publish_date)}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {formatDate(blog.last_updated)}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {blog.word_count.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-semibold ${
                                blog.seo_score >= 80
                                  ? "text-green-400"
                                  : blog.seo_score >= 60
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}
                            >
                              {blog.seo_score}
                            </span>
                            <span className="text-slate-500">/ 100</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Edit functionality - to be implemented
                                toast({
                                  title: "Edit functionality coming soon",
                                });
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            {blog.status === "published" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                              >
                                <a
                                  href={`/blog/${blog.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  View
                                </a>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

