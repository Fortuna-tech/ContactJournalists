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
import { Search, ExternalLink, Save, Check } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  searchJournalists,
  saveContact,
  removeSavedContact,
  getSavedContactIds,
} from "@/lib/api";
import { JournalistProfile } from "@/types";
import { useToast } from "@/hooks/use-toast";

const FindJournalists = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: journalists = [], isLoading } = useQuery({
    queryKey: ["journalists", searchTerm, selectedCategory],
    queryFn: () =>
      searchJournalists({
        searchTerm: searchTerm || undefined,
        category: selectedCategory || undefined,
      }),
    enabled: true, // Fetch on mount and when filters change
  });

  const { data: savedIds = [], refetch: refetchSaved } = useQuery({
    queryKey: ["saved-contacts-ids"],
    queryFn: getSavedContactIds,
  });

  const isSaved = (id: string) => savedIds.includes(id);

  const handleToggleSave = async (journalist: JournalistProfile) => {
    try {
      if (isSaved(journalist.userId)) {
        await removeSavedContact(journalist.userId);
        toast({
          title: "Contact Removed",
          description: `${journalist.press} contact removed from your list.`,
        });
      } else {
        await saveContact(journalist.userId);
        toast({
          title: "Contact Saved",
          description: `${journalist.press} contact saved to your list.`,
        });
      }
      refetchSaved();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update saved contacts.",
        variant: "destructive",
      });
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
              <TableHead className="text-right">Actions</TableHead>
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
                    <Button
                      size="sm"
                      disabled={isSaved(journalist.userId)}
                      className={
                        isSaved(journalist.userId) ? "text-green-500" : ""
                      }
                      variant={isSaved(journalist.userId) ? "ghost" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSave(journalist);
                      }}
                    >
                      {isSaved(journalist.userId) ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Contact
                        </>
                      )}
                    </Button>
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
