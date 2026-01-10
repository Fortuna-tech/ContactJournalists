import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft } from "lucide-react";

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  status: string;
  publish_date: string | null;
  content: string | null;
  meta_description: string | null;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("No blog slug provided");
      setLoading(false);
      return;
    }

    const loadBlog = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from("blogs")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle();

        if (dbError) throw dbError;

        if (!data) {
          setError("Blog post not found");
          return;
        }

        setBlog(data);
      } catch (err: any) {
        console.error("Error loading blog:", err);
        setError(err?.message || "Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-900 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-base-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Blog post not found"}</p>
          <a
            href="/#blog"
            className="text-accent-blue hover:underline"
          >
            Back to Blog
          </a>
        </div>
      </div>
    );
  }

  const publishDate = blog.publish_date
    ? new Date(blog.publish_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-base-900 text-slate-200">
      <Helmet>
        <title>{blog.title} | ContactJournalists.com</title>
        {blog.meta_description && (
          <meta name="description" content={blog.meta_description} />
        )}
        <meta property="og:title" content={blog.title} />
        {blog.meta_description && (
          <meta property="og:description" content={blog.meta_description} />
        )}
        <meta property="og:type" content="article" />
      </Helmet>

      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-base-900/70 border-b border-white/5">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a
            href="/"
            className="flex items-center gap-2 font-extrabold text-lg tracking-tight"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gradient-to-br from-accent-blue to-accent-violet"></span>
            Contact<span className="text-slate-400">Journalists</span>
          </a>
          <a
            href="/#blog"
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </a>
        </nav>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <article>
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {blog.title}
            </h1>
            {publishDate && (
              <div className="flex items-center gap-4 text-sm text-slate-400 border-b border-white/10 pb-6">
                <time>{publishDate}</time>
                <span>•</span>
                <span>By Fortuna, Founder</span>
              </div>
            )}
          </header>

          <div
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content || "" }}
          />
        </article>
      </div>
    </div>
  );
}

