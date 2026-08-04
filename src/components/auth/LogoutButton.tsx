"use client";

import { useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { signOutAction } from "@/actions/auth";

interface LogoutButtonProps {
  className?: string;
  showLabel?: boolean;
}

export function LogoutButton({
  className = "btn-ghost text-sm py-1.5 px-3 text-[#5a5a5a]",
  showLabel = true,
}: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await signOutAction();
    });
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      className={className}
      id="dashboard-logout"
    >
      {isPending ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <LogOut size={15} />
      )}
      {showLabel && (
        <span className="hidden sm:inline">
          {isPending ? "Signing out…" : "Logout"}
        </span>
      )}
    </button>
  );
}
