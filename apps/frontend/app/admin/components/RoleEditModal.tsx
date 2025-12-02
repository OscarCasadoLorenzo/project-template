"use client";

import { UserRole } from "@/contexts/AuthContext";
import { Shield, X } from "lucide-react";
import { useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface RoleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateRole: (userId: string, newRole: UserRole) => Promise<void>;
}

export function RoleEditModal({
  isOpen,
  onClose,
  user,
  onUpdateRole,
}: RoleEditModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const roles: UserRole[] = ["PLAYER", "MASTER", "ADMIN"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedRole === user.role) {
      onClose();
      return;
    }

    try {
      setIsSubmitting(true);
      await onUpdateRole(user.id, selectedRole);
      onClose();
    } catch (err) {
      setError("Failed to update user role. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "Full system access including user management";
      case "MASTER":
        return "Can manage advanced features and view all data";
      case "PLAYER":
        return "Can manage their own characters only";
    }
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 border-red-200";
      case "MASTER":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "PLAYER":
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Edit User Role
            </h3>
            <button
              onClick={onClose}
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 py-4">
              {/* User Info */}
              <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-xs font-medium text-gray-500">
                    Current Role:
                  </span>
                  <span
                    className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeClass(user.role)}`}
                  >
                    <Shield className="mr-1 h-3 w-3" />
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Select New Role
                </label>
                {roles.map((role) => (
                  <div
                    key={role}
                    className={`relative flex cursor-pointer rounded-lg border p-4 hover:bg-gray-50 ${
                      selectedRole === role
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                        : "border-gray-200"
                    }`}
                    onClick={() => setSelectedRole(role)}
                  >
                    <div className="flex w-full items-start">
                      <div className="flex h-5 items-center">
                        <input
                          type="radio"
                          name="role"
                          value={role}
                          checked={selectedRole === role}
                          onChange={(e) =>
                            setSelectedRole(e.target.value as UserRole)
                          }
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-900">
                            {role}
                          </label>
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeClass(role)}`}
                          >
                            <Shield className="mr-1 h-3 w-3" />
                            {role}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {getRoleDescription(role)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 rounded-md bg-red-50 p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Warning Message */}
              {selectedRole !== user.role && (
                <div className="mt-4 rounded-md bg-yellow-50 p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Warning:</strong> Changing this user's role will
                    immediately affect their access permissions.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSubmitting || selectedRole === user.role}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
              >
                {isSubmitting ? "Updating..." : "Update Role"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
