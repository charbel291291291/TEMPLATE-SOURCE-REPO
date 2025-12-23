import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, X, Check, Clock, DollarSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Service = Database["public"]["Tables"]["services"]["Row"];
type SessionFormat = Database["public"]["Enums"]["session_format"];

const sessionFormats: { value: SessionFormat; label: string }[] = [
  { value: "online", label: "Online Only" },
  { value: "in_person", label: "In-Person Only" },
  { value: "both", label: "Both" },
];

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    who_its_for: "",
    duration_minutes: 60,
    price_amount: 0,
    currency: "USD",
    session_format: "both" as SessionFormat,
    featured: false,
    is_published: true,
    sort_order: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error loading services",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: selectedService ? formData.slug : generateSlug(title),
    });
  };

  const openCreateDialog = () => {
    setSelectedService(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      who_its_for: "",
      duration_minutes: 60,
      price_amount: 0,
      currency: "USD",
      session_format: "both",
      featured: false,
      is_published: true,
      sort_order: services.length,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    setSelectedService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      description: service.description || "",
      who_its_for: service.who_its_for || "",
      duration_minutes: service.duration_minutes || 60,
      price_amount: service.price_amount ? Number(service.price_amount) : 0,
      currency: service.currency || "USD",
      session_format: service.session_format || "both",
      featured: service.featured || false,
      is_published: service.is_published ?? true,
      sort_order: service.sort_order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug) {
      toast({
        title: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const serviceData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description || null,
        who_its_for: formData.who_its_for || null,
        duration_minutes: formData.duration_minutes,
        price_amount: formData.price_amount,
        currency: formData.currency,
        session_format: formData.session_format,
        featured: formData.featured,
        is_published: formData.is_published,
        sort_order: formData.sort_order,
      };

      if (selectedService) {
        const { error } = await supabase
          .from("services")
          .update(serviceData)
          .eq("id", selectedService.id);
        if (error) throw error;
        toast({ title: "Service updated successfully" });
      } else {
        const { error } = await supabase
          .from("services")
          .insert(serviceData);
        if (error) throw error;
        toast({ title: "Service created successfully" });
      }

      setIsDialogOpen(false);
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
      toast({
        title: "Error saving service",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", selectedService.id);

      if (error) throw error;

      toast({ title: "Service deleted successfully" });
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: "Error deleting service",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const togglePublished = async (service: Service) => {
    try {
      const { error } = await supabase
        .from("services")
        .update({ is_published: !service.is_published })
        .eq("id", service.id);

      if (error) throw error;
      fetchServices();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading services...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif text-xl font-medium">Services Management</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {services.length} service{services.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="card-luxury text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">No services yet</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Create your first service to get started.
          </p>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className={`card-luxury transition-all ${
                !service.is_published ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-serif text-lg font-medium">{service.title}</h4>
                    {service.featured && (
                      <span className="px-2 py-0.5 bg-rose-light text-rose-dark text-xs rounded-full">
                        Featured
                      </span>
                    )}
                    {!service.is_published && (
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                  
                  {service.description && (
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {service.duration_minutes} min
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      {service.currency} {service.price_amount}
                    </span>
                    <span className="text-muted-foreground capitalize">
                      {service.session_format === "both" 
                        ? "Online & In-person" 
                        : service.session_format?.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={service.is_published ?? false}
                    onCheckedChange={() => togglePublished(service)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(service)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedService(service);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {selectedService ? "Edit Service" : "Create New Service"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Individual Therapy"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL Slug *</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., individual-therapy"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this service includes..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Who It's For</label>
              <Textarea
                value={formData.who_its_for}
                onChange={(e) => setFormData({ ...formData, who_its_for: e.target.value })}
                placeholder="Describe the ideal client for this service..."
                rows={2}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Duration (min)</label>
                <Input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })}
                  min={15}
                  step={15}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <Input
                  type="number"
                  value={formData.price_amount}
                  onChange={(e) => setFormData({ ...formData, price_amount: parseFloat(e.target.value) || 0 })}
                  min={0}
                  step={0.01}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="AED">AED (د.إ)</SelectItem>
                    <SelectItem value="SAR">SAR (﷼)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Session Format</label>
                <Select
                  value={formData.session_format}
                  onValueChange={(value: SessionFormat) => setFormData({ ...formData, session_format: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sessionFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sort Order</label>
                <Input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <span className="text-sm">Featured service</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Switch
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <span className="text-sm">Published</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="sage">
                <Check className="w-4 h-4 mr-2" />
                {selectedService ? "Update Service" : "Create Service"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedService?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
