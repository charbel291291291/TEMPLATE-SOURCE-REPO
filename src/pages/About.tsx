import { useState } from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, Heart, Shield, Languages, Clock } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import site from "@/config/site.json";

export default function About() {
  const { t, dir } = useLanguage();

  const values = [
    {
      icon: Heart,
      titleKey: "about.compassion",
      descKey: "about.compassionDesc",
    },
    {
      icon: Shield,
      titleKey: "about.confidentiality",
      descKey: "about.confidentialityDesc",
    },
    {
      icon: BookOpen,
      titleKey: "about.evidenceBased",
      descKey: "about.evidenceBasedDesc",
    },
    {
      icon: Award,
      titleKey: "about.excellence",
      descKey: "about.excellenceDesc",
    },
  ];

  const expectations = [
    { titleKey: "about.expect1Title", descKey: "about.expect1Desc" },
    { titleKey: "about.expect2Title", descKey: "about.expect2Desc" },
    { titleKey: "about.expect3Title", descKey: "about.expect3Desc" },
    { titleKey: "about.expect4Title", descKey: "about.expect4Desc" },
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
              {t("about.badge")}
            </span>
            <h1 className="text-display mb-6">{t("about.title")}</h1>
            <p className="text-subheadline">{t("about.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="section-padding bg-background" dir={dir}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="aspect-[4/5] rounded-3xl bg-gradient-card border border-border/50 shadow-soft overflow-hidden">
                <img
                  src={site.about.image}
                  alt={site.brand.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: dir === "rtl" ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-headline mb-6">{t("about.approachTitle")}</h2>
              <div className="space-y-4 text-body-large">
                <p>{t("about.approach1")}</p>
                <p>{t("about.approach2")}</p>
                <p>{t("about.approach3")}</p>
              </div>

              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-border flex-wrap">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Languages className="w-5 h-5 text-primary" />
                  <span>{t("about.languages")}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{t("about.experience")}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-cream" dir={dir}>
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-headline mb-4">{t("about.valuesTitle")}</h2>
            <p className="text-body-large max-w-2xl mx-auto">
              {t("about.valuesSubtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-medium mb-2">
                  {t(value.titleKey)}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t(value.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="section-padding bg-background" dir={dir}>
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-rose-light rounded-full text-rose-dark text-sm font-medium mb-4">
              {t("about.expectBadge")}
            </span>
            <h2 className="text-headline mb-4">{t("about.expectTitle")}</h2>
            <p className="text-body-large max-w-2xl mx-auto">
              {t("about.expectSubtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {expectations.map((item, index) => (
              <motion.div
                key={item.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-luxury"
              >
                <span className="font-serif text-4xl font-light text-primary/20 block mb-2">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-xl font-medium mb-2">
                  {t(item.titleKey)}
                </h3>
                <p className="text-muted-foreground">{t(item.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Note */}
      <section className="section-padding bg-sage-light/30" dir={dir}>
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Shield className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-headline mb-4">{t("about.privacyTitle")}</h2>
            <p className="text-body-large mb-8 max-w-2xl mx-auto">
              {t("about.privacyDesc")}
            </p>
            <Button variant="sage" size="lg" asChild>
              <Link to="/booking">{t("about.beginJourney")}</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
