import { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "969696";

interface AdminPasswordModalProps {
  isOpen: boolean;
  onUnlock: () => void;
}

export default function AdminPasswordModal({
  isOpen,
  onUnlock,
}: AdminPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password === ADMIN_PASSWORD) {
      // Store in sessionStorage (cleared when tab closes)
      sessionStorage.setItem("admin_authenticated", "true");
      toast({
        title: "Access granted",
        description: "Welcome to the admin panel",
      });
      onUnlock();
    } else {
      toast({
        title: "Invalid password",
        description: "Please try again",
        variant: "destructive",
      });
      setPassword("");
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-background border border-border rounded-2xl shadow-lg max-w-sm w-full"
      >
        <div className="p-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h2 className="font-serif text-xl font-medium text-center mb-2">
            Admin Access
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Enter the password to access the admin panel
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Verifying..." : "Unlock"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
