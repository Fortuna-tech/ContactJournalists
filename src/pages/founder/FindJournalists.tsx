import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Mail, Eye } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  searchJournalists,
  saveContact,
  getSavedContactEmails,
} from "@/lib/api";
import { JournalistProfile } from "@/types";
import { useToast } from "@/hooks/use-toast";

const FindJournalists = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();
  const [savingId, setSavingId] = useState<string | null>(null);

  const { data: journalists = [], isLoading } = useQuery({
    queryKey: ["journalists", searchTerm, selectedCategory],
    queryFn: () =>
      searchJournalists({
        searchTerm: searchTerm || undefined,
        category: selectedCategory || undefined,
      }),
    enabled: true,
  });

  // Get saved contacts with emails
  const { data: savedEmails = {}, refetch: refetchSaved } = useQuery({
    queryKey: ["saved-contact-emails"],
    queryFn: getSavedContactEmails,
  });

  const isSaved = (id: string) => id in savedEmails;
  const getEmail = (id: string) => savedEmails[id];

  const handleShowEmail = async (journalist: JournalistProfile) => {
    if (isSaved(journalist.userId)) {
      // Already saved, email is shown
      return;
    }

    try {
      setSavingId(journalist.userId);
      await saveContact(journalist.userId);
      toast({
        title: "Contact Added",
        description: `${journalist.name} added to your contacts.`,
      });
      // Refetch to get the email
      await refetchSaved();
      // Also invalidate saved-contacts query
      queryClient.invalidateQueries({ queryKey: ["saved-contacts"] });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add contact.";
      // Only show error toast if it's not the quota limit error (which shows its own toast)
      if (errorMessage !== "Contact limit reached") {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Find Journalists</h1>
        <p className="text-muted-foreground">
          Search publicly available journalist contact information.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by publication name..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="w-32">Search</Button>
        </div>

        <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground mb-4">
          <span className="font-medium text-foreground mr-2">Filters:</span>
          {["Technology", "Business", "Finance", "Healthcare", "Lifestyle"].map(
            (category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:opacity-80"
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category ? null : category
                  )
                }
              >
                {category}
              </Badge>
            )
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          All journalist data shown is processed under legitimate interest per
          GDPR Article 6(1)(f).
        </p>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Publication</TableHead>
              <TableHead>Topics</TableHead>
              <TableHead>Queries</TableHead>
              <TableHead className="text-right">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  Loading...
                </TableCell>
              </TableRow>
            ) : journalists.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No journalists found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              journalists.map((journalist) => (
                <TableRow
                  key={journalist.userId}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() =>
                    navigate(`/feed/?author_id=${journalist.userId}`)
                  }
                >
                  <TableCell className="font-medium">
                    {journalist.name}
                  </TableCell>
                  <TableCell>
                    {journalist.press || "Unknown Publication"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {journalist.categories?.slice(0, 3).map((cat) => (
                        <Badge
                          key={cat}
                          variant="secondary"
                          className="text-xs"
                        >
                          {cat}
                        </Badge>
                      ))}
                      {journalist.categories?.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{journalist.categories.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{journalist.queryCount}</TableCell>
                  <TableCell className="text-right">
                    {isSaved(journalist.userId) ? (
                      <div className="flex items-center justify-end gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${getEmail(journalist.userId)}`}
                          className="text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {getEmail(journalist.userId)}
                        </a>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={savingId === journalist.userId}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowEmail(journalist);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {savingId === journalist.userId
                          ? "Adding..."
                          : "Show Email"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default FindJournalists;
