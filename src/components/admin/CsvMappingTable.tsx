import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  FieldMapping,
  MAPPING_OPTIONS,
  validateRow,
  applyMapping,
} from "@/lib/csv-utils";
import { AlertCircle, CheckCircle } from "lucide-react";

interface CsvMappingTableProps {
  headers: string[];
  rows: string[][];
  mappings: FieldMapping[];
  onMappingChange: (index: number, value: FieldMapping) => void;
  maxPreviewRows?: number;
}

export function CsvMappingTable({
  headers,
  rows,
  mappings,
  onMappingChange,
  maxPreviewRows = 5,
}: CsvMappingTableProps) {
  const previewRows = rows.slice(0, maxPreviewRows);

  // Calculate mapped data for validation preview
  const mappedData = useMemo(
    () => applyMapping(previewRows, headers, mappings),
    [previewRows, headers, mappings]
  );

  const validations = useMemo(
    () => mappedData.map((row) => validateRow(row)),
    [mappedData]
  );

  // Check for duplicate mappings (except 'skip')
  const duplicateMappings = useMemo(() => {
    const counts: Record<string, number> = {};
    mappings.forEach((m) => {
      if (m !== "skip") {
        counts[m] = (counts[m] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .filter(([, count]) => count > 1)
      .map(([field]) => field);
  }, [mappings]);

  return (
    <div className="space-y-4">
      {duplicateMappings.length > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">
            Duplicate mappings detected:{" "}
            {duplicateMappings
              .map((f) => MAPPING_OPTIONS.find((o) => o.value === f)?.label)
              .join(", ")}
          </span>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[60px] text-center">#</TableHead>
                {headers.map((header, index) => (
                  <TableHead key={index} className="min-w-[180px]">
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground truncate">
                        {header}
                      </div>
                      <Select
                        value={mappings[index]}
                        onValueChange={(value: FieldMapping) =>
                          onMappingChange(index, value)
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MAPPING_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-[100px] text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewRows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={
                    !validations[rowIndex]?.valid ? "bg-red-500/5" : ""
                  }
                >
                  <TableCell className="text-center text-muted-foreground">
                    {rowIndex + 1}
                  </TableCell>
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      className={
                        mappings[cellIndex] === "skip"
                          ? "text-muted-foreground/50"
                          : ""
                      }
                    >
                      <span className="block truncate max-w-[200px]">
                        {cell || (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </span>
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    {validations[rowIndex]?.valid ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        {validations[rowIndex]?.errors.map((err, i) => (
                          <Badge
                            key={i}
                            variant="destructive"
                            className="text-xs"
                          >
                            {err}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {rows.length > maxPreviewRows && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {maxPreviewRows} of {rows.length} rows
        </p>
      )}
    </div>
  );
}
