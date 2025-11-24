import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProfileById } from "@/lib/api";
import {
  Loader2,
  Globe,
  Linkedin,
  Twitter,
  Building2,
  Newspaper,
  ArrowLeft,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => getProfileById(id!),
    enabled: !!id,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-2xl font-bold">Profile Not Found</h1>
        <p className="text-muted-foreground">
          The user you are looking for does not exist.
        </p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  const isJournalist = profile.role === "journalist";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const visibility = (profile.meta as any)?.visibility || {};

  // Determine visibility - Default to true if not set (for filled fields)
  const isVisible = (field: string) => {
    if (!isJournalist) return true;
    // If visibility key exists, use it. If not, default to true.
    return visibility[field] !== false;
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-8">
      <Button onClick={() => navigate(-1)} variant="ghost">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      {/* Header / Info Section */}
      <Card>
        <CardHeader className="flex flex-row items-start gap-6 space-y-0">
          <Avatar className="h-24 w-24">
            {}
            <AvatarImage
              src={
                (profile.meta as Record<string, unknown>)?.avatar_url as string
              }
              alt={profile.name}
            />
            <AvatarFallback className="text-2xl">
              {profile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold">
                  {profile.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  {isJournalist ? (
                    <>
                      <Newspaper className="h-4 w-4" />
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <span>{(profile as any).press}</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="h-4 w-4" />
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <span>{(profile as any).company}</span>
                    </>
                  )}
                </div>
              </div>
              <Badge variant="outline" className="capitalize">
                {profile.role}
              </Badge>
            </div>

            {/* Categories */}
            {profile.categories && profile.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.categories.map((cat: string) => (
                  <Badge key={cat} variant="secondary">
                    {cat}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contact & Social</h3>
              <div className="space-y-2">
                {isVisible("website") && profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
                {isVisible("linkedin") && profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
                {isVisible("x_handle") && profile.xHandle && (
                  <a
                    href={`https://twitter.com/${profile.xHandle.replace(
                      "@",
                      ""
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Twitter className="h-4 w-4" />
                    {profile.xHandle}
                  </a>
                )}
                {/* Fallback if nothing is visible */}
                {!isVisible("website") &&
                  !isVisible("linkedin") &&
                  !isVisible("x_handle") && (
                    <p className="text-sm text-muted-foreground">
                      No public contact methods available.
                    </p>
                  )}
              </div>
            </div>

            {/* Stats or Bio */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">About</h3>
              <p className="text-muted-foreground text-sm">
                {isJournalist
                  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    `Journalist at ${(profile as any).press}.`
                  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    `Founder/Agency at ${(profile as any).company}.`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          {isJournalist ? "Past Queries" : "Activity"}
        </h2>

        {isJournalist ? (
          <div className="grid gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(profile as any).queries && (profile as any).queries.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (profile as any).queries.map((query: any) => (
                <Card key={query.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle
                          className="text-lg hover:underline cursor-pointer"
                          onClick={() => navigate(`/feed/${query.id}`)}
                        >
                          {query.title}
                        </CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {query.description}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={query.archived_at ? "secondary" : "default"}
                      >
                        {query.archived_at ? "Closed" : "Active"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Posted{" "}
                      {formatDistanceToNow(new Date(query.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No public queries found.</p>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Activity information is private.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
