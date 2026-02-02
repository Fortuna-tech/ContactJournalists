import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, X } from "lucide-react";
import { TOPIC_LIST } from "@/lib/smart-topics";

const formSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  press: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  x_handle: z.string().optional(),
  categories: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface JournalistFormProps {
  defaultValues?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  trigger?: React.ReactNode;
  title: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function JournalistForm({
  defaultValues,
  onSubmit,
  onDelete,
  trigger,
  title,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: JournalistFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAllTopics, setShowAllTopics] = useState(false);

  // Support both controlled and uncontrolled mode
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (isControlled && controlledOnOpenChange) {
      controlledOnOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: defaultValues?.full_name || "",
      email: defaultValues?.email || "",
      press: defaultValues?.press || "",
      company: defaultValues?.company || "",
      website: defaultValues?.website || "",
      linkedin: defaultValues?.linkedin || "",
      x_handle: defaultValues?.x_handle || "",
      categories: defaultValues?.categories || [],
    },
  });

  const PRIMARY_TOPICS = TOPIC_LIST.slice(0, 12);
  const displayedTopics = showAllTopics ? TOPIC_LIST : PRIMARY_TOPICS;

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setOpen(false);
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@publication.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="press"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publication / Press</FormLabel>
                  <FormControl>
                    <Input placeholder="TechCrunch" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Media Company Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/in/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="x_handle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>X Handle</FormLabel>
                  <FormControl>
                    <Input placeholder="@johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topics</FormLabel>
                  <FormDescription>
                    Select topics this journalist covers
                  </FormDescription>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {displayedTopics.map((topic) => {
                          const isSelected = field.value?.includes(topic);
                          return (
                            <Badge
                              key={topic}
                              variant={isSelected ? "default" : "outline"}
                              className="cursor-pointer hover:opacity-80 text-xs"
                              onClick={() => {
                                const current = field.value || [];
                                if (isSelected) {
                                  field.onChange(current.filter((t) => t !== topic));
                                } else {
                                  field.onChange([...current, topic]);
                                }
                              }}
                            >
                              {topic}
                              {isSelected && <X className="h-3 w-3 ml-1" />}
                            </Badge>
                          );
                        })}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground hover:text-foreground h-6 px-2"
                          onClick={() => setShowAllTopics(!showAllTopics)}
                        >
                          {showAllTopics ? "Show less" : `+${TOPIC_LIST.length - PRIMARY_TOPICS.length} more`}
                        </Button>
                      </div>
                      {field.value && field.value.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Selected: {field.value.join(", ")}
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between gap-2 pt-4">
              {defaultValues && onDelete ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={async () => {
                    if (
                      !confirm(
                        "Are you sure you want to delete this journalist?"
                      )
                    ) {
                      return;
                    }
                    setIsDeleting(true);
                    try {
                      await onDelete();
                      setOpen(false);
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                  disabled={isDeleting || isSubmitting}
                >
                  {isDeleting && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || isDeleting}>
                  {isSubmitting && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {defaultValues ? "Save Changes" : "Create Journalist"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
