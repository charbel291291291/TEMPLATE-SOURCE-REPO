import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  MessageCircle,
  Check,
  Video,
  MapPin,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import site from "@/config/site.json";

const services = [
  {
    id: "individual-therapy",
    title: "Individual Therapy",
    duration: 60,
    price: 150,
  },
  {
    id: "anxiety-stress",
    title: "Anxiety & Stress Management",
    duration: 60,
    price: 150,
  },
  {
    id: "depression-support",
    title: "Depression Support",
    duration: 60,
    price: 150,
  },
  {
    id: "relationship-counseling",
    title: "Relationship Counseling",
    duration: 90,
    price: 200,
  },
];

const availableSlots = [
  {
    id: "1",
    date: "2024-01-22",
    time: "09:00",
    display: "Mon, Jan 22 - 9:00 AM",
  },
  {
    id: "2",
    date: "2024-01-22",
    time: "11:00",
    display: "Mon, Jan 22 - 11:00 AM",
  },
  {
    id: "3",
    date: "2024-01-22",
    time: "14:00",
    display: "Mon, Jan 22 - 2:00 PM",
  },
  {
    id: "4",
    date: "2024-01-23",
    time: "10:00",
    display: "Tue, Jan 23 - 10:00 AM",
  },
  {
    id: "5",
    date: "2024-01-23",
    time: "15:00",
    display: "Tue, Jan 23 - 3:00 PM",
  },
  {
    id: "6",
    date: "2024-01-24",
    time: "09:00",
    display: "Wed, Jan 24 - 9:00 AM",
  },
];

type BookingStep = 1 | 2 | 3 | 4 | 5;

