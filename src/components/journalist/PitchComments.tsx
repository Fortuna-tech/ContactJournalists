import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PitchComment } from "@/types";
import { getPitchComments, createPitchComment, getProfile } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PitchCommentsProps {
  pitchId: string;
  currentUserId?: string;
  isJournalist: boolean;
}

export function PitchComments({
  pitchId,
  currentUserId,
  isJournalist,
}: PitchCommentsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["pitch-comments", pitchId],
    queryFn: () => getPitchComments(pitchId),
  });

  const createCommentMutation = useMutation({
    mutationFn: (content: string) => createPitchComment(pitchId, content),
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["pitch-comments", pitchId] });
    },
    onError: () => {
      toast({
        title: "Failed to post comment",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    createCommentMutation.mutate(newComment);
  };

  // Logic for "Only journalist can start commenting"
  // If there are no comments, only journalist can see the input form.
  // If there are comments, both can reply.
  const canComment = isJournalist || comments.length > 0;

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Loading comments...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-muted/30 rounded-md border">
      <ScrollArea className="flex-1 p-4 max-h-[300px]">
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4 italic">
              No comments yet.{" "}
              {isJournalist
                ? "Start a conversation by replying below."
                : "Waiting for the journalist to reply."}
            </p>
          ) : (
            comments.map((comment) => {
              const isCurrentUser = comment.userId === currentUserId;
              return (
                <div
                  key={comment.id}
                  className={`flex gap-3 ${
                    isCurrentUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="h-8 w-8 mt-0.5">
                    <AvatarFallback className="text-xs">
                      {comment.author?.name?.slice(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex flex-col max-w-[80%] ${
                      isCurrentUser ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {comment.author?.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div
                      className={`px-3 py-2 rounded-lg text-sm ${
                        isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-background border"
                      }`}
                    >
                      {comment.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {canComment && (
        <div className="p-3 border-t bg-background rounded-b-md">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type your reply..."
              className="min-h-[40px] max-h-[120px] resize-none"
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              disabled={createCommentMutation.isPending || !newComment.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
