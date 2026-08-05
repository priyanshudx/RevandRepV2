"use client";

import { useState, useTransition } from "react";
import {
  CheckCircle,
  XCircle,
  Upload,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Clock,
  FileText,
  Save,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { formatDate, formatPhone, enumToLabel } from "@/lib/utils";
import {
  verifyPaymentAction,
  rejectPaymentAction,
  saveDietDraftAction,
  uploadDietFileAction,
  deleteOrderAction,
  getAdminDietFileDownloadUrlAction,
} from "@/actions/admin";
import type { OrderWithDetails } from "@/types";

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  QUESTIONNAIRE_SUBMITTED: {
    label: "Awaiting Payment",
    cls: "bg-[rgba(160,160,160,0.1)] text-[#a0a0a0] border-[rgba(160,160,160,0.2)]",
  },
  PAYMENT_PENDING: {
    label: "Pending Verification",
    cls: "bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border-[rgba(245,158,11,0.2)]",
  },
  PAYMENT_VERIFIED: {
    label: "Verified",
    cls: "bg-[rgba(34,197,94,0.1)] text-[#22c55e] border-[rgba(34,197,94,0.2)]",
  },
  PAYMENT_REJECTED: {
    label: "Rejected",
    cls: "bg-[rgba(196,30,58,0.1)] text-[#c41e3a] border-[rgba(196,30,58,0.2)]",
  },
  DIET_IN_PROGRESS: {
    label: "Diet In Progress",
    cls: "bg-[rgba(59,130,246,0.1)] text-[#3b82f6] border-[rgba(59,130,246,0.2)]",
  },
  DIET_PUBLISHED: {
    label: "Published ✓",
    cls: "bg-[rgba(34,197,94,0.1)] text-[#22c55e] border-[rgba(34,197,94,0.2)]",
  },
};

