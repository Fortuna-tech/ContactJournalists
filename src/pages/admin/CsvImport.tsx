import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  SkipForward,
  XCircle,
  Image,
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
  const [progress, setProgress] = useState({ current: 0, total: 0 });

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

      setProgress({ current: 0, total: validRows.length });

      const result = await bulkImportJournalists(validRows);
      setImportResult(result);
      setProgress({ current: validRows.length, total: validRows.length });
      setState("complete");

      const successMsg = `Imported ${result.recordsInserted} journalists`;
      const skipMsg =
        result.skipped > 0 ? `, ${result.skipped} skipped (already exist)` : "";
      toast.success(successMsg + skipMsg);
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
    setProgress({ current: 0, total: 0 });
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
                Email screenshots URLs will be stored in the profile metadata
                for later processing. Google Drive links are supported.
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

      {/* Importing State with Progress */}
      {state === "importing" && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium mb-2">Importing journalists...</p>
            <p className="text-sm text-muted-foreground mb-4">
              Processing {progress.total} records
            </p>
            <div className="w-64">
              <Progress
                value={
                  progress.total > 0
                    ? (progress.current / progress.total) * 100
                    : 0
                }
              />
            </div>
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
                  <div className="p-3 rounded-full bg-orange-500/10">
                    <SkipForward className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{importResult.skipped}</p>
                    <p className="text-sm text-muted-foreground">
                      Skipped (Already Exist)
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
                    <p className="text-sm text-muted-foreground">Errors</p>
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
                    {importResult.recordsInserted} / {csvData?.rows.length || 0}{" "}
                    synced
                    {importResult.skipped > 0 &&
                      `, ${importResult.skipped} skipped`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skipped Rows (Orange) */}
          {importResult.skippedRows.length > 0 && (
            <Card className="border-orange-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <SkipForward className="h-5 w-5" />
                  Skipped - Already Exist ({importResult.skippedRows.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {importResult.skippedRows.slice(0, 20).map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-orange-600"
                    >
                      <Badge
                        variant="outline"
                        className="shrink-0 border-orange-500 text-orange-600"
                      >
                        Row {item.row}
                      </Badge>
                      <span>{item.email}</span>
                    </li>
                  ))}
                  {importResult.skippedRows.length > 20 && (
                    <li className="text-sm text-muted-foreground">
                      ...and {importResult.skippedRows.length - 20} more
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Errors (Red) */}
          {importResult.errors.length > 0 && (
            <Card className="border-red-500/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Errors ({importResult.errors.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {importResult.errors.slice(0, 20).map((err, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-red-600"
                    >
                      <Badge
                        variant="outline"
                        className="shrink-0 border-red-500 text-red-600"
                      >
                        Row {err.row}
                      </Badge>
                      <span>{err.message}</span>
                    </li>
                  ))}
                  {importResult.errors.length > 20 && (
                    <li className="text-sm text-muted-foreground">
                      ...and {importResult.errors.length - 20} more
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
