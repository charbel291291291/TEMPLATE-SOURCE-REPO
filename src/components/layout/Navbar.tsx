import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { clearUserInfo } from "@/lib/auth";
import site from "@/config/site.json";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const { t, dir } = useLanguage();

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.services") },
    { href: "/booking", label: t("nav.booking") },
    { href: "/contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check user auth status (frontend only)
  useEffect(() => {
    const userEmail = localStorage.getItem("user_email");
    if (userEmail) {
      setUser({ email: userEmail } as any);
    }
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clearUserInfo();
    setUser(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 pt-safe pl-safe pr-safe ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-soft py-2 sm:py-3"
            : "bg-transparent py-3 sm:py-5"
        }`}
        dir={dir}
      >
        <nav className="container-wide flex items-center justify-between">
          {/* Logo - responsive size */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="font-serif font-bold text-lg sm:text-xl md:text-2xl text-primary">
              {site.brand.name.charAt(0).toUpperCase()}
            </span>
            <span className="hidden sm:inline text-sm font-semibold text-foreground">
              {site.brand.name}
            </span>
          </Link>

          {/* Desktop Navigation - hidden on mobile */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`nav-link font-medium text-sm ${
                  location.pathname === link.href ? "nav-link-active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons & Language Switcher - hidden on mobile */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            <LanguageSwitcher />
            <Button variant="whatsapp" size="sm" asChild>
              <a
                href={`https://wa.me/${site.contact.whatsapp.replace(
                  /\D/g,
                  ""
                )}?text=Hi%2C%20I%27d%20like%20to%20book%20a%20session.`}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">{t("nav.whatsapp")}</span>
              </a>
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link to="/booking" className="touch-target">
                {t("nav.booking")}
              </Link>
            </Button>
            {user ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/profile" className="touch-target">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/auth" className="touch-target">
                  Sign In
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button & Language Switcher */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground touch-target"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu - properly positioned below header */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden pt-safe pl-safe pr-safe"
            style={{ top: "var(--navbar-height, 4rem)" }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Content */}
            <motion.nav
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="absolute top-0 left-0 right-0 bg-background pb-safe px-4 sm:px-6 shadow-elevated"
              dir={dir}
            >
              <div className="flex flex-col gap-1 py-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className={`block py-3 px-4 rounded-lg text-base font-medium touch-target transition-colors ${
                        location.pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile action buttons */}
                <div className="pt-4 flex flex-col gap-3 border-t border-border mt-4">
                  <Button
                    variant="whatsapp"
                    className="w-full touch-target"
                    asChild
                  >
                    <a
                      href={`https://wa.me/${site.contact.whatsapp.replace(
                        /\D/g,
                        ""
                      )}?text=Hi%2C%20I%27d%20like%20to%20book%20a%20session.`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t("hero.chatWhatsApp")}
                    </a>
                  </Button>
                  <Button
                    variant="default"
                    className="w-full touch-target"
                    asChild
                  >
                    <Link to="/booking">{t("hero.bookSession")}</Link>
                  </Button>
                  {user ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full touch-target"
                        asChild
                      >
                        <Link to="/profile">
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full touch-target"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Log Out
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="default"
                      className="w-full touch-target"
                      asChild
                    >
                      <Link to="/auth">Sign In</Link>
                    </Button>
                  )}
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
