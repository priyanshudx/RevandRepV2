"use client";

import { useState, useTransition } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getDietFileDownloadUrlAction } from "@/actions/orders";

interface DownloadButtonProps {
  orderId: string;
  /** Extra class names to customize the button appearance */
  className?: string;
  id?: string;
}

/**
 * Client component that fetches a signed Supabase URL via server action
 * and opens the PDF in a new tab.
 */
export function DownloadButton({ orderId, className, id }: DownloadButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDownload() {
    startTransition(async () => {
      const result = await getDietFileDownloadUrlAction(orderId);
      if (result.success && result.url) {
        window.open(result.url, "_blank", "noopener,noreferrer");
      } else {
        toast.error(result.error ?? "Failed to generate download link.");
      }
    });
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isPending}
      className={className ?? "btn-ghost py-1.5 px-3 text-xs"}
      id={id ?? `download-${orderId}`}
      title="Download diet plan PDF"
    >
      {isPending ? (
        <Loader2 size={13} className="animate-spin" />
      ) : (
        <Download size={13} />
      )}
      Download
    </button>
  );
}
