import { Link } from "react-router-dom";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import site from "@/config/site.json";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, dir } = useLanguage();

  const quickLinks = [
    { href: "/about", labelKey: "nav.about" },
    { href: "/services", labelKey: "nav.services" },
    { href: "/booking", labelKey: "nav.booking" },
    { href: "/contact", labelKey: "nav.contact" },
  ];

  return (
    <footer className="bg-cream-dark border-t border-border" dir={dir}>
      <div className="container-wide section-padding pb-safe">
        {/* Main Content Grid - responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-serif font-semibold text-foreground text-base sm:text-lg md:text-xl">
                {site.brand.name}
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">
              {t("footer.description")}
            </p>
            <div className="flex gap-4">
              <a
                href={`https://wa.me/${site.contact.whatsapp.replace(
                  /\D/g,
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-whatsapp flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold mb-4 text-sm sm:text-base">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif font-semibold mb-4 text-sm sm:text-base">
              {t("footer.services")}
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                "Individual Therapy",
                "Anxiety & Stress",
                "Depression Support",
                "Relationship Counseling",
              ].map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold mb-4 text-sm sm:text-base">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a
                  href={`https://wa.me/${site.contact.whatsapp.replace(
                    /\D/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base break-all"
                >
                  {site.contact.whatsapp}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base break-all"
                >
                  {site.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm sm:text-base">
                  {site.contact.location}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - responsive layout */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © {currentYear} {site.brand.name}. {t("footer.rights")}
          </p>
          <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
            <Link
              to="/privacy"
              className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {t("footer.privacyPolicy")}
            </Link>
            <Link
              to="/terms"
              className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {t("footer.terms")}
            </Link>
          </div>
        </div>

        {/* Powered by EyeDeaz */}
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Powered by{" "}
            <a
              href="https://eyedeaz.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              EyeDeaz
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
