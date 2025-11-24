import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMediaLists,
  createMediaList,
  deleteMediaList,
  getMediaListMembers,
  removeJournalistFromMediaList,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Folder, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const MediaLists = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const listId = searchParams.get("list_id");

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {listId ? (
        <MediaListDetail listId={listId} onBack={() => setSearchParams({})} />
      ) : (
        <MediaListIndex onSelect={(id) => setSearchParams({ list_id: id })} />
      )}
    </div>
  );
};

const MediaListIndex = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newListName, setNewListName] = useState("");

  const { data: lists = [], isLoading } = useQuery({
    queryKey: ["media-lists"],
    queryFn: getMediaLists,
  });

  const createMutation = useMutation({
    mutationFn: createMediaList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-lists"] });
      setIsCreateOpen(false);
      setNewListName("");
      toast({ title: "Success", description: "Media list created" });
    },
    onError: () =>
      toast({
        title: "Error",
        description: "Failed to create list",
        variant: "destructive",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMediaList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-lists"] });
      toast({ title: "Success", description: "Media list deleted" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Media Lists</h1>
          <p className="text-muted-foreground">
            Organize your contacts into lists.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Media List</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="List Name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => createMutation.mutate(newListName)}
                disabled={!newListName || createMutation.isPending}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  Loading...
                </TableCell>
              </TableRow>
            ) : lists.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No media lists found.
                </TableCell>
              </TableRow>
            ) : (
              lists.map((list) => (
                <TableRow
                  key={list.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onSelect(list.id)}
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    <Folder className="h-4 w-4 text-blue-500" />
                    {list.name}
                  </TableCell>
                  <TableCell>{list.memberCount} journalists</TableCell>
                  <TableCell>
                    {format(new Date(list.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Are you sure?"))
                          deleteMutation.mutate(list.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
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

const MediaListDetail = ({
  listId,
  onBack,
}: {
  listId: string;
  onBack: () => void;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch list details (for name) - optimization: pass name or fetch singular list
  const { data: lists } = useQuery({
    queryKey: ["media-lists"],
    queryFn: getMediaLists,
  });
  const list = lists?.find((l) => l.id === listId);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["media-list-members", listId],
    queryFn: () => getMediaListMembers(listId),
  });

  const removeMutation = useMutation({
    mutationFn: (journalistId: string) =>
      removeJournalistFromMediaList(listId, journalistId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["media-list-members", listId],
      });
      queryClient.invalidateQueries({ queryKey: ["media-lists"] }); // Update counts
      toast({ title: "Success", description: "Contact removed from list" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{list?.name || "Media List"}</h1>
          <p className="text-muted-foreground">{members.length} contacts</p>
        </div>
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
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No contacts in this list.
                </TableCell>
              </TableRow>
            ) : (
              members.map((journalist) => (
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
                  <TableCell>{journalist.press || "Unknown"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {journalist.categories?.slice(0, 2).map((cat) => (
                        <Badge
                          key={cat}
                          variant="secondary"
                          className="text-xs"
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{journalist.queryCount}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMutation.mutate(journalist.userId);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
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

export default MediaLists;
