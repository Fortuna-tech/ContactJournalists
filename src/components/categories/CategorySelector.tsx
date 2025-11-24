import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCategories, createCategory } from "@/lib/api";
import { CATEGORY_INPUT_PATTERN } from "@/lib/categories";
import { Category } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";

interface CategorySelectorProps {
  selectedCategoryId: string | null;
  onSelect: (categoryId: string) => void;
}

const CategorySelector = ({
  selectedCategoryId,
  onSelect,
}: CategorySelectorProps) => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCategoryId && categories.length > 0) {
      onSelect(categories[0].id);
    }
  }, [selectedCategoryId, categories, onSelect]);

  const createCategoryMutation = useMutation({
    mutationFn: async (title: string) => {
      return await createCategory(title);
    },
    onSuccess: (category: Category) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setNewCategoryTitle("");
      setInputError(null);
      onSelect(category.id);
      toast({ title: "Category added", description: category.title });
    },
    onError: (error: Error) => {
      toast({
        title: "Unable to add category",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryTitle.trim();

    if (!trimmed) {
      setInputError("Please enter a category name");
      return;
    }

    if (!CATEGORY_INPUT_PATTERN.test(trimmed)) {
      setInputError("Only letters, numbers, and spaces are allowed");
      return;
    }

    if (
      categories.some(
        (category) => category.title.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      setInputError("Category already exists");
      return;
    }

    setInputError(null);
    createCategoryMutation.mutate(trimmed);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Category</Label>
        <p className="text-sm text-muted-foreground">
          Select the category that best fits your query
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {isLoading && (
          <Button variant="outline" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading categories
          </Button>
        )}

        {!isLoading && categories.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No categories yet—add one below to get started.
          </p>
        )}

        {categories.map((category) => (
          <Button
            key={category.id}
            type="button"
            variant={selectedCategoryId === category.id ? "default" : "outline"}
            onClick={() => onSelect(category.id)}
            className="rounded-full h-8 text-xs"
          >
            {category.title}
          </Button>
        ))}
        <form onSubmit={handleAddCategory} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new"
              value={newCategoryTitle}
              onChange={(e) => {
                setNewCategoryTitle(e.target.value);
                if (inputError) setInputError(null);
              }}
            />
            <Button
              type="submit"
              variant="outline"
              className="px-3"
              size="icon"
              disabled={createCategoryMutation.isPending}
            >
              {createCategoryMutation.isPending ? (
                <Loader2 className="w-4 h-4  animate-spin" />
              ) : (
                <Plus className="w-4 h-4 " />
              )}
            </Button>
          </div>
          {inputError && (
            <p className="text-sm text-destructive">{inputError}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CategorySelector;
