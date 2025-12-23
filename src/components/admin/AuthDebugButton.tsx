import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { clearClientAuthStorage, getEmailConfirmedAt } from "@/lib/auth";

export default function AuthDebugButton() {
  const { toast } = useToast();

  const handleClearAndReload = () => {
    clearClientAuthStorage();
    toast({
      title: "Cleared client token",
      description: "Local token removed. Reloading...",
    });
    setTimeout(() => location.reload(), 250);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out", description: "Supabase session cleared." });
  };

  const handleCheckConfirmed = async () => {
    const confirmedAt = await getEmailConfirmedAt();
    toast({ title: "email_confirmed_at", description: String(confirmedAt) });
    // also log to console for easier debugging
    console.log("email_confirmed_at", confirmedAt);
  };

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="ghost" onClick={handleCheckConfirmed}>
        Check Confirmed
      </Button>
      <Button size="sm" variant="secondary" onClick={handleSignOut}>
        Sign Out
      </Button>
      <Button size="sm" variant="destructive" onClick={handleClearAndReload}>
        Clear Token
      </Button>
    </div>
  );
}
