import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Settings,
  Users,
  MessageSquare,
  Clock,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Briefcase,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { clearUserInfo } from "@/lib/auth";
import AdminPasswordModal from "@/components/AdminPasswordModal";
import BookingsManagement from "@/components/admin/BookingsManagement";
import AvailabilityManagement from "@/components/admin/AvailabilityManagement";
import MessagesManagement from "@/components/admin/MessagesManagement";
import ServicesManagement from "@/components/admin/ServicesManagement";
import SettingsManagement from "@/components/admin/SettingsManagement";
import ClientsManagement from "@/components/admin/ClientsManagement";
import AuthDebugButton from "@/components/admin/AuthDebugButton";
import UsersManagement from "@/components/admin/UsersManagement";

type TabType =
  | "dashboard"
  | "bookings"
  | "clients"
  | "users"
  | "services"
  | "messages"
  | "availability"
  | "settings";

const sidebarItems = [
  { id: "dashboard" as TabType, label: "Dashboard", icon: LayoutDashboard },
  { id: "bookings" as TabType, label: "Bookings", icon: Calendar },
  { id: "clients" as TabType, label: "Clients", icon: UserCircle },
  { id: "users" as TabType, label: "Users", icon: Users },
  { id: "services" as TabType, label: "Services", icon: Briefcase },
  { id: "messages" as TabType, label: "Messages", icon: MessageSquare },
  { id: "availability" as TabType, label: "Availability", icon: Clock },
  { id: "settings" as TabType, label: "Settings", icon: Settings },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if already authenticated in this session
    const isAuth = sessionStorage.getItem("admin_authenticated") === "true";
    if (!isAuth) {
      setIsPasswordModalOpen(true);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    clearUserInfo();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminPasswordModal
        isOpen={isPasswordModalOpen}
        onUnlock={() => setIsAuthenticated(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-xl font-semibold">Admin Panel</h1>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-muted rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {activeTab === item.id && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Log Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-muted rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="font-serif text-2xl font-medium capitalize">
                {activeTab}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <AuthDebugButton />
              <a
                href="/"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                View Website →
              </a>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6">
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "bookings" && <BookingsContent />}
          {activeTab === "clients" && <ClientsContent />}
          {activeTab === "users" && <UsersContent />}
          {activeTab === "services" && <ServicesContent />}
          {activeTab === "messages" && <MessagesContent />}
          {activeTab === "availability" && <AvailabilityContent />}
          {activeTab === "settings" && <SettingsContent />}
        </div>
      </main>
    </div>
  );
}

// Dashboard Content
function DashboardContent() {
  const stats = [
    {
      label: "Pending Bookings",
      value: "3",
      icon: Calendar,
      color: "bg-primary-light text-primary",
    },
    {
      label: "New Messages",
      value: "5",
      icon: MessageSquare,
      color: "bg-rose-light text-rose-dark",
    },
    {
      label: "This Week",
      value: "12",
      icon: Users,
      color: "bg-sage-light text-sage-dark",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={stat.label} className="card-luxury">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-serif font-medium">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-luxury">
        <h3 className="font-serif text-xl font-medium mb-4">
          Welcome to Your Dashboard
        </h3>
        <p className="text-muted-foreground">
          This is your admin panel where you can manage bookings, services,
          messages, and settings. Use the sidebar to navigate between different
          sections.
        </p>
      </div>
    </motion.div>
  );
}

// Bookings Content
function BookingsContent() {
  return <BookingsManagement />;
}

// Clients Content
function ClientsContent() {
  return <ClientsManagement />;
}

// Services Content
function ServicesContent() {
  return <ServicesManagement />;
}

// Users Content
function UsersContent() {
  return <UsersManagement />;
}

// Messages Content
function MessagesContent() {
  return <MessagesManagement />;
}

// Availability Content
function AvailabilityContent() {
  return <AvailabilityManagement />;
}

// Settings Content
function SettingsContent() {
  return <SettingsManagement />;
}
