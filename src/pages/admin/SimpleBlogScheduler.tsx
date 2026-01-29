import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { prForFoundersBlogContent, prForFoundersBlogMeta } from "@/lib/pr-for-founders-blog-content";
import { adminTheme } from "@/styles/adminTheme";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "scheduled" | "published";
  publish_date: string | null;
  content: string | null;
}

const BLOG_ADMIN_PASSWORD = import.meta.env.VITE_BLOG_ADMIN_PASSWORD || "admin123";

export default function SimpleBlogScheduler() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const storedAuth = sessionStorage.getItem("blog_admin_authenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
      loadBlogs();
    }
  }, []);

  const loadBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, slug, status, publish_date, content")
        .order("publish_date", { ascending: true });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error("Error loading blogs:", error);
    }
  };

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

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowScheduleDialog(true);
    setNewBlogTitle("");
    setNewBlogContent("");
  };

  const handleBlogClick = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setShowEditDialog(true);
    setNewBlogTitle(blog.title);
    setNewBlogContent(blog.content || "");
  };

  const saveBlog = async () => {
    if (!selectedDate || !newBlogTitle.trim()) return;

    setSaving(true);
    try {
      const blogData = {
        title: newBlogTitle.trim(),
        slug: newBlogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        status: "scheduled" as const,
        publish_date: selectedDate.toISOString(),
        content: newBlogContent.trim() || null,
      };

      const { error } = await supabase
        .from("blogs")
        .insert(blogData);

      if (error) throw error;

      await loadBlogs();
      setShowScheduleDialog(false);
      setSelectedDate(null);
      setNewBlogTitle("");
      setNewBlogContent("");
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateBlog = async () => {
    if (!selectedBlog || !newBlogTitle.trim()) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("blogs")
        .update({
          title: newBlogTitle.trim(),
          content: newBlogContent.trim() || null,
        })
        .eq("id", selectedBlog.id);

      if (error) throw error;

      await loadBlogs();
      setShowEditDialog(false);
      setSelectedBlog(null);
      setNewBlogTitle("");
      setNewBlogContent("");
    } catch (error) {
      console.error("Error updating blog:", error);
    } finally {
      setSaving(false);
    }
  };

  const deleteBlog = async (blogId: string) => {
    try {
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", blogId);

      if (error) throw error;

      await loadBlogs();
      setShowEditDialog(false);
      setSelectedBlog(null);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const createPRForFoundersBlog = async () => {
    setSaving(true);
    try {
      // Calculate word count
      const cleanContent = prForFoundersBlogContent
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      const wordCount = cleanContent.split(/\s+/).filter(w => w.length > 0).length;

      const { error } = await supabase
        .from("blogs")
        .insert({
          title: prForFoundersBlogMeta.title,
          slug: prForFoundersBlogMeta.slug,
          status: "scheduled",
          publish_date: prForFoundersBlogMeta.publishDate,
          content: prForFoundersBlogContent,
          meta_description: prForFoundersBlogMeta.metaDescription,
          word_count: wordCount,
          created_at: new Date().toISOString(),
          last_updated: new Date().toISOString(),
        });

      if (error) throw error;

      await loadBlogs();
      alert(`✅ Blog scheduled successfully for ${new Date(prForFoundersBlogMeta.publishDate).toLocaleDateString()} at 9am!`);
    } catch (error: any) {
      console.error("Error creating PR for Founders blog:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const getBlogsForDate = (date: Date) => {
    return blogs.filter(blog =>
      blog.publish_date &&
      isSameDay(new Date(blog.publish_date), date)
    );
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  if (!isAuthenticated) {
    return (
      <div className={adminTheme.page + " flex items-center justify-center"} style={adminTheme.bodyStyle}>
        <div className={adminTheme.cardWithShadow + " " + adminTheme.cardPad + " w-full max-w-md"}>
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-5 w-5 text-purple-600" />
            <h2 className={adminTheme.cardTitle}>Blog Scheduler</h2>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className={adminTheme.inputLabel}>Admin Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={adminTheme.input}
              />
              {passwordError && (
                <p className="text-red-600 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            <button type="submit" className={adminTheme.primaryBtn + " w-full"}>
              Access Scheduler
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={adminTheme.container}>
      <div className="flex items-center justify-between mb-8">
        <h1 className={adminTheme.pageTitle + " flex items-center gap-2"} style={adminTheme.pageTitleStyle}>
            <Calendar className="h-8 w-8" />
            Blog Scheduler
          </h1>
          <div className="flex gap-2">
            <Button
              variant="default"
              onClick={createPRForFoundersBlog}
              disabled={saving}
            >
              {saving ? "Creating..." : "Create PR for Founders Blog"}
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

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {format(currentDate, "MMMM yyyy")}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="p-2 text-center font-medium text-slate-400">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map(day => {
                const dayBlogs = getBlogsForDate(day);
                const isToday = isSameDay(day, new Date());
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                return (
                  <div
                    key={day.toISOString()}
                    className={`
                      min-h-[100px] p-2 border border-slate-700 rounded cursor-pointer hover:bg-slate-800 transition-colors
                      ${isToday ? "bg-accent-blue/20 border-accent-blue" : ""}
                      ${isSelected ? "ring-2 ring-accent-blue" : ""}
                    `}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="text-sm font-medium mb-1">
                      {format(day, "d")}
                    </div>

                    <div className="space-y-1">
                      {dayBlogs.map(blog => (
                        <div
                          key={blog.id}
                          className="text-xs p-1 rounded bg-accent-blue/20 border border-accent-blue/30 cursor-pointer hover:bg-accent-blue/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBlogClick(blog);
                          }}
                        >
                          <div className="truncate font-medium">{blog.title}</div>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {blog.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Schedule Blog Dialog */}
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Schedule Blog for {selectedDate && format(selectedDate, "PPP")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Blog Title</Label>
                <Input
                  id="title"
                  value={newBlogTitle}
                  onChange={(e) => setNewBlogTitle(e.target.value)}
                  placeholder="Enter blog title"
                />
              </div>
              <div>
                <Label htmlFor="content">Blog Content (Optional)</Label>
                <Textarea
                  id="content"
                  value={newBlogContent}
                  onChange={(e) => setNewBlogContent(e.target.value)}
                  placeholder="Enter blog content or leave blank to add later"
                  rows={10}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowScheduleDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveBlog}
                  disabled={saving || !newBlogTitle.trim()}
                >
                  {saving ? "Saving..." : "Schedule Blog"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Blog Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Blog</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Blog Title</Label>
                <Input
                  id="edit-title"
                  value={newBlogTitle}
                  onChange={(e) => setNewBlogTitle(e.target.value)}
                  placeholder="Enter blog title"
                />
              </div>
              <div>
                <Label htmlFor="edit-content">Blog Content</Label>
                <Textarea
                  id="edit-content"
                  value={newBlogContent}
                  onChange={(e) => setNewBlogContent(e.target.value)}
                  placeholder="Enter blog content"
                  rows={10}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="destructive"
                  onClick={() => selectedBlog && deleteBlog(selectedBlog.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={updateBlog}
                  disabled={saving || !newBlogTitle.trim()}
                >
                  {saving ? "Saving..." : "Update Blog"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
