import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { calculateSEOScore, SEOBreakdown } from "@/lib/blog-seo";
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ExternalLink,
  Edit,
  Lock,
  Plus,
  Database,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Download,
} from "lucide-react";
import { migrateBlogs } from "@/lib/migrate-blogs";
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
  seo_breakdown: SEOBreakdown | null;
  seo_flags: string[] | null;
  seo_last_scored_at: string | null;
  meta_description: string | null;
  content: string | null;
}

const BLOG_ADMIN_PASSWORD = import.meta.env.VITE_BLOG_ADMIN_PASSWORD || "admin123";

export default function BlogDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [recalculating, setRecalculating] = useState<string | null>(null);
  const [bulkRecalculating, setBulkRecalculating] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    try {
      const storedAuth = sessionStorage.getItem("blog_admin_authenticated");
      if (storedAuth === "true") {
        setIsAuthenticated(true);
        loadBlogs();
      } else {
        // Ensure we show the login form if not authenticated
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
      setError("Failed to initialize dashboard");
      setIsAuthenticated(false);
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

  const recalculateSEO = async (blog: BlogPost) => {
    if (!blog.content) {
      toast({
        title: "No content",
        description: "Add content to calculate SEO score",
        variant: "destructive",
      });
      return;
    }

    setRecalculating(blog.id);
    try {
      const seoResult = calculateSEOScore({
        title: blog.title,
        slug: blog.slug,
        metaDescription: blog.meta_description || undefined,
        content: blog.content,
        publishDate: blog.publish_date,
        lastUpdated: blog.last_updated,
      });

      const { error: updateError } = await supabase
        .from("blogs")
        .update({
          seo_score: seoResult.score,
          seo_breakdown: seoResult.breakdown,
          seo_flags: seoResult.flags,
          seo_last_scored_at: new Date().toISOString(),
          last_updated: new Date().toISOString(),
        })
        .eq("id", blog.id);

      if (updateError) throw updateError;

      toast({
        title: "SEO score updated",
        description: `New score: ${seoResult.score}/100`,
      });

      loadBlogs();
    } catch (error: any) {
      console.error("Error recalculating SEO:", error);
      toast({
        title: "Error recalculating SEO",
        description: error?.message,
        variant: "destructive",
      });
    } finally {
      setRecalculating(null);
    }
  };

  const parseHTMLContent = (html: string) => {
    // Extract title
    let title = "";
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      title = titleMatch[1].replace(/\s*\|\s*ContactJournalists\.com\s*/i, "").trim();
    }
    
    // Try og:title if no title
    if (!title) {
      const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
      if (ogTitleMatch) {
        title = ogTitleMatch[1].trim();
      }
    }

    // Extract meta description
    let metaDescription = "";
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    if (descMatch) {
      metaDescription = descMatch[1].trim();
    }
    
    // Try og:description if no meta description
    if (!metaDescription) {
      const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
      if (ogDescMatch) {
        metaDescription = ogDescMatch[1].trim();
      }
    }

    // Extract content - try multiple selectors
    let content = "";
    
    // For React-rendered pages, look for the main content div
    // Try to find the main content area with max-w-4xl or similar
    const contentSelectors = [
      /<div[^>]*class=["'][^"']*max-w-4xl[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class=["'][^"']*prose[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class=["'][^"']*mx-auto[^"']*max-w[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
      /<article[^>]*>([\s\S]*?)<\/article>/i,
      /<main[^>]*>([\s\S]*?)<\/main>/i,
      /<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
    ];

    for (let i = 0; i < contentSelectors.length; i++) {
      const selector = contentSelectors[i];
      const match = html.match(selector);
      if (match && match[1]) {
        const candidate = match[1].trim();
        // Look for substantial content (has paragraphs, headings, etc.)
        if (candidate.length > 500 && 
            (candidate.includes('<p') || candidate.includes('<h') || candidate.includes('text-'))) {
          content = candidate;
          break;
        }
      }
    }

    // Fallback: extract body content, remove scripts, styles, nav, header, footer
    if (!content || content.length < 500) {
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        let bodyContent = bodyMatch[1];
        
        // Remove unwanted elements
        bodyContent = bodyContent
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
          .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
          .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
          .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "")
          .replace(/<div[^>]*id=["']root["'][^>]*>([\s\S]*?)<\/div>/gi, "$1"); // Extract React root content
        
        // Try to find the main content div within body
        const mainContentMatch = bodyContent.match(/<div[^>]*class=["'][^"']*min-h-screen[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
        if (mainContentMatch && mainContentMatch[1].length > 500) {
          content = mainContentMatch[1].trim();
        } else {
          content = bodyContent.trim();
        }
      }
    }
    
    // If still no content, try to extract from React hydration data or JSON
    if (!content || content.length < 100) {
      // Look for JSON data in script tags that might contain content
      const jsonDataMatch = html.match(/<script[^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/i);
      if (jsonDataMatch) {
        try {
          const jsonData = JSON.parse(jsonDataMatch[1]);
          if (jsonData.content || jsonData.body) {
            content = jsonData.content || jsonData.body;
          }
        } catch {
          // Ignore JSON parse errors
        }
      }
    }

    // Clean up content
    if (content) {
      content = content
        .replace(/\s+/g, " ")
        .replace(/>\s+</g, "><")
        .trim();
    }

    return { title, metaDescription, content };
  };

  const extractSlugFromURL = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      const match = path.match(/\/blog\/([^\/]+)/);
      if (match && match[1]) {
        return match[1];
      }
      return "";
    } catch {
      return "";
    }
  };

  const generateSlugFromTitle = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 100);
  };

  const importBlogFromURL = async () => {
    if (!importUrl.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a blog URL to import",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    try {
      // Validate URL
      let urlObj: URL;
      try {
        urlObj = new URL(importUrl.trim());
      } catch {
        throw new Error("Invalid URL format");
      }

      const hostname = urlObj.hostname.replace(/^www\./, "");
      if (!["contactjournalists.com", "www.contactjournalists.com"].includes(hostname)) {
        throw new Error("Domain not whitelisted. Only contactjournalists.com/blog/* URLs are allowed.");
      }

      if (!urlObj.pathname.startsWith("/blog/")) {
        throw new Error("URL must be from /blog/* path");
      }

      // Try edge function first, fallback to client-side
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      let useClientSide = false;

      // Always use edge function - no client-side fallback
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error("VITE_SUPABASE_URL is not configured");
      }

      const blogAdminPassword = import.meta.env.VITE_BLOG_ADMIN_PASSWORD || "admin123";
      const response = await fetch(
        `${supabaseUrl}/functions/v1/import-blog`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
          },
          body: JSON.stringify({
            url: importUrl.trim(),
            password: blogAdminPassword,
          }),
        }
      );

      if (!response.ok) {
        // Parse error response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          if (errorData.details) {
            errorMessage += ` (${errorData.details})`;
          }
        } catch {
          // If JSON parsing fails, use status text
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      toast({
        title: "Blog imported successfully",
        description: `${data.title} has been imported as a draft`,
      });
      setImportUrl("");
      loadBlogs();
    } catch (error: any) {
      console.error("Import error:", error);
      toast({
        title: "Import failed",
        description: error?.message || "Failed to import blog from URL",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const recalculateAllSEO = async () => {
    setBulkRecalculating(true);
    try {
      const blogsWithContent = blogs.filter((b) => b.content && b.content.trim().length > 0);
      
      for (const blog of blogsWithContent) {
        try {
          const seoResult = calculateSEOScore({
            title: blog.title,
            slug: blog.slug,
            metaDescription: blog.meta_description || undefined,
            content: blog.content!,
            publishDate: blog.publish_date,
            lastUpdated: blog.last_updated,
          });

          await supabase
            .from("blogs")
            .update({
              seo_score: seoResult.score,
              seo_breakdown: seoResult.breakdown,
              seo_flags: seoResult.flags,
              seo_last_scored_at: new Date().toISOString(),
            })
            .eq("id", blog.id);
        } catch (error) {
          console.error(`Error recalculating ${blog.title}:`, error);
        }
      }

      toast({
        title: "Bulk recalculation complete",
        description: `Updated ${blogsWithContent.length} blog posts`,
      });

      loadBlogs();
    } catch (error: any) {
      toast({
        title: "Error in bulk recalculation",
        description: error?.message,
        variant: "destructive",
      });
    } finally {
      setBulkRecalculating(false);
    }
  };

  const loadBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      try {
        await syncBlogPosts();
      } catch (syncError) {
        console.error("Error syncing blogs:", syncError);
      }

      const { data, error: dbError } = await supabase
        .from("blogs")
        .select("*")
        .order("last_updated", { ascending: false });

      if (dbError) {
        if (dbError.code === "42P01" || dbError.message.includes("does not exist")) {
          setError("Blogs table not found. Please run the database migration first.");
          setBlogs([]);
          return;
        }
        throw dbError;
      }

      // Recalculate SEO for blogs without scores or with outdated scores
      const blogsWithSEO = await Promise.all(
        (data || []).map(async (blog) => {
          if (blog.content && blog.content.trim().length > 0) {
            // Recalculate if no score or score is old
            if (!blog.seo_score || !blog.seo_last_scored_at) {
              const seoResult = calculateSEOScore({
                title: blog.title,
                slug: blog.slug,
                metaDescription: blog.meta_description || undefined,
                content: blog.content,
                publishDate: blog.publish_date,
                lastUpdated: blog.last_updated,
              });

              await supabase
                .from("blogs")
                .update({
                  seo_score: seoResult.score,
                  seo_breakdown: seoResult.breakdown,
                  seo_flags: seoResult.flags,
                  seo_last_scored_at: new Date().toISOString(),
                })
                .eq("id", blog.id);

              return {
                ...blog,
                seo_score: seoResult.score,
                seo_breakdown: seoResult.breakdown,
                seo_flags: seoResult.flags,
                seo_last_scored_at: new Date().toISOString(),
              };
            }
          }
          return blog;
        })
      );

      setBlogs(blogsWithSEO);
    } catch (error: any) {
      console.error("Error loading blogs:", error);
      setError(error?.message || "Failed to load blogs.");
      toast({
        title: "Error loading blogs",
        description: error?.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const syncBlogPosts = async () => {
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

    for (const blog of existingBlogs) {
      const { data: existing } = await supabase
        .from("blogs")
        .select("id")
        .eq("slug", blog.slug)
        .single();

      if (!existing) {
        await supabase.from("blogs").insert({
          title: blog.title,
          slug: blog.slug,
          status: blog.status,
          publish_date: blog.publish_date,
          meta_description: blog.meta_description || null,
          content: null,
        });
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

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getSEOScoreDot = (score: number) => {
    if (score >= 80) return "bg-green-400";
    if (score >= 60) return "bg-yellow-400";
    return "bg-red-400";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderSEOItem = (item: any, key: string) => {
    if (!item) return null;

    const Icon =
      item.status === "green"
        ? CheckCircle2
        : item.status === "amber"
        ? AlertCircle
        : XCircle;

    return (
      <div key={key} className="flex items-start gap-3 py-2 border-b border-white/5">
        <Icon
          className={`h-5 w-5 mt-0.5 ${
            item.status === "green"
              ? "text-green-400"
              : item.status === "amber"
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium capitalize" style={{ color: '#ffffff' }}>
              {key.replace(/_/g, " ")}
            </span>
            <span className="text-sm" style={{ color: '#94a3b8' }}>
              {item.score}
              {item.max && ` / ${item.max}`}
            </span>
          </div>
          {item.reason && (
            <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>{item.reason}</p>
          )}
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0f172a' }}>
        <Card className="w-full max-w-md border-white/10" style={{ backgroundColor: '#1e293b', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-5 w-5" style={{ color: '#ffffff' }} />
              <CardTitle style={{ color: '#ffffff' }}>Blog Admin Access</CardTitle>
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
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    borderColor: passwordError ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'
                  }}
                />
                {passwordError && (
                  <p className="text-sm mt-1" style={{ color: '#ef4444' }}>{passwordError}</p>
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

  // Add error boundary for rendering issues
  if (error && !loading) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>
        <div className="max-w-7xl mx-auto">
          <Card className="border-white/10" style={{ backgroundColor: '#1e293b', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-red-400 mb-4 text-lg font-semibold">{error}</p>
                <p className="text-slate-400 text-sm mb-4">
                  This might be due to missing database migrations or connection issues.
                </p>
                <div className="space-y-2 mb-4">
                  <Button onClick={() => loadBlogs()} variant="outline">
                    Retry
                  </Button>
                  <Button
                    onClick={() => {
                      setError(null);
                      setIsAuthenticated(false);
                    }}
                    variant="outline"
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-8" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#ffffff' }}>Blog Admin Dashboard</h1>
              <p style={{ color: '#94a3b8' }}>Manage all blog posts and track SEO performance</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={recalculateAllSEO}
                disabled={bulkRecalculating}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${bulkRecalculating ? "animate-spin" : ""}`}
                />
                {bulkRecalculating ? "Recalculating..." : "Recalculate All SEO"}
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await migrateBlogs();
                    toast({
                      title: "Migration started",
                      description: "Check console for progress.",
                    });
                    setTimeout(() => loadBlogs(), 2000);
                  } catch (error: any) {
                    toast({
                      title: "Migration error",
                      description: error?.message,
                      variant: "destructive",
                    });
                  }
                }}
              >
                <Database className="h-4 w-4 mr-2" />
                Run Migration
              </Button>
              <Button
                onClick={() => {
                  navigate("/admin/blog-dashboard-a7f3b9c2d1e4f5a6/new");
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
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
          </div>

          {/* Import from URL Section */}
          <Card className="border-white/10 mb-6" style={{ backgroundColor: '#1e293b', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <CardContent className="p-6">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="import-url" style={{ color: '#ffffff', marginBottom: '0.5rem', display: 'block' }}>
                    Import from URL
                  </Label>
                  <Input
                    id="import-url"
                    type="url"
                    placeholder="https://contactjournalists.com/blog/your-blog-post"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !importing) {
                        importBlogFromURL();
                      }
                    }}
                    disabled={importing}
                    style={{
                      backgroundColor: '#1e293b',
                      color: '#ffffff',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                  />
                  <p className="text-xs mt-2" style={{ color: '#94a3b8' }}>
                    Only URLs from contactjournalists.com/blog/* are allowed
                  </p>
                </div>
                <Button
                  onClick={importBlogFromURL}
                  disabled={importing || !importUrl.trim()}
                >
                  <Download className={`h-4 w-4 mr-2 ${importing ? "animate-spin" : ""}`} />
                  {importing ? "Importing..." : "Import"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="text-center py-12">
              <p style={{ color: '#94a3b8' }}>Loading blogs...</p>
            </div>
          ) : error ? (
            <Card className="bg-base-800 border-white/10">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <p className="text-red-400 mb-4">{error}</p>
                  <Button onClick={() => loadBlogs()} variant="outline">
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-white/10" style={{ backgroundColor: '#1e293b', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead style={{ color: '#cbd5e1' }}>Title</TableHead>
                      <TableHead style={{ color: '#cbd5e1' }}>Status</TableHead>
                      <TableHead style={{ color: '#cbd5e1' }}>Publish Date</TableHead>
                      <TableHead style={{ color: '#cbd5e1' }}>Last Updated</TableHead>
                      <TableHead style={{ color: '#cbd5e1' }}>Word Count</TableHead>
                      <TableHead style={{ color: '#cbd5e1' }}>SEO Score</TableHead>
                      <TableHead style={{ color: '#cbd5e1' }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8" style={{ color: '#94a3b8' }}>
                          No blog posts found
                        </TableCell>
                      </TableRow>
                    ) : (
                      blogs.map((blog) => (
                        <TableRow key={blog.id} className="border-white/10">
                          <TableCell className="font-medium" style={{ color: '#ffffff' }}>
                            {blog.title}
                          </TableCell>
                          <TableCell>{getStatusBadge(blog.status)}</TableCell>
                        <TableCell style={{ color: '#94a3b8' }}>
                          {formatDate(blog.publish_date)}
                        </TableCell>
                        <TableCell style={{ color: '#94a3b8' }}>
                          {formatDate(blog.last_updated)}
                        </TableCell>
                        <TableCell style={{ color: '#94a3b8' }}>
                          {blog.word_count.toLocaleString()}
                        </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${getSEOScoreDot(
                                  blog.seo_score || 0
                                )}`}
                              />
                              <span
                                className={`font-semibold ${getSEOScoreColor(
                                  blog.seo_score || 0
                                )}`}
                              >
                                {blog.seo_score || 0}
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
                                  setSelectedBlog(blog);
                                  setShowBreakdown(true);
                                }}
                              >
                                <BarChart3 className="h-4 w-4 mr-1" />
                                SEO
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => recalculateSEO(blog)}
                                disabled={recalculating === blog.id}
                              >
                                <RefreshCw
                                  className={`h-4 w-4 mr-1 ${
                                    recalculating === blog.id ? "animate-spin" : ""
                                  }`}
                                />
                                Recalc
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  navigate(
                                    `/admin/blog-dashboard-a7f3b9c2d1e4f5a6/edit/${blog.id}`
                                  );
                                }}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              {blog.status === "published" && (
                                <Button variant="ghost" size="sm" asChild>
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

      {/* SEO Breakdown Dialog */}
      <Dialog open={showBreakdown} onOpenChange={setShowBreakdown}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-base-800 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl" style={{ color: '#ffffff' }}>
              SEO Breakdown: {selectedBlog?.title}
            </DialogTitle>
            <DialogDescription style={{ color: '#94a3b8' }}>
              Detailed analysis of SEO score and recommendations
            </DialogDescription>
          </DialogHeader>

          {selectedBlog?.seo_breakdown && (
            <div className="space-y-6 mt-4">
              {/* Overall Score */}
              <div className="bg-base-900 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold" style={{ color: '#ffffff' }}>Overall Score</span>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full ${getSEOScoreDot(
                        selectedBlog.seo_score || 0
                      )}`}
                    />
                    <span
                      className={`text-2xl font-bold ${getSEOScoreColor(
                        selectedBlog.seo_score || 0
                      )}`}
                    >
                      {selectedBlog.seo_score || 0}
                    </span>
                    <span style={{ color: '#94a3b8' }}>/ 100</span>
                  </div>
                </div>
              </div>

              {/* Category Breakdowns */}
              {Object.entries(selectedBlog.seo_breakdown).map(([category, data]: [string, any]) => {
                if (category === "penalties") return null;
                return (
                  <div key={category} className="bg-base-900 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold capitalize" style={{ color: '#ffffff' }}>
                        {category.replace(/_/g, " ")}
                      </h3>
                      <span className="text-sm" style={{ color: '#94a3b8' }}>
                        {data.score} / {data.max}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {data.items &&
                        Object.entries(data.items).map(([key, item]: [string, any]) =>
                          renderSEOItem(item, key)
                        )}
                    </div>
                  </div>
                );
              })}

              {/* Penalties */}
              {selectedBlog.seo_breakdown.penalties &&
                Object.keys(selectedBlog.seo_breakdown.penalties.items || {}).length > 0 && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3" style={{ color: '#f87171' }}>Penalties</h3>
                    <div className="space-y-1">
                      {Object.entries(
                        selectedBlog.seo_breakdown.penalties.items || {}
                      ).map(([key, item]: [string, any]) => renderSEOItem(item, key))}
                    </div>
                  </div>
                )}

              {/* Flags */}
              {selectedBlog.seo_flags && selectedBlog.seo_flags.length > 0 && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#fbbf24' }}>Issues Found</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBlog.seo_flags.map((flag) => (
                      <Badge key={flag} variant="outline" className="text-yellow-400">
                        {flag.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
