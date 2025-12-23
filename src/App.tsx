import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Preload critical routes
import Index from "./pages/Index";
import Auth from "./pages/Auth";

// Lazy-loaded routes for code splitting
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Booking = lazy(() => import("./pages/Booking"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const DebugAuth = lazy(() => import("./pages/DebugAuth"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen-dvh flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Critical routes - loaded immediately */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />

            {/* Lazy-loaded routes */}
            <Route
              path="/about"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <About />
                </Suspense>
              }
            />
            <Route
              path="/services"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Services />
                </Suspense>
              }
            />
            <Route
              path="/booking"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Booking />
                </Suspense>
              }
            />
            <Route
              path="/contact"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Contact />
                </Suspense>
              }
            />
            <Route
              path="/profile"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <UserProfile />
                </Suspense>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <UserDashboard />
                </Suspense>
              }
            />
            <Route
              path="/admin"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Admin />
                </Suspense>
              }
            />
            <Route
              path="/debug-auth"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <DebugAuth />
                </Suspense>
              }
            />

            {/* Catch-all route */}
            <Route
              path="*"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <NotFound />
                </Suspense>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
