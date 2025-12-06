"use client";

import { LoadingSpinner } from "@/components/loading-spinner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { RoleEditModal } from "./components/RoleEditModal";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<UsersResponse["meta"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user: currentUser } = useAuth();
  const t = useTranslations();

  const fetchUsers = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const response = await fetchApi<UsersResponse>(
        `/users?page=${page}&limit=20`,
      );
      setUsers(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    try {
      await fetchApi(`/users/${userId}/role`, {
        method: "PATCH",
        body: { role: newRole },
      });

      // Refresh users list
      await fetchUsers(currentPage);
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to update role:", error);
      throw error;
    }
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeRoleModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "MASTER":
        return "bg-purple-100 text-purple-800";
      case "PLAYER":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {t("admin.title")}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {t("admin.description")}
            </p>
          </div>

          {/* User Count Stats */}
          {meta && (
            <div className="mb-6 rounded-lg bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Total Users: {meta.total}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {t("admin.page")} {meta.page} {t("admin.of")}{" "}
                  {meta.totalPages}
                </div>
              </div>
            </div>
          )}

          {/* Users Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t("admin.name")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t("admin.email")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t("admin.role")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t("admin.createdAt")}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      {t("admin.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            {currentUser?.id === user.id && (
                              <div className="text-xs text-gray-500">(You)</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeClass(user.role)}`}
                        >
                          <Shield className="mr-1 h-3 w-3" />
                          {user.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => openRoleModal(user)}
                          disabled={currentUser?.id === user.id}
                          className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          Edit Role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage((p) =>
                            Math.min(meta.totalPages, p + 1),
                          )
                        }
                        disabled={currentPage === meta.totalPages}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing{" "}
                          <span className="font-medium">
                            {(currentPage - 1) * meta.limit + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {Math.min(currentPage * meta.limit, meta.total)}
                          </span>{" "}
                          of <span className="font-medium">{meta.total}</span>{" "}
                          results
                        </p>
                      </div>
                      <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                          <button
                            onClick={() =>
                              setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                            {currentPage}
                          </span>
                          <button
                            onClick={() =>
                              setCurrentPage((p) =>
                                Math.min(meta.totalPages, p + 1),
                              )
                            }
                            disabled={currentPage === meta.totalPages}
                            className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!loading && users.length === 0 && (
            <div className="rounded-lg bg-white py-12 text-center shadow">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No users found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                There are no registered users in the system.
              </p>
            </div>
          )}
        </div>

        {/* Role Edit Modal */}
        {selectedUser && (
          <RoleEditModal
            isOpen={isModalOpen}
            onClose={closeRoleModal}
            user={selectedUser}
            onUpdateRole={handleRoleUpdate}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
