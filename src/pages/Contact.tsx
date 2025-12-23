import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Mail, MapPin, Clock, Send } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

import site from "@/config/site.json";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t, dir } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: t("common.required"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Frontend-only: Store message locally and redirect to WhatsApp
      const message = `Hi! Here's a message from your website:\n\nName: ${
        formData.name
      }\nEmail: ${formData.email}\nPhone: ${
        formData.phone || "Not provided"
      }\n\nMessage:\n${formData.message}`;

      const whatsappUrl = `https://wa.me/${site.contact.whatsapp.replace(
        /[^0-9]/g,
        ""
      )}?text=${encodeURIComponent(message)}`;

      toast({
        title: "Message Sent!",
        description: "Opening WhatsApp to send your message...",
      });

      setFormData({ name: "", email: "", phone: "", message: "" });

      // Open WhatsApp after a short delay
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 500);
    } catch (error) {
      console.error("Error preparing message:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or reach out via WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MessageCircle,
      titleKey: "contact.whatsappTitle",
      value: site.contact.whatsapp,
      href: `https://wa.me/${site.contact.whatsapp.replace(
        /\D/g,
        ""
      )}?text=Hi%2C%20I%27d%20like%20to%20get%20in%20touch.`,
      descKey: "contact.whatsappDesc",
    },
    {
      icon: Mail,
      titleKey: "contact.emailTitle",
      value: site.contact.email,
      href: `mailto:${site.contact.email}`,
      descKey: "contact.emailDesc",
    },
    {
      icon: Clock,
      titleKey: "contact.hoursTitle",
      valueKey: "contact.hoursValue",
      descKey: "contact.hoursDesc",
    },
    {
      icon: MapPin,
      titleKey: "contact.locationTitle",
      value: site.contact.location,
      descKey: "contact.locationDesc",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section
        className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden"
        dir={dir}
      >
        <div className="blob-decoration w-80 h-80 bg-sage-light top-20 -right-40" />

        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-2 bg-primary-light rounded-full text-primary text-sm font-medium mb-6">
              {t("contact.badge")}
            </span>
            <h1 className="text-display mb-6">{t("contact.title")}</h1>
            <p className="text-subheadline">{t("contact.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-background" dir={dir}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-headline mb-8">
                {t("contact.connectTitle")}
              </h2>

              <div className="space-y-6 mb-10">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={item.titleKey}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{t(item.titleKey)}</h3>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={
                            item.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            item.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="text-primary hover:underline"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-foreground">
                          {item.valueKey ? t(item.valueKey) : item.value}
                        </span>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        {t(item.descKey)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="p-6 bg-whatsapp/10 rounded-2xl border border-whatsapp/20">
                <h3 className="font-serif text-xl font-medium mb-3 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-whatsapp" />
                  {t("contact.preferWhatsApp")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t("contact.whatsappCTA")}
                </p>
                <Button variant="whatsapp" asChild>
                  <a
                    href={`https://wa.me/${site.contact.whatsapp.replace(
                      /\D/g,
                      ""
                    )}?text=Hi%2C%20I%27d%20like%20to%20get%20in%20touch.`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {t("contact.startChat")}
                  </a>
                </Button>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: dir === "rtl" ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="card-luxury">
                <h3 className="font-serif text-2xl font-medium mb-6">
                  {t("contact.sendMessage")}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("contact.fullName")} *
                    </label>
                    <Input
                      className="input-luxury"
                      placeholder={t("contact.yourName")}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("contact.email")} *
                    </label>
                    <Input
                      type="email"
                      className="input-luxury"
                      placeholder={t("contact.yourEmail")}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("contact.phone")}
                    </label>
                    <Input
                      type="tel"
                      className="input-luxury"
                      placeholder={t("contact.phonePlaceholder")}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("contact.message")} *
                    </label>
                    <Textarea
                      className="input-luxury min-h-[150px]"
                      placeholder={t("contact.messagePlaceholder")}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="sage"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      t("contact.sending")
                    ) : (
                      <>
                        {t("contact.sendBtn")}
                        <Send
                          className={`w-4 h-4 ${
                            dir === "rtl" ? "mr-2" : "ml-2"
                          }`}
                        />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Privacy Note */}
      <section className="py-12 bg-cream" dir={dir}>
        <div className="container-narrow text-center">
          <p className="text-sm text-muted-foreground">
            {t("contact.privacyNote")}
          </p>
        </div>
      </section>
    </Layout>
  );
}
