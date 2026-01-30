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
          className="relative bg-purple-50/80 border-2 border-purple-200 rounded-2xl p-4"
        >
          <button
            onClick={() => handleDismiss(banner.id)}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-purple-100 text-slate-500 hover:text-black transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="pr-8">
            <h3 className="font-semibold text-black">{banner.title}</h3>
            {banner.description && (
              <p className="text-sm text-slate-600 mt-1">
                {banner.description}
              </p>
            )}
            {banner.cta_link && banner.cta_text && (
              <Button
                asChild
                variant="link"
                className="p-0 h-auto mt-2 text-purple-600 hover:text-purple-700"
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
