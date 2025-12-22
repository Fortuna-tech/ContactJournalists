import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CsvUploader } from "@/components/admin/CsvUploader";
import { CsvMappingTable } from "@/components/admin/CsvMappingTable";
import {
  ParsedCSV,
  FieldMapping,
  autoDetectMappings,
  applyMapping,
  validateRow,
} from "@/lib/csv-utils";
import { bulkImportJournalists, BulkImportResult } from "@/lib/api";
import { toast } from "sonner";
import {
  Loader2,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  Image,
  XCircle,
} from "lucide-react";

type ImportState = "upload" | "mapping" | "importing" | "complete";

export default function CsvImportPage() {
  const [state, setState] = useState<ImportState>("upload");
  const [error, setError] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<ParsedCSV | null>(null);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(
    null
  );

  const handleParsed = useCallback((data: ParsedCSV) => {
    setCsvData(data);
    setMappings(autoDetectMappings(data.headers));
    setState("mapping");
    setError(null);
  }, []);

  const handleError = useCallback((err: string) => {
    setError(err);
    toast.error(err);
  }, []);

  const handleMappingChange = useCallback(
    (index: number, value: FieldMapping) => {
      setMappings((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
    },
    []
  );

  const handleImport = async () => {
    if (!csvData) return;

    setState("importing");

    try {
      const mappedData = applyMapping(csvData.rows, csvData.headers, mappings);

      // Validate all rows
      const validRows = mappedData.filter((row) => {
        const validation = validateRow(row);
        return validation.valid;
      });

      if (validRows.length === 0) {
        throw new Error("No valid rows to import");
      }

      const result = await bulkImportJournalists(validRows);
      setImportResult(result);
      setState("complete");
      toast.success(
        `Successfully imported ${result.recordsInserted} journalists`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
      setState("mapping");
      toast.error("Import failed");
    }
  };

  const handleReset = () => {
    setCsvData(null);
    setMappings([]);
    setImportResult(null);
    setError(null);
    setState("upload");
  };

  // Count how many rows have at least an email mapped
  const getValidRowCount = () => {
    if (!csvData) return 0;
    const mappedData = applyMapping(csvData.rows, csvData.headers, mappings);
    return mappedData.filter((row) => validateRow(row).valid).length;
  };

  // Check if email_screenshot is mapped
  const hasEmailScreenshot = mappings.includes("email_screenshot");

  // Separate errors by type
  const recordErrors =
    importResult?.errors.filter((e) => e.type === "record") || [];
  const imageErrors =
    importResult?.errors.filter((e) => e.type === "image") || [];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">CSV Import</h1>
      <p className="text-muted-foreground mb-8">
        Bulk import journalist profiles from a CSV file
      </p>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload State */}
      {state === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
          </CardHeader>
          <CardContent>
            <CsvUploader onParsed={handleParsed} onError={handleError} />
          </CardContent>
        </Card>
      )}

      {/* Mapping State */}
      {state === "mapping" && csvData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Map Columns</CardTitle>
              <p className="text-sm text-muted-foreground">
                Click on the dropdown in each column header to map it to a
                profile field. Columns mapped to "Skip" will be ignored.
              </p>
            </CardHeader>
            <CardContent>
              <CsvMappingTable
                headers={csvData.headers}
                rows={csvData.rows}
                mappings={mappings}
                onMappingChange={handleMappingChange}
              />
            </CardContent>
          </Card>

          {hasEmailScreenshot && (
            <Alert>
              <Image className="h-4 w-4" />
              <AlertDescription>
                Email screenshots will be downloaded and uploaded to storage.
                Google Drive links are supported. Images must be under 5MB.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleReset}>
              Start Over
            </Button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {getValidRowCount()} of {csvData.rows.length} rows valid
              </span>
              <Button
                onClick={handleImport}
                disabled={getValidRowCount() === 0}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import {getValidRowCount()} Journalists
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Importing State */}
      {state === "importing" && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Importing journalists...</p>
            <p className="text-sm text-muted-foreground">
              {hasEmailScreenshot
                ? "Downloading and uploading email screenshots..."
                : "This may take a moment"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Complete State - Operation Overview */}
      {state === "complete" && importResult && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-500/10">
                    <FileText className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {importResult.recordsInserted}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Records Inserted
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-500/10">
                    <Image className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {importResult.imagesUploaded}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Images Uploaded
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-red-500/10">
                    <XCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {importResult.errors.length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Errors
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Success Message */}
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <h2 className="text-xl font-bold">Import Complete</h2>
                  <p className="text-muted-foreground">
                    Successfully processed {csvData?.rows.length || 0} rows
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Record Errors */}
          {recordErrors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Record Errors ({recordErrors.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {recordErrors.slice(0, 20).map((err, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-red-600"
                    >
                      <Badge variant="outline" className="shrink-0">
                        Row {err.row}
                      </Badge>
                      <span>{err.message}</span>
                    </li>
                  ))}
                  {recordErrors.length > 20 && (
                    <li className="text-sm text-muted-foreground">
                      ...and {recordErrors.length - 20} more
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Image Errors */}
          {imageErrors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <Image className="h-5 w-5" />
                  Image Upload Errors ({imageErrors.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {imageErrors.slice(0, 20).map((err, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-yellow-600"
                    >
                      <Badge variant="outline" className="shrink-0">
                        Row {err.row}
                      </Badge>
                      <span>{err.message}</span>
                    </li>
                  ))}
                  {imageErrors.length > 20 && (
                    <li className="text-sm text-muted-foreground">
                      ...and {imageErrors.length - 20} more
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={handleReset}>
              Import More
            </Button>
            <Button
              onClick={() => (window.location.href = "/admin/journalists")}
            >
              View Journalists
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
