import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Calendar, User, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getUserInfo, clearUserInfo } from "@/lib/auth";
import { Layout } from "@/components/layout/Layout";

interface Booking {
  id: string;
  title: string;
  start_datetime: string;
  service?: string;
}

export default function UserDashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userInfo = getUserInfo();

    if (!userInfo.email) {
      navigate("/auth");
      return;
    }

    setUserEmail(userInfo.email);
    // In frontend-only mode, bookings would be stored in localStorage or managed separately
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    clearUserInfo();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-32 pb-20">
        <div className="container-wide">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h1 className="font-serif text-4xl font-medium mb-2">
                My Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your sessions and profile
              </p>
            </div>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="card-luxury">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-medium text-center mb-2">
                  {localStorage.getItem("user_name") || "User"}
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  {userEmail}
                </p>

                <div className="space-y-3 pt-6 border-t border-border">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{userEmail}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Member since {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div>
                <h2 className="font-serif text-2xl font-medium mb-6">
                  Your Sessions
                </h2>

                {bookings.length === 0 ? (
                  <div className="card-luxury text-center py-12">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No sessions booked yet</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Book your first session to get started
                    </p>
                    <Button asChild>
                      <a href="/booking">Book a Session</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => {
                      const startDate = new Date(booking.start_datetime);
                      const endDate = new Date(booking.end_datetime);
                      const isUpcoming = startDate > new Date();
                      const isPast = endDate < new Date();

                      return (
                        <div key={booking.id} className="card-luxury">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-serif text-lg font-medium">
                                  {booking.service?.title || "Session"}
                                </h3>
                                <span
                                  className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                    isUpcoming
                                      ? "bg-green-light text-green-dark"
                                      : isPast
                                      ? "bg-gray-light text-gray-dark"
                                      : "bg-yellow-light text-yellow-dark"
                                  }`}
                                >
                                  {isUpcoming
                                    ? "Upcoming"
                                    : isPast
                                    ? "Completed"
                                    : "In Progress"}
                                </span>
                              </div>

                              <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {startDate.toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {startDate.toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}{" "}
                                  -{" "}
                                  {endDate.toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>

                              {booking.note && (
                                <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                                  <p className="text-sm text-muted-foreground">
                                    <strong>Note:</strong> {booking.note}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="text-right">
                              <div className="text-sm font-medium text-muted-foreground">
                                Status
                              </div>
                              <div
                                className={`text-sm font-semibold capitalize mt-1 ${
                                  booking.status === "confirmed"
                                    ? "text-green-600"
                                    : booking.status === "canceled"
                                    ? "text-red-600"
                                    : "text-yellow-600"
                                }`}
                              >
                                {booking.status}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
