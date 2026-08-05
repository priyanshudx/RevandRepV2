"use client";

import { useState, useTransition } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { getAdminDietFileDownloadUrlAction } from "@/actions/admin";

interface AdminViewDietButtonProps {
  orderId: string;
  label?: string;
  className?: string;
}

export function AdminViewDietButton({
  orderId,
  label = "View / Download Published PDF",
  className = "btn-primary py-2.5 px-4 text-xs bg-[#22c55e] hover:bg-[#16a34a] justify-center inline-flex items-center gap-2 font-semibold",
}: AdminViewDietButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const res = await getAdminDietFileDownloadUrlAction(orderId);
      if (res.success && res.url) {
        window.open(res.url, "_blank");
      } else {
        alert(res.error ?? "Failed to get download link.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={className}
      id={`admin-view-pdf-btn-${orderId}`}
    >
      {isPending ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
      {isPending ? "Opening PDF…" : label}
    </button>
  );
}
