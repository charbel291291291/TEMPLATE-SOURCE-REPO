import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

type Booking = Database["public"]["Tables"]["bookings"]["Row"] & {
  services?: { title: string } | null;
};
type BookingStatus = Database["public"]["Enums"]["booking_status"];

const statusConfig: Record<BookingStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle },
  completed: { label: "Completed", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
  canceled: { label: "Canceled", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
  no_show: { label: "No Show", color: "bg-gray-100 text-gray-800 border-gray-200", icon: AlertCircle },
};

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchQuery, statusFilter, dateFilter]);

  const fetchBookings = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        services:service_id (title)
      `)
      .order("start_datetime", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching bookings",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setBookings(data || []);
    }
    setIsLoading(false);
  };

  const filterBookings = () => {
    let result = [...bookings];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.client_name.toLowerCase().includes(query) ||
          b.client_email.toLowerCase().includes(query) ||
          b.client_phone?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    // Date filter
    const now = new Date();
    if (dateFilter === "today") {
      const today = format(now, "yyyy-MM-dd");
      result = result.filter((b) => format(new Date(b.start_datetime), "yyyy-MM-dd") === today);
    } else if (dateFilter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter((b) => new Date(b.start_datetime) >= weekAgo);
    } else if (dateFilter === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      result = result.filter((b) => new Date(b.start_datetime) >= monthAgo);
    } else if (dateFilter === "upcoming") {
      result = result.filter((b) => new Date(b.start_datetime) >= now);
    }

    setFilteredBookings(result);
  };

  const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", bookingId);

    if (error) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Status updated",
        description: `Booking marked as ${statusConfig[newStatus].label}`,
      });
      fetchBookings();
    }
  };

  const saveAdminNotes = async () => {
    if (!selectedBooking) return;
    setIsSaving(true);

    const { error } = await supabase
      .from("bookings")
      .update({ admin_notes: adminNotes })
      .eq("id", selectedBooking.id);

    if (error) {
      toast({
        title: "Error saving notes",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Notes saved",
        description: "Admin notes have been updated",
      });
      setIsNotesOpen(false);
      fetchBookings();
    }
    setIsSaving(false);
  };

  const openBookingDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const openNotesDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setAdminNotes(booking.admin_notes || "");
    setIsNotesOpen(true);
  };

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
            <h3 className="font-serif text-xl font-medium">Bookings Management</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredBookings.length} booking{filteredBookings.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <Button onClick={fetchBookings} variant="outline" size="sm">
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
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
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card-luxury overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-pulse text-muted-foreground">Loading bookings...</div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => {
                  const status = booking.status || "pending";
                  const StatusIcon = statusConfig[status].icon;
                  return (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.client_name}</p>
                          <p className="text-sm text-muted-foreground">{booking.client_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {booking.services?.title || "General Session"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {format(new Date(booking.start_datetime), "MMM d, yyyy")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(booking.start_datetime), "h:mm a")} -{" "}
                            {format(new Date(booking.end_datetime), "h:mm a")}
                          </p>
                        </div>
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
                      <TableCell>
                        {booking.admin_notes ? (
                          <span className="text-sm text-muted-foreground line-clamp-1 max-w-[150px]">
                            {booking.admin_notes}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground/50">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openBookingDetail(booking)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openNotesDialog(booking)}>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Add Notes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => updateBookingStatus(booking.id, "confirmed")}
                              disabled={status === "confirmed"}
                            >
                              <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                              Mark Confirmed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateBookingStatus(booking.id, "completed")}
                              disabled={status === "completed"}
                            >
                              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                              Mark Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateBookingStatus(booking.id, "canceled")}
                              disabled={status === "canceled"}
                            >
                              <XCircle className="w-4 h-4 mr-2 text-red-600" />
                              Mark Canceled
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateBookingStatus(booking.id, "no_show")}
                              disabled={status === "no_show"}
                            >
                              <AlertCircle className="w-4 h-4 mr-2 text-gray-600" />
                              Mark No Show
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

      {/* Booking Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Client Name</p>
                  <p className="font-medium">{selectedBooking.client_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant="outline"
                    className={statusConfig[selectedBooking.status || "pending"].color}
                  >
                    {statusConfig[selectedBooking.status || "pending"].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedBooking.client_email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedBooking.client_phone || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedBooking.start_datetime), "MMMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">
                    {format(new Date(selectedBooking.start_datetime), "h:mm a")} -{" "}
                    {format(new Date(selectedBooking.end_datetime), "h:mm a")}
                  </p>
                </div>
              </div>
              {selectedBooking.note && (
                <div>
                  <p className="text-sm text-muted-foreground">Client Note</p>
                  <p className="mt-1 p-3 bg-muted rounded-lg text-sm">{selectedBooking.note}</p>
                </div>
              )}
              {selectedBooking.admin_notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Admin Notes</p>
                  <p className="mt-1 p-3 bg-sage-light rounded-lg text-sm">
                    {selectedBooking.admin_notes}
                  </p>
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Created: {format(new Date(selectedBooking.created_at), "MMM d, yyyy 'at' h:mm a")}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsDetailOpen(false);
                if (selectedBooking) openNotesDialog(selectedBooking);
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Add Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Notes Dialog */}
      <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Admin Notes</DialogTitle>
            <DialogDescription>
              Add private notes for this booking. Only visible to admins.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter notes about this booking..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={5}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotesOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveAdminNotes} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Notes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
