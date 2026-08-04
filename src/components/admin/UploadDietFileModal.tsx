"use client";

import { useRef, useState, useTransition } from "react";
import { X, Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { uploadDietFileAction } from "@/actions/admin";

interface UploadDietFileModalProps {
  orderId: string;
  userName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function UploadDietFileModal({
  orderId,
  userName,
  onClose,
  onSuccess,
}: UploadDietFileModalProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(file: File | null) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10 MB.");
      return;
    }
    setSelectedFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    handleFileChange(file);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("file", selectedFile);

    startTransition(async () => {
      const result = await uploadDietFileAction(formData);
      if (result.success) {
        toast.success("Diet plan uploaded successfully!");
        onSuccess();
        onClose();
      } else {
        toast.error(result.error ?? "Upload failed. Please try again.");
      }
    });
  }

  const fileSizeMB = selectedFile
    ? (selectedFile.size / (1024 * 1024)).toFixed(2)
    : null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal */}
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "#141414",
          border: "1px solid #2a2a2a",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]">
          <div>
            <p className="text-white font-bold text-sm">Upload Diet Plan</p>
            <p className="text-[#5a5a5a] text-xs mt-0.5">
              For: <span className="text-[#a0a0a0]">{userName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost p-1.5 rounded-lg"
            id="upload-modal-close"
            disabled={isPending}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Drop zone */}
          <div
            className="rounded-xl border-2 border-dashed transition-colors mb-4 cursor-pointer"
            style={{
              borderColor: dragOver
                ? "#c41e3a"
                : selectedFile
                ? "#22c55e"
                : "#2a2a2a",
              background: dragOver
                ? "rgba(196,30,58,0.05)"
                : selectedFile
                ? "rgba(34,197,94,0.04)"
                : "rgba(255,255,255,0.02)",
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              id="diet-file-input"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />

            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              {selectedFile ? (
                <>
                  <div className="w-12 h-12 rounded-xl bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] flex items-center justify-center mb-3">
                    <CheckCircle size={22} className="text-[#22c55e]" />
                  </div>
                  <p className="text-white font-medium text-sm mb-1 break-all">
                    {selectedFile.name}
                  </p>
                  <p className="text-[#5a5a5a] text-xs">{fileSizeMB} MB — PDF</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-[rgba(196,30,58,0.08)] border border-[rgba(196,30,58,0.15)] flex items-center justify-center mb-3">
                    <FileText size={22} className="text-[#c41e3a]" />
                  </div>
                  <p className="text-white text-sm font-medium mb-1">
                    Drop PDF here or click to browse
                  </p>
                  <p className="text-[#5a5a5a] text-xs">PDF only · max 10 MB</p>
                </>
              )}
            </div>
          </div>

          {/* Order ID & Recipient reference */}
          <div className="rounded-lg px-3 py-2.5 mb-5 space-y-1" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1e1e1e" }}>
            <p className="text-[#a0a0a0] text-xs">
              Recipient: <span className="text-white font-semibold">{userName}</span>
            </p>
            <p className="text-[#5a5a5a] text-xs font-mono">
              Order ID: <span className="text-[#a0a0a0]">{orderId}</span>
            </p>
            {selectedFile && (
              <p className="text-[#f59e0b] font-medium text-[11px] pt-1">
                ⚠️ Verify that this PDF is intended for {userName} before confirming.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1 py-2.5 text-xs"
              disabled={isPending}
              id="upload-modal-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 py-2.5 text-xs justify-center"
              disabled={isPending || !selectedFile}
              id="upload-modal-submit"
            >
              {isPending ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Publishing…
                </>
              ) : (
                <>
                  <Upload size={15} />
                  Confirm &amp; Publish Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
