import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import site from "@/config/site.json";

interface WhatsAppButtonProps {
  message?: string;
}

export function WhatsAppButton({
  message = "Hi, I'd like to book a session.",
}: WhatsAppButtonProps) {
  const phone = site.contact.whatsapp.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </motion.a>
  );
}
