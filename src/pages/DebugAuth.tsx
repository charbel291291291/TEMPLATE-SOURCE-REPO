import React from "react";
import AuthDebugButton from "@/components/admin/AuthDebugButton";

export default function DebugAuth() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-xl card-luxury">
        <h1 className="font-serif text-2xl mb-4">Auth Debug</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Use these controls to debug stale sessions and email confirmation
          state.
        </p>
        <AuthDebugButton />
      </div>
    </div>
  );
}
