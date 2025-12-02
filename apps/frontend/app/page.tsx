"use client";

// CharacterList removed from home to keep template generic
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to the Project Template. Use the navigation to get started.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
