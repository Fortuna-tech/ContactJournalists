import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderPlus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getSavedContacts,
  getMediaLists,
  addJournalistToMediaList,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { JournalistProfile } from "@/types";

const SavedContacts = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedJournalistId, setSelectedJournalistId] = useState<
    string | null
  >(null);
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string>("");

  const {
    data: savedContacts = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["saved-contacts"],
    queryFn: getSavedContacts,
  });

  const { data: mediaLists = [] } = useQuery({
    queryKey: ["media-lists"],
    queryFn: getMediaLists,
  });

  const addToListMutation = useMutation({
    mutationFn: () =>
      addJournalistToMediaList(selectedListId, selectedJournalistId!),
    onSuccess: () => {
      toast({ title: "Success", description: "Added to media list" });
      setIsAddListOpen(false);
      setSelectedListId("");
      setSelectedJournalistId(null);
    },
    onError: () =>
      toast({
        title: "Error",
        description: "Could not add to list",
        variant: "destructive",
      }),
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Saved Contacts</h1>
        <p className="text-muted-foreground">
          Manage your saved journalist contacts.
        </p>
      </div>

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
            ) : savedContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No saved contacts found.
                </TableCell>
              </TableRow>
            ) : (
              savedContacts.map((journalist) => (
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
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJournalistId(journalist.userId);
                          setIsAddListOpen(true);
                        }}
                      >
                        <FolderPlus className="h-4 w-4 mr-2" />
                        Add to List
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isAddListOpen} onOpenChange={setIsAddListOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Media List</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Select a media list to add this contact to.
            </p>
            <Select value={selectedListId} onValueChange={setSelectedListId}>
              <SelectTrigger>
                <SelectValue placeholder="Select list..." />
              </SelectTrigger>
              <SelectContent>
                {mediaLists.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddListOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => addToListMutation.mutate()}
              disabled={!selectedListId || addToListMutation.isPending}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedContacts;
