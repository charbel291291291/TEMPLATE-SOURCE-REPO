import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Heart,
  Users,
  Sparkles,
  Clock,
  Video,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import site from "@/config/site.json";

// Icon map for services based on slug
const iconMap: Record<string, any> = {
  "individual-therapy": Brain,
  "anxiety-stress": Sparkles,
  "depression-support": Heart,
  "relationship-counseling": Users,
  "teen-support": Sparkles,
};

interface ServiceWithIcon {
  title: string;
  description: string;
  icon: any;
}

export default function Services() {
  const { t, dir } = useLanguage();

  // Use services from config file
  const services: ServiceWithIcon[] = (site.services || []).map((service) => ({
    ...service,
    icon: Brain,
  }));

  return (
    <Layout>
      {/* Hero */}
      <section
        className="relative pt-32 pb-20 bg-gradient-hero overflow-hidden"
        dir={dir}
      >
        <div className="blob-decoration w-80 h-80 bg-sage-light top-20 -right-40" />
        <div className="blob-decoration w-64 h-64 bg-rose-light bottom-10 -left-32" />

        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-2 bg-primary-light rounded-full text-primary text-sm font-medium mb-6">
              {t("servicesPage.badge")}
            </span>
            <h1 className="text-display mb-6">{t("servicesPage.title")}</h1>
            <p className="text-subheadline">{t("servicesPage.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background" dir={dir}>
        <div className="container-wide">
          {services.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No services available at the moment.
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card-luxury group"
                >
                  {service.featured && (
                    <span className="inline-block px-3 py-1 bg-rose-light text-rose-dark text-xs font-medium rounded-full mb-4">
                      {t("servicesPage.popular")}
                    </span>
                  )}

                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-300">
                      <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-medium mb-2">
                        {service.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {service.duration_minutes}{" "}
                          {t("servicesPage.duration")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          {t("servicesPage.online")}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {t("servicesPage.inPerson")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="p-4 bg-secondary/50 rounded-xl mb-6">
                    <p className="text-sm">
                      <span className="font-medium text-foreground">
                        {t("servicesPage.whoFor")}{" "}
                      </span>
                      <span className="text-muted-foreground">
                        {service.who_its_for}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-2xl font-serif font-medium text-foreground">
                        ${service.price_amount}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {t("servicesPage.perSession")}
                      </span>
                    </div>
                    <Button variant="sage" asChild>
                      <Link to="/booking">
                        {t("servicesPage.bookNow")}
                        <ArrowRight
                          className={`w-4 h-4 ${
                            dir === "rtl" ? "mr-2 rotate-180" : "ml-2"
                          }`}
                        />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Session Format */}
      <section className="section-padding bg-cream" dir={dir}>
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-headline mb-4">
              {t("servicesPage.flexibleTitle")}
            </h2>
            <p className="text-body-large max-w-2xl mx-auto">
              {t("servicesPage.flexibleDesc")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card-luxury text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-6">
                <Video className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-medium mb-3">
                {t("servicesPage.onlineTitle")}
              </h3>
              <p className="text-muted-foreground">
                {t("servicesPage.onlineDesc")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: dir === "rtl" ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card-luxury text-center"
            >
              <div className="w-16 h-16 rounded-full bg-rose-light flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-rose-dark" />
              </div>
              <h3 className="font-serif text-xl font-medium mb-3">
                {t("servicesPage.officeTitle")}
              </h3>
              <p className="text-muted-foreground">
                {t("servicesPage.officeDesc")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="section-padding bg-gradient-sage relative overflow-hidden"
        dir={dir}
      >
        <div className="container-narrow relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-headline text-primary-foreground mb-6">
              {t("servicesPage.notSure")}
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto">
              {t("servicesPage.notSureDesc")}
            </p>
            <Button
              variant="cream"
              size="xl"
              className="text-sage-dark hover:text-sage"
              asChild
            >
              <Link to="/contact">{t("servicesPage.getInTouch")}</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
