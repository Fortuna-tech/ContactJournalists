import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { calculateSEOScore } from "@/lib/blog-seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const BLOG_ADMIN_PASSWORD = import.meta.env.VITE_BLOG_ADMIN_PASSWORD || "admin123";

export default function BlogForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    status: "draft" as "draft" | "scheduled" | "published",
    publish_date: "",
    meta_description: "",
    content: "",
  });

  // Check authentication
  useEffect(() => {
    const storedAuth = sessionStorage.getItem("blog_admin_authenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
      if (id) {
        loadBlogPost(id);
      }
    }
  }, [id]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === BLOG_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("blog_admin_authenticated", "true");
      if (id) {
        loadBlogPost(id);
      }
    } else {
      toast({
        title: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  const loadBlogPost = async (blogId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", blogId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || "",
          slug: data.slug || "",
          status: data.status || "draft",
          publish_date: data.publish_date
            ? new Date(data.publish_date).toISOString().split("T")[0]
            : "",
          meta_description: data.meta_description || "",
          content: data.content || "",
        });
      }
    } catch (error: any) {
      console.error("Error loading blog:", error);
      toast({
        title: "Error loading blog post",
        description: error?.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Calculate SEO score if content exists
      let seoResult = null;
      if (formData.content && formData.content.trim().length > 0) {
        seoResult = calculateSEOScore({
          title: formData.title,
          slug: formData.slug,
          metaDescription: formData.meta_description || undefined,
          content: formData.content,
          publishDate: formData.publish_date || null,
          lastUpdated: new Date().toISOString(),
        });
      }

      const blogData = {
        title: formData.title,
        slug: formData.slug,
        status: formData.status,
        publish_date: formData.publish_date || null,
        meta_description: formData.meta_description || null,
        content: formData.content,
        last_updated: new Date().toISOString(),
        ...(seoResult && {
          seo_score: seoResult.score,
          seo_breakdown: seoResult.breakdown,
          seo_flags: seoResult.flags,
          seo_last_scored_at: new Date().toISOString(),
        }),
      };

      if (id) {
        // Update existing
        const { error } = await supabase
          .from("blogs")
          .update(blogData)
          .eq("id", id);

        if (error) throw error;

        toast({
          title: "Blog post updated successfully",
        });
      } else {
        // Create new
        const { error } = await supabase.from("blogs").insert(blogData);

        if (error) throw error;

        toast({
          title: "Blog post created successfully",
        });
      }

      // Redirect to dashboard
      navigate("/admin/blog-dashboard-a7f3b9c2d1e4f5a6");
    } catch (error: any) {
      console.error("Error saving blog:", error);
      toast({
        title: "Error saving blog post",
        description: error?.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-base-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-base-800 border-white/10">
          <CardHeader>
            <CardTitle style={{ color: '#ffffff' }}>Blog Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                />
              </div>
              <Button type="submit" className="w-full">
                Access
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-900 flex items-center justify-center">
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-900 p-8" style={{ color: '#e2e8f0' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/blog-dashboard-a7f3b9c2d1e4f5a6")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold" style={{ color: '#ffffff' }}>
            {id ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>
        </div>

        <Card className="bg-base-800 border-white/10">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" style={{ color: '#ffffff' }}>
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" style={{ color: '#ffffff' }}>
                  Slug *
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  required
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                  placeholder="blog-post-slug"
                />
                <p className="text-sm" style={{ color: '#94a3b8' }}>
                  URL-friendly version of the title (auto-generated from title)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status" style={{ color: '#ffffff' }}>
                    Status *
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "draft" | "scheduled" | "published") =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger style={{
                      backgroundColor: '#1e293b',
                      color: '#ffffff',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
                      <SelectItem value="draft" style={{ color: '#ffffff' }}>Draft</SelectItem>
                      <SelectItem value="scheduled" style={{ color: '#ffffff' }}>Scheduled</SelectItem>
                      <SelectItem value="published" style={{ color: '#ffffff' }}>Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publish_date" style={{ color: '#ffffff' }}>
                    Publish Date
                  </Label>
                  <Input
                    id="publish_date"
                    type="date"
                    value={formData.publish_date}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        publish_date: e.target.value,
                      }))
                    }
                    style={{
                      backgroundColor: '#1e293b',
                      color: '#ffffff',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description" style={{ color: '#ffffff' }}>
                  Meta Description
                </Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      meta_description: e.target.value,
                    }))
                  }
                  rows={3}
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                  placeholder="SEO meta description (150-160 characters recommended)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" style={{ color: '#ffffff' }}>
                  Content *
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  rows={20}
                  required
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Enter blog content (HTML/JSX supported)"
                />
                <p className="text-sm" style={{ color: '#94a3b8' }}>
                  You can use HTML or JSX syntax for formatting
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    navigate("/admin/blog-dashboard-a7f3b9c2d1e4f5a6")
                  }
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : id ? "Update" : "Create"} Post
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