export default function Booking() {
  const [step, setStep] = useState<BookingStep>(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
  });
  const { toast } = useToast();
  const { t, dir } = useLanguage();

  const sessionTypes = [
    {
      id: "online",
      title: t("booking.onlineSession"),
      icon: Video,
      description: t("booking.videoCall"),
    },
    {
      id: "in-person",
      title: t("booking.inPersonSession"),
      icon: MapPin,
      description: t("booking.officeVisit"),
    },
  ];

  const currentService = services.find((s) => s.id === selectedService);
  const currentSlot = availableSlots.find((s) => s.id === selectedSlot);

  const handleSubmit = () => {
    toast({
      title: t("booking.confirmed"),
      description: t("booking.confirmedDesc"),
    });
    setStep(5);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!selectedService;
      case 2:
        return !!sessionType;
      case 3:
        return !!selectedSlot;
      case 4:
        return formData.name && formData.email;
      default:
        return false;
    }
  };

  return (
    <Layout>
      {/* Hero - mobile optimized */}
      <section
        className="relative pt-20 sm:pt-24 md:pt-32 pb-8 sm:pb-12 md:pb-16 bg-gradient-hero"
        dir={dir}
      >
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-display mb-3 sm:mb-4">{t("booking.title")}</h1>
            <p className="text-subheadline">{t("booking.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      {/* Progress Steps - responsive layout */}
      <section
        className="py-6 sm:py-8 bg-background border-b border-border"
        dir={dir}
      >
        <div className="container-wide">
          <div className="flex justify-center items-center gap-1 sm:gap-2 md:gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-shrink-0">
                <div
                  className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors touch-target ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-4 sm:w-6 md:w-16 h-0.5 mx-1 sm:mx-2 transition-colors ${
                      step > s ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 sm:gap-4 md:gap-8 mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground overflow-x-auto pb-2">
            <span
              className={`flex-shrink-0 transition-colors ${
                step >= 1 ? "text-foreground font-medium" : ""
              }`}
            >
              {t("booking.service")}
            </span>
            <span
              className={`flex-shrink-0 transition-colors ${
                step >= 2 ? "text-foreground font-medium" : ""
              }`}
            >
              {t("booking.type")}
            </span>
            <span
              className={`flex-shrink-0 transition-colors ${
                step >= 3 ? "text-foreground font-medium" : ""
              }`}
            >
              {t("booking.time")}
            </span>
            <span
              className={`flex-shrink-0 transition-colors ${
                step >= 4 ? "text-foreground font-medium" : ""
              }`}
            >
              {t("booking.details")}
            </span>
          </div>
        </div>
      </section>

      {/* Booking Steps - mobile optimized forms */}
      <section className="section-padding bg-background" dir={dir}>
        <div className="container-narrow">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Service */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: dir === "rtl" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-headline text-center mb-6 sm:mb-8">
                  {t("booking.selectService")}
                </h2>
                <div className="grid gap-3 sm:gap-4">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`card-luxury text-${
                        dir === "rtl" ? "right" : "left"
                      } transition-all touch-target min-h-16 sm:min-h-20 ${
                        selectedService === service.id
                          ? "ring-2 ring-primary bg-primary-light/30"
                          : "hover:bg-secondary/50"
                      }`}
                    >
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex-1">
                          <h3 className="font-serif text-base sm:text-lg md:text-xl font-medium text-left sm:text-left">
                            {service.title}
                          </h3>
                          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                            {service.duration} {t("booking.minutes")}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-lg sm:text-xl font-serif font-medium">
                            ${service.price}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Session Type */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: dir === "rtl" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-headline text-center mb-6 sm:mb-8">
                  {t("booking.selectType")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {sessionTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSessionType(type.id)}
                      className={`card-luxury text-center transition-all touch-target min-h-32 sm:min-h-40 flex flex-col items-center justify-center ${
                        sessionType === type.id
                          ? "ring-2 ring-primary bg-primary-light/30"
                          : "hover:bg-secondary/50"
                      }`}
                    >
                      <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-2xl bg-primary-light flex items-center justify-center mb-3 sm:mb-4">
                        <type.icon className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-primary" />
                      </div>
                      <h3 className="font-serif text-base sm:text-lg md:text-xl font-medium mb-1 sm:mb-2">
                        {type.title}
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        {type.description}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Select Time */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: dir === "rtl" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-headline text-center mb-8">
                  {t("booking.selectTime")}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`p-4 rounded-xl border text-${
                        dir === "rtl" ? "right" : "left"
                      } transition-all flex items-center gap-4 ${
                        selectedSlot === slot.id
                          ? "border-primary bg-primary-light/30"
                          : "border-border hover:border-primary/50 hover:bg-secondary/30"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{slot.display}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {currentService?.duration} {t("booking.minutes")}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Your Details */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: dir === "rtl" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-headline text-center mb-8">
                  {t("booking.yourDetails")}
                </h2>
                <div className="card-luxury max-w-lg mx-auto">
                  <div className="space-y-6">
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
                        {t("booking.additionalNotes")}
                      </label>
                      <Textarea
                        className="input-luxury min-h-[100px]"
                        placeholder={t("booking.notesPlaceholder")}
                        value={formData.note}
                        onChange={(e) =>
                          setFormData({ ...formData, note: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mt-8 pt-6 border-t border-border">
                    <h3 className="font-medium mb-4">{t("booking.summary")}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("booking.service")}
                        </span>
                        <span>{currentService?.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("booking.type")}
                        </span>
                        <span className="capitalize">{sessionType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("booking.time")}
                        </span>
                        <span>{currentSlot?.display}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-border font-medium">
                        <span>{t("booking.total")}</span>
                        <span>${currentService?.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Confirmation */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-primary-foreground" />
                </div>
                <h2 className="text-headline mb-4">{t("booking.confirmed")}</h2>
                <p className="text-body-large mb-8 max-w-md mx-auto">
                  {t("booking.confirmedDesc")}
                </p>

                <div
                  className="card-luxury max-w-md mx-auto mb-8 text-left"
                  dir={dir}
                >
                  <h3 className="font-medium mb-4">
                    {t("booking.yourAppointment")}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("booking.service")}
                      </span>
                      <span>{currentService?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("booking.time")}
                      </span>
                      <span>{currentSlot?.display}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("booking.type")}
                      </span>
                      <span className="capitalize">{sessionType}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="whatsapp" asChild>
                    <a
                      href={`https://wa.me/${site.contact.whatsapp.replace(
                        /\D/g,
                        ""
                      )}?text=Hi%2C%20I%20just%20booked%20a%20session!`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {t("booking.messageWhatsApp")}
                    </a>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {step < 5 && (
            <div className="flex justify-between mt-12">
              <Button
                variant="ghost"
                onClick={() =>
                  setStep((s) => (s > 1 ? ((s - 1) as BookingStep) : s))
                }
                disabled={step === 1}
              >
                <ArrowLeft
                  className={`w-4 h-4 ${dir === "rtl" ? "ml-2" : "mr-2"}`}
                />
                {t("booking.back")}
              </Button>

              {step < 4 ? (
                <Button
                  variant="sage"
                  onClick={() => setStep((s) => (s + 1) as BookingStep)}
                  disabled={!canProceed()}
                >
                  {t("booking.continue")}
                  <ArrowRight
                    className={`w-4 h-4 ${dir === "rtl" ? "mr-2" : "ml-2"}`}
                  />
                </Button>
              ) : (
                <Button
                  variant="sage"
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                >
                  {t("booking.confirm")}
                  <Check
                    className={`w-4 h-4 ${dir === "rtl" ? "mr-2" : "ml-2"}`}
                  />
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
