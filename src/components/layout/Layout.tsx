import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen-dvh mobile-safe">
      {/* Header with safe area support */}
      <Navbar />

      {/* Main content - grows to fill available space */}
      <main className="flex-1 w-full overflow-x-hidden pt-safe">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp button - safe area aware */}
      <WhatsAppButton />
    </div>
  );
}
