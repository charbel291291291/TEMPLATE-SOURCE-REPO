import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Building2,
  Phone,
  MessageSquare,
  Globe,
  Languages,
  Mail,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uploadDoctorImage } from "@/lib/storage";

interface SiteSettings {
  id: string;
  clinic_name: string | null;
  doctor_name: string | null;
  title: string | null;
  bio_short: string | null;
  bio_long: string | null;
  whatsapp_phone: string | null;
  whatsapp_template: string | null;
  email_public: string | null;
  address: string | null;
  timezone: string | null;
  languages: string[] | null;
  policies: string | null;
  doctor_image_url: string | null;
}

export default function SettingsManagement() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setSettings(data);
      } else {
        // Create default settings if none exist
        const { data: newData, error: insertError } = await supabase
          .from("site_settings")
          .insert({
            clinic_name: "Your Clinic Name",
            doctor_name: "Professional Name",
            title: "Mental Health Professional",
            whatsapp_phone: "+15550000000",
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setSettings(newData);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error loading settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          clinic_name: settings.clinic_name,
          doctor_name: settings.doctor_name,
          title: settings.title,
          bio_short: settings.bio_short,
          bio_long: settings.bio_long,
          whatsapp_phone: settings.whatsapp_phone,
          whatsapp_template: settings.whatsapp_template,
          email_public: settings.email_public,
          address: settings.address,
          timezone: settings.timezone,
          languages: settings.languages,
          policies: settings.policies,
          doctor_image_url: settings.doctor_image_url,
        })
        .eq("id", settings.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5242880) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      const base64Url = await uploadDoctorImage(file, "doctor/profile.jpg");
      updateField("doctor_image_url", base64Url);
      toast({
        title: "Image uploaded",
        description:
          "Doctor image updated successfully. Click Save to persist changes.",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error uploading image",
        description:
          error?.message || "Please try again with a different image",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const updateField = (field: keyof SiteSettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Clinic Information */}
      <div className="card-luxury">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-serif text-xl font-medium">Clinic Information</h3>
        </div>

        {/* Doctor Image Upload */}
        <div className="mb-6 pb-6 border-b border-border">
          <label className="block text-sm font-medium mb-4">Doctor Photo</label>
          <div className="flex items-center gap-4">
            {settings?.doctor_image_url && (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-border">
                <img
                  src={settings.doctor_image_url}
                  alt="Doctor"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => updateField("doctor_image_url", null)}
                  className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-lg hover:bg-red-600 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div>
              <label className="relative inline-flex cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
                <Button variant="secondary" disabled={isUploadingImage} asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploadingImage ? "Uploading..." : "Upload Photo"}
                  </span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                Recommended: Square image, at least 400x400px
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Clinic Name
            </label>
            <Input
              value={settings?.clinic_name || ""}
              onChange={(e) => updateField("clinic_name", e.target.value)}
              placeholder="Your clinic name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Doctor Name
            </label>
            <Input
              value={settings?.doctor_name || ""}
              onChange={(e) => updateField("doctor_name", e.target.value)}
              placeholder="Dr. Full Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Professional Title
            </label>
            <Input
              value={settings?.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g., Mental Health Professional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <Input
              value={settings?.address || ""}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="Office address"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Short Bio</label>
          <Input
            value={settings?.bio_short || ""}
            onChange={(e) => updateField("bio_short", e.target.value)}
            placeholder="A brief tagline or description"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Full Bio</label>
          <Textarea
            value={settings?.bio_long || ""}
            onChange={(e) => updateField("bio_long", e.target.value)}
            placeholder="Your detailed professional biography..."
            rows={4}
          />
        </div>
      </div>

      {/* Contact Settings */}
      <div className="card-luxury">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-serif text-xl font-medium">Contact Settings</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              WhatsApp Phone
            </label>
            <Input
              value={settings?.whatsapp_phone || ""}
              onChange={(e) => updateField("whatsapp_phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Include country code
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Public Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                className="pl-10"
                value={settings?.email_public || ""}
                onChange={(e) => updateField("email_public", e.target.value)}
                placeholder="contact@example.com"
              />
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Template */}
      <div className="card-luxury">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-serif text-xl font-medium">
            WhatsApp Message Template
          </h3>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Default Message
          </label>
          <Textarea
            value={settings?.whatsapp_template || ""}
            onChange={(e) => updateField("whatsapp_template", e.target.value)}
            placeholder="Hi, I'd like to book a session."
            rows={3}
          />
          <p className="text-xs text-muted-foreground mt-1">
            This message will be pre-filled when clients click the WhatsApp
            button
          </p>
        </div>
      </div>

      {/* Regional Settings */}
      <div className="card-luxury">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-serif text-xl font-medium">Regional Settings</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Timezone</label>
            <select
              value={settings?.timezone || "UTC"}
              onChange={(e) => updateField("timezone", e.target.value)}
              className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
            >
              <option value="UTC">UTC</option>
              <option value="Asia/Beirut">Beirut (GMT+2/+3)</option>
              <option value="Asia/Dubai">Dubai (GMT+4)</option>
              <option value="Europe/Paris">Paris (GMT+1/+2)</option>
              <option value="America/New_York">New York (GMT-5/-4)</option>
              <option value="America/Los_Angeles">
                Los Angeles (GMT-8/-7)
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Languages</label>
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-muted-foreground" />
              <Input
                value={settings?.languages?.join(", ") || ""}
                onChange={(e) =>
                  updateField(
                    "languages",
                    e.target.value.split(",").map((l) => l.trim())
                  )
                }
                placeholder="English, Arabic, French"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Comma-separated list
            </p>
          </div>
        </div>
      </div>

      {/* Policies */}
      <div className="card-luxury">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-serif text-xl font-medium">Policies & Terms</h3>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Cancellation & Session Policies
          </label>
          <Textarea
            value={settings?.policies || ""}
            onChange={(e) => updateField("policies", e.target.value)}
            placeholder="Your cancellation policy, session rules, payment terms..."
            rows={6}
          />
        </div>
      </div>

      {/* Save Button Bottom */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </motion.div>
  );
}
