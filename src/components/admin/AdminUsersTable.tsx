"use client";

import { useState, useTransition } from "react";
import {
  Users,
  Search,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Shield,
  User,
  ShoppingBag,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { updateUserAction, deleteUserAction } from "@/actions/admin";
import type { AdminUserItem } from "@/types";

interface Props {
  users: AdminUserItem[];
}

export function AdminUsersTable({ users: initialUsers }: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<AdminUserItem | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUserItem | null>(null);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<"USER" | "ADMIN">("USER");

  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function showMsg(type: "success" | "error", text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  }

  const filteredUsers = users.filter((u) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return (
      u.email.toLowerCase().includes(query) ||
      (u.name && u.name.toLowerCase().includes(query)) ||
      u.role.toLowerCase().includes(query)
    );
  });

  function openEditModal(user: AdminUserItem) {
    setEditingUser(user);
    setEditName(user.name ?? "");
    setEditEmail(user.email);
    setEditRole(user.role);
  }

  function handleSaveUser() {
    if (!editingUser) return;
    startTransition(async () => {
      const res = await updateUserAction(editingUser.id, {
        name: editName,
        email: editEmail,
        role: editRole,
      });

      if (res.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? { ...u, name: editName.trim(), email: editEmail.trim().toLowerCase(), role: editRole }
              : u
          )
        );
        setEditingUser(null);
        showMsg("success", "User updated successfully.");
      } else {
        showMsg("error", res.error ?? "Failed to update user.");
      }
    });
  }

  function handleDeleteUser() {
    if (!deletingUser) return;
    startTransition(async () => {
      const res = await deleteUserAction(deletingUser.id);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
        setDeletingUser(null);
        showMsg("success", "User deleted successfully.");
      } else {
        showMsg("error", res.error ?? "Failed to delete user.");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {msg && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${msg.type === "success"
              ? "bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.2)] text-[#22c55e]"
              : "bg-[rgba(196,30,58,0.1)] border-[rgba(196,30,58,0.2)] text-[#c41e3a]"
            }`}
        >
          {msg.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{msg.text}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-5 rounded-2xl border border-[#1e1e1e]">
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Users size={20} className="text-[#c41e3a]" />
            Registered Users ({users.length})
          </h2>
          <p className="text-[#5a5a5a] text-xs mt-0.5">
            Manage user accounts, roles, and access.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a5a] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="input-base !pl-10 text-xs py-2 w-full"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-[#1e1e1e] bg-[#141414] overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-[#5a5a5a]">
            <Users size={32} className="mx-auto mb-3 text-[#3a3a3a]" />
            <p className="text-sm font-medium text-[#a0a0a0]">No users found</p>
            <p className="text-xs mt-1">Try adjusting your search filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#1e1e1e] bg-[#0c0c0c] text-[#a0a0a0] text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-5">User</th>
                  <th className="py-3.5 px-5">Role</th>
                  <th className="py-3.5 px-5">Joined Date</th>
                  <th className="py-3.5 px-5">Orders</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e1e]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#181818] transition-colors">
                    {/* User Info */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1a0509] border border-[#3a0a14] flex items-center justify-center text-[#c41e3a] font-bold text-sm flex-shrink-0">
                          {user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {user.name || "Unnamed User"}
                          </p>
                          <p className="text-[#5a5a5a] text-xs font-mono">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${user.role === "ADMIN"
                            ? "bg-[rgba(196,30,58,0.1)] text-[#c41e3a] border-[rgba(196,30,58,0.3)]"
                            : "bg-[rgba(160,160,160,0.1)] text-[#a0a0a0] border-[rgba(160,160,160,0.2)]"
                          }`}
                      >
                        {user.role === "ADMIN" && <Shield size={12} />}
                        {user.role}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 text-[#a0a0a0] text-xs">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Orders count */}
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#a0a0a0] bg-[#1c1c1c] px-2.5 py-1 rounded-lg border border-[#2a2a2a]">
                        <ShoppingBag size={13} className="text-[#5a5a5a]" />
                        {user._count.orders} order(s)
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(user)}
                          className="btn-ghost p-2 text-[#a0a0a0] hover:text-white hover:bg-[#262626]"
                          title="Edit User"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingUser(user)}
                          disabled={user.role === "ADMIN"}
                          className={`btn-ghost p-2 ${user.role === "ADMIN"
                              ? "opacity-30 cursor-not-allowed text-[#5a5a5a]"
                              : "text-[#5a5a5a] hover:text-[#c41e3a] hover:bg-[rgba(196,30,58,0.1)]"
                            }`}
                          title={user.role === "ADMIN" ? "Admin accounts cannot be deleted" : "Delete User"}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#1e1e1e]">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Edit2 size={18} className="text-[#c41e3a]" />
                Edit User
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-[#5a5a5a] hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input-base w-full"
                  disabled={isPending}
                />
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="input-base w-full"
                  disabled={isPending}
                />
              </div>

              <div>
                <label className="form-label">User Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as "USER" | "ADMIN")}
                  className="input-base w-full bg-[#181818]"
                  disabled={isPending}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e1e1e]">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="btn-ghost py-2.5 px-4 text-xs"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveUser}
                disabled={isPending}
                className="btn-primary py-2.5 px-5 text-xs justify-center"
              >
                {isPending ? <Loader2 size={15} className="animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#141414] border border-[rgba(196,30,58,0.3)] rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[rgba(196,30,58,0.1)] border border-[rgba(196,30,58,0.2)] flex items-center justify-center mx-auto text-[#c41e3a] mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Delete User Account?</h3>
            <p className="text-[#a0a0a0] text-xs leading-relaxed mb-6">
              Are you sure you want to delete <span className="text-white font-semibold">{deletingUser.email}</span>?
              This action is permanent and will remove all associated orders.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="btn-ghost w-1/2 py-2.5 text-xs justify-center"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isPending}
                className="btn-primary w-1/2 py-2.5 text-xs justify-center bg-[#c41e3a] hover:bg-[#a0182e]"
              >
                {isPending ? <Loader2 size={15} className="animate-spin" /> : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
