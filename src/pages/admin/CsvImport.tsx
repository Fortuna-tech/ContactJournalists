import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  bulkImportJournalists,
  processImageBatch,
  BulkImportResult,
} from "@/lib/api";
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
  AlertTriangle,
} from "lucide-react";
import { adminTheme } from "@/styles/adminTheme";

type ImportState = "upload" | "mapping" | "importing" | "complete";
type ImportPhase = "profiles" | "images";

const PROFILE_BATCH_SIZE = 100;
const IMAGE_BATCH_SIZE = 10;

export default function CsvImportPage() {
  const [state, setState] = useState<ImportState>("upload");
  const [error, setError] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<ParsedCSV | null>(null);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(
    null
  );

  // Progress tracking
  const [phase, setPhase] = useState<ImportPhase>("profiles");
  const [profileProgress, setProfileProgress] = useState({
    current: 0,
    total: 0,
  });
  const [imageProgress, setImageProgress] = useState({
    current: 0,
    total: 0,
    successful: 0,
    failed: 0,
  });

  // Warn user about closing tab during import
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state === "importing") {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [state]);

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
    setPhase("profiles");
    setError(null);

    const mappedData = applyMapping(csvData.rows, csvData.headers, mappings);

    // Validate all rows
    const validRows = mappedData.filter((row) => {
      const validation = validateRow(row);
      return validation.valid;
    });

    if (validRows.length === 0) {
      setError("No valid rows to import");
      setState("mapping");
      toast.error("No valid rows to import");
      return;
    }

    // ===== PHASE 1: Import profiles in batches =====
    setProfileProgress({ current: 0, total: validRows.length });

    const aggregatedResult: BulkImportResult = {
      recordsInserted: 0,
      skipped: 0,
      skippedRows: [],
      errors: [],
      profilesWithImages: [],
    };

    for (let i = 0; i < validRows.length; i += PROFILE_BATCH_SIZE) {
      const batch = validRows.slice(i, i + PROFILE_BATCH_SIZE);
      try {
        const batchResult = await bulkImportJournalists(batch);

        // Aggregate results
        aggregatedResult.recordsInserted += batchResult.recordsInserted;
        aggregatedResult.skipped += batchResult.skipped;
        aggregatedResult.skippedRows.push(...batchResult.skippedRows);
        aggregatedResult.errors.push(...batchResult.errors);
        aggregatedResult.profilesWithImages.push(
          ...batchResult.profilesWithImages
        );
      } catch (err) {
        // Log batch error but continue with next batch
        console.error(`Batch ${i / PROFILE_BATCH_SIZE + 1} failed:`, err);
        aggregatedResult.errors.push({
          row: i + 1,
          message: `Batch failed: ${
            err instanceof Error ? err.message : "Unknown error"
          }`,
        });
      }

      // Update progress regardless of success/failure
      setProfileProgress({
        current: Math.min(i + PROFILE_BATCH_SIZE, validRows.length),
        total: validRows.length,
      });
    }

    // ===== PHASE 2: Process images in batches =====
    // Always transition to Phase 2 (independent of Phase 1 results)
    setPhase("images");

    if (aggregatedResult.profilesWithImages.length > 0) {
      let imageQueue = [...aggregatedResult.profilesWithImages];
      const totalImages = imageQueue.length;

      setImageProgress({
        current: 0,
        total: totalImages,
        successful: 0,
        failed: 0,
      });

      let successfulCount = 0;
      let failedCount = 0;

      while (imageQueue.length > 0) {
        const batch = imageQueue.slice(0, IMAGE_BATCH_SIZE);
        try {
          const result = await processImageBatch(batch);

          // Remove successful items from queue
          const successfulIds = new Set(result.successful);
          imageQueue = imageQueue.filter(
            (item) => !successfulIds.has(item.profileId)
          );

          // Also remove failed items (don't retry failed items in this run)
          const failedIds = new Set(result.failed.map((f) => f.profileId));
          imageQueue = imageQueue.filter(
            (item) => !failedIds.has(item.profileId)
          );

          successfulCount += result.successful.length;
          failedCount += result.failed.length;
        } catch (err) {
          // Mark current batch as failed but continue
          console.error("Image batch failed:", err);
          failedCount += batch.length;
          // Remove failed batch from queue
          const batchIds = new Set(batch.map((b) => b.profileId));
          imageQueue = imageQueue.filter(
            (item) => !batchIds.has(item.profileId)
          );
        }

        setImageProgress({
          current: successfulCount + failedCount,
          total: totalImages,
          successful: successfulCount,
          failed: failedCount,
        });
      }
    } else {
      // No images to process, mark as complete immediately
      setImageProgress({
        current: 0,
        total: 0,
        successful: 0,
        failed: 0,
      });
    }

    setImportResult(aggregatedResult);
    setState("complete");

    const successMsg = `Imported ${aggregatedResult.recordsInserted} journalists`;
    const skipMsg =
      aggregatedResult.skipped > 0
        ? `, ${aggregatedResult.skipped} skipped`
        : "";
    const errorMsg =
      aggregatedResult.errors.length > 0
        ? `, ${aggregatedResult.errors.length} errors`
        : "";

    if (aggregatedResult.recordsInserted > 0 || aggregatedResult.skipped > 0) {
      toast.success(successMsg + skipMsg + errorMsg);
    } else if (aggregatedResult.errors.length > 0) {
      toast.error("Import completed with errors");
    }
  };

  const handleReset = () => {
    setCsvData(null);
    setMappings([]);
    setImportResult(null);
    setError(null);
    setProfileProgress({ current: 0, total: 0 });
    setImageProgress({ current: 0, total: 0, successful: 0, failed: 0 });
    setPhase("profiles");
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
    <div className={adminTheme.container}>
      <div className={adminTheme.pageHeader}>
        <h1 className={adminTheme.pageTitle} style={adminTheme.pageTitleStyle}>
          CSV Import
        </h1>
        <p className={adminTheme.pageSubtitle}>
          Bulk import journalist profiles from a CSV file
        </p>
      </div>

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
                for later processing.{" "}
                <span className="font-bold text-amber-500">
                  Only Google Drive links are supported.
                </span>
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

      {/* Importing State with Two-Phase Progress */}
      {state === "importing" && (
        <div className="space-y-6">
          {/* Warning Alert */}
          <Alert
            variant="destructive"
            className="border-yellow-500 bg-yellow-500/10"
          >
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertTitle className="text-yellow-600">
              Do not close this tab
            </AlertTitle>
            <AlertDescription className="text-yellow-600">
              Import in progress. Closing or navigating away may interrupt the
              process and cause incomplete data.
            </AlertDescription>
          </Alert>

          <Card>
            <CardContent className="py-8 space-y-8">
              {/* Phase 1: Profiles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {phase === "profiles" ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <span className="font-medium">
                      Phase 1: Importing Profiles
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {profileProgress.current} / {profileProgress.total}
                  </span>
                </div>
                <Progress
                  value={
                    profileProgress.total > 0
                      ? (profileProgress.current / profileProgress.total) * 100
                      : 0
                  }
                />
              </div>

              {/* Phase 2: Images */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {phase === "profiles" ? (
                      <div className="h-5 w-5 rounded-full border-2 border-muted" />
                    ) : imageProgress.current < imageProgress.total ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <span
                      className={`font-medium ${
                        phase === "profiles" ? "text-muted-foreground" : ""
                      }`}
                    >
                      Phase 2: Processing Images
                    </span>
                  </div>
                  {phase === "images" && (
                    <span className="text-sm text-muted-foreground">
                      {imageProgress.current} / {imageProgress.total}
                      {imageProgress.failed > 0 && (
                        <span className="text-red-500 ml-2">
                          ({imageProgress.failed} failed)
                        </span>
                      )}
                    </span>
                  )}
                </div>
                <Progress
                  value={
                    phase === "images" && imageProgress.total > 0
                      ? (imageProgress.current / imageProgress.total) * 100
                      : 0
                  }
                  className={phase === "profiles" ? "opacity-50" : ""}
                />
              </div>
            </CardContent>
          </Card>
        </div>
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

          {/* Image Processing Stats */}
          {imageProgress.total > 0 && (
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center gap-4">
                  <Image className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">Image Processing</p>
                    <p className="text-sm text-muted-foreground">
                      {imageProgress.successful} uploaded successfully
                      {imageProgress.failed > 0 && (
                        <span className="text-red-500">
                          , {imageProgress.failed} failed
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
