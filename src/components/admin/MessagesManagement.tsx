import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  MessageSquare,
  Mail,
  Phone,
  Search,
  Filter,
  MoreHorizontal,
  Reply,
  Archive,
  Trash2,
  Eye,
  Check,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];
type MessageStatus = Database["public"]["Enums"]["message_status"];

const statusConfig: Record<MessageStatus, { label: string; color: string; icon: React.ElementType }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock },
  replied: { label: "Replied", color: "bg-green-100 text-green-800 border-green-200", icon: Check },
  archived: { label: "Archived", color: "bg-gray-100 text-gray-800 border-gray-200", icon: Archive },
};

export default function MessagesManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchQuery, statusFilter]);

  const fetchMessages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching messages",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setMessages(data || []);
    }
    setIsLoading(false);
  };

  const filterMessages = () => {
    let result = [...messages];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query) ||
          m.message.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((m) => m.status === statusFilter);
    }

    setFilteredMessages(result);
  };

  const updateMessageStatus = async (messageId: string, newStatus: MessageStatus) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ status: newStatus })
      .eq("id", messageId);

    if (error) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Status updated",
        description: `Message marked as ${statusConfig[newStatus].label}`,
      });
      fetchMessages();
    }
  };

  const deleteMessage = async (messageId: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", messageId);

    if (error) {
      toast({
        title: "Error deleting message",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Message deleted" });
      fetchMessages();
    }
  };

  const openMessageDetail = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDetailOpen(true);
  };

  const newMessagesCount = messages.filter((m) => m.status === "new").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header & Filters */}
      <div className="card-luxury">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="font-serif text-xl font-medium">Messages Inbox</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredMessages.length} message{filteredMessages.length !== 1 ? "s" : ""}
              {newMessagesCount > 0 && (
                <span className="ml-2">
                  • <span className="text-blue-600 font-medium">{newMessagesCount} new</span>
                </span>
              )}
            </p>
          </div>
          <Button onClick={fetchMessages} variant="outline" size="sm">
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages Table */}
      <div className="card-luxury overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-pulse text-muted-foreground">Loading messages...</div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="py-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No messages found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message) => {
                  const status = message.status || "new";
                  const StatusIcon = statusConfig[status].icon;
                  return (
                    <TableRow
                      key={message.id}
                      className={status === "new" ? "bg-blue-50/50" : ""}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{message.name}</p>
                          <p className="text-sm text-muted-foreground">{message.email}</p>
                          {message.phone && (
                            <p className="text-sm text-muted-foreground">{message.phone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm line-clamp-2 max-w-[300px]">{message.message}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {format(new Date(message.created_at), "MMM d, yyyy")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(message.created_at), "h:mm a")}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${statusConfig[status].color} gap-1`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig[status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openMessageDetail(message)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(`mailto:${message.email}?subject=Re: Your message`)
                              }
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            {message.phone && (
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(
                                    `https://wa.me/${message.phone.replace(/\D/g, "")}`,
                                    "_blank"
                                  )
                                }
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                WhatsApp
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => updateMessageStatus(message.id, "replied")}
                              disabled={status === "replied"}
                            >
                              <Reply className="w-4 h-4 mr-2 text-green-600" />
                              Mark as Replied
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateMessageStatus(message.id, "archived")}
                              disabled={status === "archived"}
                            >
                              <Archive className="w-4 h-4 mr-2 text-gray-600" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => deleteMessage(message.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Message Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant="outline"
                    className={statusConfig[selectedMessage.status || "new"].color}
                  >
                    {statusConfig[selectedMessage.status || "new"].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedMessage.phone || "—"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Message</p>
                <p className="mt-1 p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                Received: {format(new Date(selectedMessage.created_at), "MMMM d, yyyy 'at' h:mm a")}
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Close
            </Button>
            {selectedMessage && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    window.open(`mailto:${selectedMessage.email}?subject=Re: Your message`);
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Reply via Email
                </Button>
                {selectedMessage.status !== "replied" && (
                  <Button
                    onClick={() => {
                      updateMessageStatus(selectedMessage.id, "replied");
                      setIsDetailOpen(false);
                    }}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark Replied
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
