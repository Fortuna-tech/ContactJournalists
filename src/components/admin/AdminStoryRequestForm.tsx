import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CalendarIcon,
  Trash2,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Category, Query, JournalistProfile } from "@/types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { searchJournalists } from "@/lib/api";

// Schema for a single story request
export const storyRequestSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Please select a category"),
  deadline: z.date().optional(),
  journalistId: z.string().optional(),
});

export type StoryRequestFormValues = z.infer<typeof storyRequestSchema>;

interface AdminStoryRequestFormProps {
  categories: Category[];
  defaultValues?: Partial<StoryRequestFormValues>;
  onSubmit: (
    data: StoryRequestFormValues,
    sendAlerts?: boolean
  ) => Promise<void>;
  onDelete?: () => Promise<void>;
  isLoading?: boolean;
  isDeleting?: boolean;
  submitLabel?: string;
  showSendAlerts?: boolean;
  showDelete?: boolean;
  showJournalistField?: boolean;
  hideButtons?: boolean;
  onChange?: (values: StoryRequestFormValues) => void;
}

export default function AdminStoryRequestForm({
  categories,
  defaultValues,
  onSubmit,
  onDelete,
  isLoading = false,
  isDeleting = false,
  submitLabel = "Save",
  showSendAlerts = false,
  showDelete = false,
  showJournalistField = true,
  hideButtons = false,
  onChange,
}: AdminStoryRequestFormProps) {
  const [journalists, setJournalists] = useState<JournalistProfile[]>([]);
  const [journalistSearchOpen, setJournalistSearchOpen] = useState(false);
  const [isLoadingJournalists, setIsLoadingJournalists] = useState(false);

  const form = useForm<StoryRequestFormValues>({
    resolver: zodResolver(storyRequestSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      categoryId: defaultValues?.categoryId || "",
      deadline: defaultValues?.deadline,
      journalistId: defaultValues?.journalistId || "",
    },
  });

  // Reset form when defaultValues change (e.g., when opening edit modal with different query)
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        title: defaultValues.title || "",
        description: defaultValues.description || "",
        categoryId: defaultValues.categoryId || "",
        deadline: defaultValues.deadline,
        journalistId: defaultValues.journalistId || "",
      });
    }
  }, [defaultValues, form]);

  // Notify parent of value changes when using in bulk mode
  useEffect(() => {
    if (onChange) {
      const subscription = form.watch((values) => {
        onChange(values as StoryRequestFormValues);
      });
      return () => subscription.unsubscribe();
    }
  }, [form, onChange]);

  // Load journalists on mount for the search
  useEffect(() => {
    if (showJournalistField) {
      loadJournalists();
    }
  }, [showJournalistField]);

  const loadJournalists = async (searchTerm?: string) => {
    setIsLoadingJournalists(true);
    try {
      const results = await searchJournalists({ searchTerm });
      setJournalists(results);
    } catch (error) {
      console.error("Failed to load journalists:", error);
    } finally {
      setIsLoadingJournalists(false);
    }
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  const selectedJournalist = journalists.find(
    (j) => j.userId === form.watch("journalistId")
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Looking for experts on AI safety..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide more details about what you need..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4 items-start">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category / Beat *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col mt-3">
                <FormLabel>Deadline (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {showJournalistField && (
          <FormField
            control={form.control}
            name="journalistId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Author / Journalist</FormLabel>
                <Popover
                  open={journalistSearchOpen}
                  onOpenChange={setJournalistSearchOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {selectedJournalist
                          ? `${selectedJournalist.name} (${
                              selectedJournalist.press || "No publication"
                            })`
                          : "Select a journalist..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search journalists..."
                        onValueChange={(search) => {
                          if (search.length > 2) {
                            loadJournalists(search);
                          }
                        }}
                      />
                      <CommandList>
                        {isLoadingJournalists ? (
                          <div className="flex items-center justify-center py-6">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : (
                          <>
                            <CommandEmpty>No journalist found.</CommandEmpty>
                            <CommandGroup>
                              {journalists.map((journalist) => (
                                <CommandItem
                                  key={journalist.userId}
                                  value={`${journalist.name} ${journalist.press}`}
                                  onSelect={() => {
                                    form.setValue(
                                      "journalistId",
                                      journalist.userId
                                    );
                                    setJournalistSearchOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === journalist.userId
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span>{journalist.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {journalist.press || "No publication"}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {!hideButtons && (
          <div className="flex justify-end pt-4 gap-4">
            {showDelete && onDelete ? (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                disabled={isDeleting || isLoading}
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
            <Button
              variant={showSendAlerts ? "outline" : "default"}
              type="submit"
              disabled={isLoading || isDeleting}
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {submitLabel}
            </Button>
            {showSendAlerts && (
              <Button
                onClick={() => onSubmit(form.getValues(), true)}
                disabled={isLoading || isDeleting}
                className="ml-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save and Broadcast
              </Button>
            )}
          </div>
        )}
      </form>
    </Form>
  );
}

// Helper to convert Query to form values
export function queryToFormValues(query: Query): StoryRequestFormValues {
  return {
    title: query.title,
    description: query.description || "",
    categoryId: query.categoryId,
    deadline: query.deadline ? new Date(query.deadline) : undefined,
    journalistId: query.journalistId,
  };
}
