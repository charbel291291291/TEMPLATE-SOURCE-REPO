import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, User, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Client | null>(null);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setIsLoading(false);
    // Frontend-only: In a real app, this would fetch from backend
    // For now, show empty state
    setUsers([]);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      // Frontend-only: Remove user from local list
      setUsers(users.filter((u) => u.id !== selectedUser.id));

      toast({ title: "User deleted successfully" });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error deleting user",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-6">
        <div>
          <h3 className="font-serif text-xl font-medium">Users Management</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {users.length} user{users.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      {/* Users List */}
      {users.length === 0 ? (
        <div className="card-luxury text-center py-12">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">No users yet</h3>
          <p className="text-muted-foreground text-sm">
            Users will appear here when they sign up
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <div key={user.id} className="card-luxury">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-medium">
                        {user.full_name || "No Name"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {user.status === "active" && (
                          <span className="inline-block px-2 py-0.5 bg-green-light text-green-dark text-xs rounded-full font-medium">
                            Active
                          </span>
                        )}
                        {user.status === "inactive" && (
                          <span className="inline-block px-2 py-0.5 bg-yellow-light text-yellow-dark text-xs rounded-full font-medium">
                            Inactive
                          </span>
                        )}
                        {user.status === "archived" && (
                          <span className="inline-block px-2 py-0.5 bg-gray-light text-gray-dark text-xs rounded-full font-medium">
                            Archived
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {user.phone}
                      </div>
                    )}
                  </div>

                  {user.notes && (
                    <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Notes:</strong> {user.notes}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
                    {user.date_of_birth && (
                      <div>
                        <strong>DOB:</strong>{" "}
                        {new Date(user.date_of_birth).toLocaleDateString()}
                      </div>
                    )}
                    {user.referral_source && (
                      <div>
                        <strong>Referral:</strong> {user.referral_source}
                      </div>
                    )}
                    <div>
                      <strong>Joined:</strong>{" "}
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(user);
                    setIsDeleteDialogOpen(true);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedUser?.full_name}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
