import { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

interface Banner {
  id: string;
  title: string;
  description: string | null;
  cta_text: string | null;
  cta_link: string | null;
  audience: "journalist" | "founder_agency" | "all";
  expiry_date: string | null;
}

export function DashboardBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Get dismissed banner IDs from localStorage
        const dismissed = JSON.parse(
          localStorage.getItem("dismissedBanners") || "[]"
        );
        setDismissedIds(new Set(dismissed));

        // Fetch active banners for the current user's role
        // The RLS policy will automatically filter based on user role and active status
        const { data, error } = await supabase
          .from("dashboard_banners")
          .select(
            "id, title, description, cta_text, cta_link, audience, expiry_date"
          )
          .eq("is_active", true)
          .or("expiry_date.is.null,expiry_date.gt.now()")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Failed to fetch banners:", error);
          return;
        }

        setBanners(data || []);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleDismiss = (id: string) => {
    const newDismissed = new Set(dismissedIds);
    newDismissed.add(id);
    setDismissedIds(newDismissed);
    localStorage.setItem(
      "dismissedBanners",
      JSON.stringify(Array.from(newDismissed))
    );
  };

  // Filter out dismissed banners
  const visibleBanners = banners.filter(
    (banner) => !dismissedIds.has(banner.id)
  );

  if (isLoading || visibleBanners.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {visibleBanners.map((banner) => (
        <div
          key={banner.id}
          className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-lg p-4"
        >
          <button
            onClick={() => handleDismiss(banner.id)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="pr-8">
            <h3 className="font-semibold text-foreground">{banner.title}</h3>
            {banner.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {banner.description}
              </p>
            )}
            {banner.cta_link && banner.cta_text && (
              <Button
                asChild
                variant="link"
                className="p-0 h-auto mt-2 text-primary"
              >
                <a
                  href={banner.cta_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1"
                >
                  {banner.cta_text}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