function DietRequestRow({
  order: initialOrder,
  onDelete,
}: {
  order: OrderWithDetails;
  onDelete?: (orderId: string) => void;
}) {
  const [order, setOrder] = useState(initialOrder);
  const [expanded, setExpanded] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dietContent, setDietContent] = useState(order.dietContent ?? "");
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isOpeningFile, setIsOpeningFile] = useState(false);
  const [showReplaceForm, setShowReplaceForm] = useState(false);

  function handleViewPublishedDiet() {
    setIsOpeningFile(true);
    startTransition(async () => {
      const res = await getAdminDietFileDownloadUrlAction(order.id);
      setIsOpeningFile(false);
      if (res.success && res.url) {
        window.open(res.url, "_blank");
      } else {
        showMsg("error", res.error ?? "Failed to get download URL for published diet plan.");
      }
    });
  }

  function handleDeleteOrder() {
    startTransition(async () => {
      const res = await deleteOrderAction(order.id);
      if (res.success) {
        if (onDelete) onDelete(order.id);
      } else {
        showMsg("error", res.error ?? "Failed to delete order.");
        setShowDeleteConfirm(false);
      }
    });
  }

  function showMsg(type: "success" | "error", text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  }

  function handleVerify() {
    startTransition(async () => {
      const res = await verifyPaymentAction(order.id);
      if (res.success) {
        setOrder((prev) => ({
          ...prev,
          status: "DIET_IN_PROGRESS",
          payment: prev.payment
            ? { ...prev.payment, status: "VERIFIED", rejectionReason: null }
            : prev.payment,
        }));
        showMsg("success", "Payment verified! Order moved to Diet In Progress.");
      } else {
        showMsg("error", res.error ?? "Failed to verify payment.");
      }
    });
  }

  function handleReject() {
    if (!rejectReason.trim()) return;
    startTransition(async () => {
      const res = await rejectPaymentAction(order.id, rejectReason);
      if (res.success) {
        setOrder((prev) => ({
          ...prev,
          status: "PAYMENT_REJECTED",
          payment: prev.payment
            ? { ...prev.payment, status: "REJECTED", rejectionReason: rejectReason }
            : prev.payment,
        }));
        setRejectReason("");
        setShowRejectForm(false);
        showMsg("success", "Payment rejected. User will be notified.");
      } else {
        showMsg("error", res.error ?? "Failed to reject.");
      }
    });
  }

  function handleSaveDraft() {
    startTransition(async () => {
      const res = await saveDietDraftAction(order.id, dietContent);
      if (res.success) {
        showMsg("success", "Diet draft saved.");
      } else {
        showMsg("error", res.error ?? "Failed to save draft.");
      }
    });
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      showMsg("error", "Only PDF files are allowed.");
      e.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showMsg("error", "File must be under 10 MB.");
      e.target.value = "";
      return;
    }

    setStagedFile(file);
  }

  function confirmUploadDietFile() {
    if (!stagedFile) return;

    const fd = new FormData();
    fd.append("orderId", order.id);
    fd.append("file", stagedFile);

    startTransition(async () => {
      const res = await uploadDietFileAction(fd);
      if (res.success) {
        setOrder((prev) => ({ ...prev, status: "DIET_PUBLISHED" }));
        setStagedFile(null);
        showMsg("success", "Diet PDF published! User can now download it.");
      } else {
        showMsg("error", res.error ?? "Upload failed. Please try again.");
      }
    });
  }

  const badge = STATUS_BADGE[order.status] ?? STATUS_BADGE["QUESTIONNAIRE_SUBMITTED"];
  const q = order.questionnaire;

  return (
    <div
      className="rounded-2xl overflow-hidden mb-4 transition-all"
      style={{ background: "#141414", border: "1px solid #1e1e1e" }}
    >
      {/* Row header */}
      <div
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-white font-semibold text-sm">
              {order.user.email}
            </span>
            {q && (
              <span className="text-[#5a5a5a] text-xs">
                {enumToLabel(q.fitnessGoal)} · {enumToLabel(q.foodPreference)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {order.payment?.utrNumber && (
              <span className="text-[#3a3a3a] text-xs font-mono">
                UTR: {order.payment.utrNumber}
              </span>
            )}
            <span className="text-[#3a3a3a] text-xs">{formatDate(order.createdAt)}</span>
          </div>
        </div>

        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${badge.cls}`}
        >
          {badge.label}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteConfirm((v) => !v);
          }}
          className="btn-ghost p-1.5 text-[#5a5a5a] hover:text-[#c41e3a] hover:bg-[rgba(196,30,58,0.1)] transition-colors flex-shrink-0 rounded-lg"
          title="Delete Order"
        >
          <Trash2 size={15} />
        </button>
        {expanded ? (
          <ChevronUp size={16} className="text-[#5a5a5a] flex-shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-[#5a5a5a] flex-shrink-0" />
        )}
      </div>

      {/* Delete confirmation banner */}
      {showDeleteConfirm && (
        <div className="bg-[rgba(196,30,58,0.08)] border-t border-b border-[rgba(196,30,58,0.2)] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#c41e3a] text-xs font-medium">
            <AlertCircle size={15} />
            <span>Are you sure you want to delete this order permanently?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="btn-ghost py-1 px-3 text-xs"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteOrder}
              disabled={isPending}
              className="btn-primary py-1 px-3 text-xs bg-[#c41e3a] hover:bg-[#a0182e] justify-center"
            >
              {isPending ? <Loader2 size={13} className="animate-spin" /> : "Yes, Delete Order"}
            </button>
          </div>
        </div>
      )}

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-[#1e1e1e] p-5 space-y-6">
          {/* Toast */}
          {msg && (
            <div
              className={`flex items-center gap-2 p-3 rounded-xl text-sm border ${
                msg.type === "success"
                  ? "bg-[rgba(34,197,94,0.08)] text-[#22c55e] border-[rgba(34,197,94,0.2)]"
                  : "bg-[rgba(196,30,58,0.08)] text-[#c41e3a] border-[rgba(196,30,58,0.2)]"
              }`}
            >
              {msg.type === "success" ? (
                <CheckCircle size={15} />
              ) : (
                <AlertCircle size={15} />
              )}
              {msg.text}
            </div>
          )}

          {/* Payment info */}
          {order.payment && (
            <div>
              <p className="text-[#a0a0a0] text-xs font-medium uppercase tracking-wide mb-3">
                Payment Details
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-[#0e0e0e] rounded-xl p-3">
                  <p className="text-[#5a5a5a] text-xs mb-1">UTR Number</p>
                  <p className="text-white text-sm font-mono">{order.payment.utrNumber}</p>
                </div>
                <div className="bg-[#0e0e0e] rounded-xl p-3">
                  <p className="text-[#5a5a5a] text-xs mb-1">Amount</p>
                  <p className="text-white text-sm font-bold">
                    ₹{order.payment.amountInPaise / 100}
                  </p>
                </div>
                <div className="bg-[#0e0e0e] rounded-xl p-3">
                  <p className="text-[#5a5a5a] text-xs mb-1">Submitted</p>
                  <p className="text-white text-sm">{formatDate(order.payment.createdAt)}</p>
                </div>
              </div>
              {order.payment.screenshotPath && (
                <a
                  href={`https://qbzwviwzrswmmuwiommn.supabase.co/storage/v1/object/public/payment-screenshots/${order.payment.screenshotPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-xs text-[#3b82f6] hover:underline"
                >
                  <FileText size={13} />
                  View Payment Screenshot
                </a>
              )}
              {order.payment.rejectionReason && (
                <div className="mt-3 p-3 rounded-xl bg-[rgba(196,30,58,0.06)] border border-[rgba(196,30,58,0.2)]">
                  <p className="text-[#c41e3a] text-xs font-semibold mb-1">Rejection Reason</p>
                  <p className="text-[#a0a0a0] text-xs">{order.payment.rejectionReason}</p>
                </div>
              )}
            </div>
          )}

          {/* Questionnaire summary */}
          {q && (
            <div>
              <p className="text-[#a0a0a0] text-xs font-medium uppercase tracking-wide mb-3">
                Questionnaire
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {[
                  ["Name", q.name],
                  ["Age", `${q.age} yrs`],
                  ["Gender", enumToLabel(q.gender)],
                  ["Height", `${q.heightCm} cm`],
                  ["Weight", `${q.weightKg} kg`],
                  ["City", `${q.city}, ${q.state}`],
                  ["Goal", enumToLabel(q.fitnessGoal)],
                  ["Food Pref", enumToLabel(q.foodPreference)],
                  ["Exercise", enumToLabel(q.exercise)],
                  ["Work Type", enumToLabel(q.workType)],
                  ["Wake Up", q.wakeUpTime],
                  ["Sleep", q.sleepTime],
                ].map(([label, val]) => (
                  <div key={label} className="bg-[#0e0e0e] rounded-xl p-3">
                    <p className="text-[#5a5a5a] text-[10px] mb-0.5 uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-white font-medium">{val}</p>
                  </div>
                ))}
              </div>

              {/* Multi-select arrays */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  ["Staple Foods", q.stapleFoods],
                  ["Protein Sources", q.proteinSources],
                  ["Vegetables", q.vegetables],
                  ["Fruits", q.fruits],
                  ["Drinks", q.drinks],
                  ["Medical Conditions", q.medicalConditions],
                ].map(([label, items]) => (
                  <div key={label as string} className="bg-[#0e0e0e] rounded-xl p-3">
                    <p className="text-[#5a5a5a] text-[10px] mb-2 uppercase tracking-wide">
                      {label as string}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(items as string[]).length > 0 ? (
                        (items as string[]).map((item) => (
                          <span
                            key={item}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#a0a0a0]"
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#3a3a3a] text-[10px]">None selected</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Free text fields */}
              {[
                ["Allergies", q.allergies],
                ["Favourite Foods", q.favouriteFoods],
                ["Hated Foods", q.hatedFoods],
                ["Additional Notes", q.additionalNotes],
              ]
                .filter(([, val]) => val)
                .map(([label, val]) => (
                  <div key={label as string} className="mt-3 bg-[#0e0e0e] rounded-xl p-3">
                    <p className="text-[#5a5a5a] text-[10px] mb-1 uppercase tracking-wide">
                      {label as string}
                    </p>
                    <p className="text-[#a0a0a0] text-xs">{val}</p>
                  </div>
                ))}
            </div>
          )}

          {/* Admin Actions */}
          <div>
            <p className="text-[#a0a0a0] text-xs font-medium uppercase tracking-wide mb-3">
              Actions
            </p>

            {/* Payment verification actions */}
            {order.status === "PAYMENT_PENDING" && (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <button
                    onClick={handleVerify}
                    disabled={isPending}
                    className="btn-primary flex-1 justify-center"
                    id={`verify-${order.id}`}
                  >
                    {isPending ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <CheckCircle size={15} />
                    )}
                    Verify Payment
                  </button>
                  <button
                    onClick={() => setShowRejectForm((v) => !v)}
                    disabled={isPending}
                    className="btn-ghost flex-1 justify-center border border-[#2a2a2a] hover:border-[#c41e3a]/40 text-sm py-2.5 px-4"
                    id={`reject-toggle-${order.id}`}
                  >
                    <XCircle size={15} />
                    Reject
                  </button>
                </div>

                {showRejectForm && (
                  <div className="space-y-3">
                    <textarea
                      rows={2}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="input-base resize-none text-sm"
                    />
                    <button
                      onClick={handleReject}
                      disabled={isPending || !rejectReason.trim()}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all bg-[rgba(196,30,58,0.12)] border border-[rgba(196,30,58,0.3)] text-[#c41e3a] hover:bg-[rgba(196,30,58,0.2)] disabled:opacity-50"
                      id={`confirm-reject-${order.id}`}
                    >
                      Confirm Rejection
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Diet creation actions */}
            {(order.status === "DIET_IN_PROGRESS" ||
              order.status === "PAYMENT_VERIFIED") && (
              <div className="space-y-4">
                <div>
                  <label className="form-label">Diet Notes / Content (saved as draft)</label>
                  <textarea
                    rows={6}
                    value={dietContent}
                    onChange={(e) => setDietContent(e.target.value)}
                    className="input-base resize-none mt-2"
                  />
                  <button
                    onClick={handleSaveDraft}
                    disabled={isPending}
                    className="btn-ghost border border-[#2a2a2a] text-sm py-2 px-4 mt-2"
                    id={`save-draft-${order.id}`}
                  >
                    {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Draft
                  </button>
                </div>

                <div>
                  <label className="form-label mb-2 block">Upload Diet PDF to Publish</label>

                  {!stagedFile ? (
                    <>
                      <label
                        htmlFor={`pdf-upload-${order.id}`}
                        className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-[#2a2a2a] hover:border-[#c41e3a]/40 cursor-pointer transition-colors"
                      >
                        <Upload size={18} className="text-[#5a5a5a]" />
                        <div>
                          <p className="text-white text-sm font-medium">Select PDF File</p>
                          <p className="text-[#5a5a5a] text-xs">
                            Max 10 MB · Requires confirmation before publishing
                          </p>
                        </div>
                      </label>
                      <input
                        id={`pdf-upload-${order.id}`}
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#1a0509] border border-[rgba(196,30,58,0.3)] space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-semibold text-sm flex items-center gap-2">
                            <FileText size={16} className="text-[#c41e3a]" />
                            {stagedFile.name}
                          </p>
                          <p className="text-[#a0a0a0] text-xs mt-1">
                            Size: {(stagedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[rgba(196,30,58,0.2)] text-[#c41e3a] border border-[rgba(196,30,58,0.3)]">
                          Awaiting Confirmation
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-[#0e0e0e] border border-[#2a2a2a] text-xs space-y-1">
                        <p className="text-[#a0a0a0]">
                          Recipient: <span className="text-white font-semibold">{order.user.name ?? order.user.email}</span> ({order.user.email})
                        </p>
                        <p className="text-[#a0a0a0]">
                          Order ID: <span className="font-mono text-white">{order.id}</span>
                        </p>
                        <p className="text-[#f59e0b] font-medium text-[11px] mt-1">
                          ⚠️ Please confirm that this PDF is intended for this user before publishing.
                        </p>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={confirmUploadDietFile}
                          disabled={isPending}
                          className="btn-primary flex-1 justify-center text-xs py-2.5"
                          id={`confirm-pdf-upload-${order.id}`}
                        >
                          {isPending ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle size={14} />
                          )}
                          {isPending ? "Publishing…" : "Confirm & Publish Diet Plan"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setStagedFile(null)}
                          disabled={isPending}
                          className="btn-ghost border border-[#2a2a2a] text-xs py-2.5 px-3 text-[#a0a0a0] hover:text-white"
                          id={`cancel-pdf-upload-${order.id}`}
                        >
                          Cancel / Change File
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {order.status === "DIET_PUBLISHED" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[rgba(34,197,94,0.06)] border border-[rgba(34,197,94,0.2)] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-[#22c55e] font-semibold text-sm">
                        <CheckCircle size={16} />
                        Diet Plan Published
                      </div>
                      {order.dietFile && (
                        <p className="text-[#a0a0a0] text-xs mt-1">
                          File: <span className="text-white font-mono">{order.dietFile.originalFileName}</span>
                          {order.dietFile.uploadedAt && (
                            <> · Published: {formatDate(order.dietFile.uploadedAt)}</>
                          )}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {order.dietFile && (
                        <button
                          type="button"
                          onClick={handleViewPublishedDiet}
                          disabled={isOpeningFile || isPending}
                          className="btn-primary py-2 px-3 text-xs bg-[#22c55e] hover:bg-[#16a34a] justify-center"
                          id={`view-published-pdf-${order.id}`}
                        >
                          {isOpeningFile ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <ExternalLink size={13} />
                          )}
                          View / Open Published PDF
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowReplaceForm((v) => !v)}
                        disabled={isPending}
                        className="btn-ghost border border-[#2a2a2a] text-xs py-2 px-3 text-[#a0a0a0] hover:text-white"
                        id={`toggle-replace-pdf-${order.id}`}
                      >
                        {showReplaceForm ? "Cancel Replace" : "Replace PDF"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Optional Replace PDF form */}
                {showReplaceForm && (
                  <div className="p-4 rounded-xl bg-[#141414] border border-[#2a2a2a] space-y-3">
                    <p className="text-white text-xs font-semibold">Upload Replacement PDF Plan</p>
                    {!stagedFile ? (
                      <>
                        <label
                          htmlFor={`pdf-replace-${order.id}`}
                          className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-[#2a2a2a] hover:border-[#c41e3a]/40 cursor-pointer transition-colors"
                        >
                          <Upload size={18} className="text-[#5a5a5a]" />
                          <div>
                            <p className="text-white text-sm font-medium">Select Replacement PDF File</p>
                            <p className="text-[#5a5a5a] text-xs">Max 10 MB · Replaces current published PDF</p>
                          </div>
                        </label>
                        <input
                          id={`pdf-replace-${order.id}`}
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </>
                    ) : (
                      <div className="p-3 rounded-xl bg-[#1a0509] border border-[rgba(196,30,58,0.3)] space-y-3">
                        <p className="text-white text-xs font-semibold">{stagedFile.name}</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={confirmUploadDietFile}
                            disabled={isPending}
                            className="btn-primary py-2 px-3 text-xs justify-center"
                          >
                            {isPending ? <Loader2 size={13} className="animate-spin" /> : "Confirm Replace"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setStagedFile(null)}
                            disabled={isPending}
                            className="btn-ghost border border-[#2a2a2a] text-xs py-2 px-3 text-[#a0a0a0]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Draft / Notes section */}
                <div>
                  <label className="form-label">Diet Notes / Draft Content given to user</label>
                  <textarea
                    rows={4}
                    value={dietContent}
                    onChange={(e) => setDietContent(e.target.value)}
                    className="input-base resize-none mt-2 text-xs"
                    placeholder="No draft text content entered."
                  />
                  <button
                    onClick={handleSaveDraft}
                    disabled={isPending}
                    className="btn-ghost border border-[#2a2a2a] text-xs py-1.5 px-3 mt-2"
                    id={`save-published-draft-${order.id}`}
                  >
                    {isPending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    Save Updated Notes
                  </button>
                </div>
              </div>
            )}

            {order.status === "QUESTIONNAIRE_SUBMITTED" && (
              <div className="flex items-center gap-2 text-[#5a5a5a] text-sm">
                <Clock size={16} />
                Waiting for user to complete payment.
              </div>
            )}

            {order.status === "PAYMENT_REJECTED" && (
              <div className="flex items-center gap-2 text-[#c41e3a] text-sm">
                <XCircle size={16} />
                Payment rejected — waiting for user to resubmit.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function DietRequestsTable({ orders: initialOrders }: { orders: OrderWithDetails[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<string>("ALL");

  const filters = [
    { key: "ALL", label: "All" },
    { key: "PAYMENT_PENDING", label: "Needs Verification" },
    { key: "DIET_IN_PROGRESS", label: "Creating Diet" },
    { key: "DIET_PUBLISHED", label: "Published" },
    { key: "PAYMENT_REJECTED", label: "Rejected" },
  ];

  const filtered =
    filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  function handleOrderDeleted(deletedId: string) {
    setOrders((prev) => prev.filter((o) => o.id !== deletedId));
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-xs font-medium px-4 py-2 rounded-full border whitespace-nowrap transition-all flex-shrink-0 ${
              filter === f.key
                ? "bg-[#c41e3a] border-[#c41e3a] text-white"
                : "bg-[#141414] border-[#2a2a2a] text-[#5a5a5a] hover:border-[#3a3a3a] hover:text-[#a0a0a0]"
            }`}
          >
            {f.label}
            {f.key !== "ALL" && (
              <span className="ml-1.5 opacity-70">
                ({orders.filter((o) => o.status === f.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-[#5a5a5a] text-sm">No orders in this category.</p>
        </div>
      ) : (
        <div>
          {filtered.map((order) => (
            <DietRequestRow key={order.id} order={order} onDelete={handleOrderDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
