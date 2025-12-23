import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageCircle,
  Calendar,
  Heart,
  Brain,
  Users,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import site from "@/config/site.json";

export default function Index() {
  const { t, dir } = useLanguage();

  const services = [
    {
      icon: Brain,
      titleKey: "services.individual",
      descKey: "services.individualDesc",
    },
    {
      icon: Heart,
      titleKey: "services.anxiety",
      descKey: "services.anxietyDesc",
    },
    {
      icon: Users,
      titleKey: "services.relationship",
      descKey: "services.relationshipDesc",
    },
  ];

  const steps = [
    {
      number: "01",
      titleKey: "howItWorks.step1Title",
      descKey: "howItWorks.step1Desc",
    },
    {
      number: "02",
      titleKey: "howItWorks.step2Title",
      descKey: "howItWorks.step2Desc",
    },
    {
      number: "03",
      titleKey: "howItWorks.step3Title",
      descKey: "howItWorks.step3Desc",
    },
  ];

  return (
    <Layout>
      {/* Hero Section - Mobile-first responsive */}
      <section
        className="relative min-h-screen-dvh sm:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-20 sm:pt-24 md:pt-32"
        dir={dir}
      >
        {/* Decorative blobs - hidden on mobile, visible on larger screens */}
        <div className="hidden sm:block blob-decoration w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-sage-light top-10 sm:top-20 -left-32 sm:-left-48" />
        <div className="hidden sm:block blob-decoration w-40 sm:w-64 md:w-80 h-40 sm:h-64 md:h-80 bg-rose-light bottom-10 sm:bottom-20 -right-24 sm:-right-40" />

        <div className="container-wide relative z-10 py-8 sm:py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            {/* Hero Text Content */}
            <div
              className={`text-center lg:text-${
                dir === "rtl" ? "right" : "left"
              }`}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-light rounded-full text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                  {site.brand.title}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-display mb-4 sm:mb-6"
              >
                {site.hero.headline}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-subheadline max-w-3xl mx-auto lg:mx-0 mb-6 sm:mb-10"
              >
                {site.hero.subheadline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                <Button variant="hero" className="touch-target" asChild>
                  <Link to="/booking">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {site.hero.ctaText}
                  </Link>
                </Button>
                <Button variant="hero-outline" className="touch-target" asChild>
                  <a
                    href={`https://wa.me/${site.contact.whatsapp.replace(
                      /\D/g,
                      ""
                    )}?text=Hi%2C%20I%27d%20like%20to%20book%20a%20session.`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {t("hero.chatWhatsApp")}
                  </a>
                </Button>
              </motion.div>
            </div>

            {/* Profile Image - hidden on small mobile, visible from md up */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block mt-8 sm:mt-12 lg:mt-0"
            >
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-elevated">
                  <img
                    src={site.about.image}
                    alt={site.brand.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 w-24 sm:w-32 h-24 sm:h-32 rounded-lg sm:rounded-2xl bg-primary-light/80 backdrop-blur-sm flex items-center justify-center touch-target">
                  <div className="text-center">
                    <span className="block font-serif text-2xl sm:text-3xl font-bold text-primary">
                      10+
                    </span>
                    <span className="text-xs sm:text-sm text-primary/80">
                      {t("about.experience").split(" ").slice(1).join(" ")}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator - hide on small mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 hidden sm:block"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2"
            >
              <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview - responsive grid */}
      <section className="section-padding bg-background" dir={dir}>
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary rounded-full text-secondary-foreground text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              {t("services.badge")}
            </span>
            <h2 className="text-headline mb-3 sm:mb-4">
              {t("services.title")}
            </h2>
            <p className="text-body-large max-w-2xl mx-auto">
              {t("services.description")}
            </p>
          </motion.div>

          {/* Services Grid - 1 col mobile, 2 col tablet, 3 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-luxury group"
              >
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-primary-light flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary transition-colors duration-300">
                  <service.icon className="w-6 sm:w-7 h-6 sm:h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="font-serif text-base sm:text-lg md:text-xl font-medium mb-2 sm:mb-3">
                  {t(service.titleKey)}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {t(service.descKey)}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8 sm:mt-12"
          >
            <Button variant="sage-outline" className="touch-target" asChild>
              <Link to="/services">
                {t("services.viewAll")}
                <ArrowRight
                  className={`w-4 h-4 ${
                    dir === "rtl" ? "mr-2 rotate-180" : "ml-2"
                  }`}
                />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How It Works - responsive grid */}
      <section className="section-padding bg-cream" dir={dir}>
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-rose-light rounded-full text-rose-dark text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              {t("howItWorks.badge")}
            </span>
            <h2 className="text-headline mb-3 sm:mb-4">
              {t("howItWorks.title")}
            </h2>
            <p className="text-body-large max-w-2xl mx-auto">
              {t("howItWorks.description")}
            </p>
          </motion.div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center"
              >
                <span className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-primary/20 block mb-3 sm:mb-4">
                  {step.number}
                </span>
                <h3 className="font-serif text-base sm:text-lg md:text-xl font-medium mb-2 sm:mb-3">
                  {t(step.titleKey)}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {t(step.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="section-padding bg-background" dir={dir}>
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <Sparkles className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-primary" />
            </div>
            <h2 className="text-headline mb-4 sm:mb-6">{t("trust.title")}</h2>
            <p className="text-body-large mb-6 sm:mb-8 max-w-2xl mx-auto">
              {t("trust.quote")}
            </p>
            <p className="font-serif text-base sm:text-lg text-primary italic">
              {t("trust.author")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - mobile optimized */}
      <section
        className="section-padding bg-gradient-sage relative overflow-hidden"
        dir={dir}
      >
        <div className="hidden sm:block blob-decoration w-40 sm:w-56 md:w-64 h-40 sm:h-56 md:h-64 bg-sage-light/50 -top-12 sm:-top-20 -right-12 sm:-right-20" />

        <div className="container-narrow relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-headline text-primary-foreground mb-4 sm:mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-base sm:text-lg text-primary-foreground/80 mb-6 sm:mb-10 max-w-xl mx-auto">
              {t("cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                variant="cream"
                className="touch-target text-sage-dark hover:text-sage"
                asChild
              >
                <Link to="/booking">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {t("hero.bookSession")}
                </Link>
              </Button>
              <Button variant="whatsapp" className="touch-target" asChild>
                <a
                  href={`https://wa.me/${site.contact.whatsapp.replace(
                    /\D/g,
                    ""
                  )}?text=Hi%2C%20I%27d%20like%20to%20book%20a%20session.`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {t("hero.chatWhatsApp")}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
