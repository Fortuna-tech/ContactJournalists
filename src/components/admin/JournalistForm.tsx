import { useState, KeyboardEvent } from "react";
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
import { Loader2, Trash2, X } from "lucide-react";

const formSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  press: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  x_handle: z.string().optional(),
  niches: z.array(z.string()).optional().nullable(),
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

  const [nicheInput, setNicheInput] = useState("");

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
      niches: defaultValues?.niches || [],
    },
  });

  const handleAddNiche = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = nicheInput.trim().replace(/,/g, "");
      if (value && value.length > 0) {
        const currentNiches = form.getValues("niches") || [];
        if (!currentNiches.includes(value)) {
          form.setValue("niches", [...currentNiches, value]);
        }
        setNicheInput("");
      }
    }
  };

  const handleRemoveNiche = (nicheToRemove: string) => {
    const currentNiches = form.getValues("niches") || [];
    form.setValue(
      "niches",
      currentNiches.filter((n) => n !== nicheToRemove)
    );
  };

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

            {/* Niches Tag Input */}
            <FormField
              control={form.control}
              name="niches"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niches / Beats</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        placeholder="Type a niche and press Enter..."
                        value={nicheInput}
                        onChange={(e) => setNicheInput(e.target.value)}
                        onKeyDown={handleAddNiche}
                      />
                      {field.value && field.value.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map((niche) => (
                            <span
                              key={niche}
                              className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-sm px-2.5 py-1 rounded-full border border-purple-200"
                            >
                              {niche}
                              <button
                                type="button"
                                onClick={() => handleRemoveNiche(niche)}
                                className="hover:text-purple-600 focus:outline-none"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Topics this journalist covers (e.g., AI, Startups, Finance)
                  </FormDescription>
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
