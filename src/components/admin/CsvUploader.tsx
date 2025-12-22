import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParsedCSV, parseCSV } from "@/lib/csv-utils";

interface CsvUploaderProps {
  onParsed: (data: ParsedCSV) => void;
  onError: (error: string) => void;
}

export function CsvUploader({ onParsed, onError }: CsvUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".csv")) {
        onError("Please upload a CSV file");
        return;
      }

      setIsLoading(true);
      setFileName(file.name);

      try {
        const parsed = await parseCSV(file);
        onParsed(parsed);
      } catch (err) {
        onError(err instanceof Error ? err.message : "Failed to parse CSV");
        setFileName(null);
      } finally {
        setIsLoading(false);
      }
    },
    [onParsed, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearFile = () => {
    setFileName(null);
  };

  if (fileName) {
    return (
      <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
        <FileText className="h-8 w-8 text-primary" />
        <div className="flex-1">
          <p className="font-medium">{fileName}</p>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Parsing..." : "Ready to import"}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={clearFile}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-12 text-center transition-colors
        ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept=".csv"
        onChange={handleInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <p className="text-lg font-medium mb-2">Drop your CSV file here</p>
      <p className="text-sm text-muted-foreground">
        or click to browse your files
      </p>
    </div>
  );
}
