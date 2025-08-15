"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import emailTrackerAPI from "@/lib/emailtracker-api";

interface ImportContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

interface ImportResult {
  imported: number;
  errors: Array<{ row: number; error: string }>;
}

export function ImportContactsModal({ isOpen, onClose, onImportComplete }: ImportContactsModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file);
        setError("");
        setImportResult(null);
      } else {
        setError("Please select a CSV file");
        setSelectedFile(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file);
        setError("");
        setImportResult(null);
      } else {
        setError("Please select a CSV file");
        setSelectedFile(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const result = await emailTrackerAPI.importContacts(selectedFile);
      setImportResult(result);
      if (result.imported > 0) {
        onImportComplete();
      }
    } catch (error) {
      console.error("Import failed:", error);
      setError("Import failed. Please check your file format and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImportResult(null);
    setError("");
    onClose();
  };

  const downloadTemplate = () => {
    const csvContent = "email,first_name,last_name,status,tags\nexample@email.com,John,Doe,active,\"Newsletter,Premium\"";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple contacts at once
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!importResult && (
            <>
              <div className="text-sm text-gray-600">
                <p className="mb-2">Your CSV file should include the following columns:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>email</strong> - Required, must be valid email addresses</li>
                  <li><strong>first_name</strong> - Optional</li>
                  <li><strong>last_name</strong> - Optional</li>
                  <li><strong>status</strong> - Optional (active, unsubscribed, bounced)</li>
                  <li><strong>tags</strong> - Optional, comma-separated in quotes</li>
                </ul>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-blue-600"
                  onClick={downloadTemplate}
                >
                  Download CSV template
                </Button>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  selectedFile 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {selectedFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Different File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="font-medium">Drop your CSV file here</p>
                    <p className="text-sm text-gray-500">or</p>
                    <Button 
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Choose File
                    </Button>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </>
          )}

          {importResult && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Import Complete!</h3>
                <p className="text-gray-600">
                  Successfully imported {importResult.imported} contacts
                </p>
              </div>

              {importResult.errors.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Import Warnings ({importResult.errors.length})
                  </h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {importResult.errors.map((error, index) => (
                      <p key={index} className="text-sm text-yellow-700">
                        Row {error.row}: {error.error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {!importResult ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={!selectedFile || loading}
              >
                {loading ? "Importing..." : "Import Contacts"}
              </Button>
            </>
          ) : (
            <Button onClick={handleClose}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
