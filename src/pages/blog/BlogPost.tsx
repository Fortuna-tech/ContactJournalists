import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft } from "lucide-react";
import { blogTheme } from "@/styles/blogTheme";
import BlogLayout from "@/layouts/BlogLayout";

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
      <BlogLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-slate-600">Loading...</p>
        </div>
      </BlogLayout>
    );
  }

  if (error || !blog) {
    return (
      <BlogLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Blog post not found"}</p>
            <a
              href="/#blog"
              className={blogTheme.link}
            >
              Back to Blog
            </a>
          </div>
        </div>
      </BlogLayout>
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
    <BlogLayout>
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

      <header className={blogTheme.header}>
        <nav className={blogTheme.headerNav}>
          <a href="/" className={blogTheme.logo}>
            <span className={blogTheme.logoIcon}></span>
            Contact<span className={blogTheme.logoText}>Journalists</span>
          </a>
          <a href="/#blog" className={blogTheme.navLink}>
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </a>
        </nav>
      </header>

      <div className={blogTheme.container}>
        <article className={blogTheme.card + " " + blogTheme.cardPad}>
          <header className={blogTheme.articleHeaderBorder}>
            <h1
              className={blogTheme.h1}
              style={blogTheme.h1Style}
            >
              {blog.title}
            </h1>
            {publishDate && (
              <div className={blogTheme.metaRow}>
                <time>{publishDate}</time>
                <span className={blogTheme.metaDivider}>•</span>
                <span>By Fortuna, Founder</span>
              </div>
            )}
          </header>

          <div
            className={blogTheme.prose}
            dangerouslySetInnerHTML={{ __html: blog.content || "" }}
          />
        </article>
      </div>

      <footer className={blogTheme.footer}>
        <div className={blogTheme.footerInner}>
          <div className="text-center">
            <p className={blogTheme.footerText + " mb-2"}>
              Questions? Ping us a message at{" "}
              <a
                href="mailto:hello@contactjournalists.com"
                className={blogTheme.footerLink}
              >
                hello@contactjournalists.com
              </a>
            </p>
            <p className={blogTheme.footerText}>© 2026 ContactJournalists.com. Built in London with ☕️</p>
          </div>
        </div>
      </footer>
    </BlogLayout>
  );
}
