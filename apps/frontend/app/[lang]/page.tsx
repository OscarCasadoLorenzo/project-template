"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";

export default function Home() {
  const { user } = useAuth();
  const t = useTranslations();

  return (
    <ProtectedRoute>
      <div className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {t("common.welcome")}, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome to the Project Template. Use the navigation to get started.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
