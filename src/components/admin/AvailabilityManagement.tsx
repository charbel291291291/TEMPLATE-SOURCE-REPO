import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Clock,
  Plus,
  Trash2,
  Calendar,
  Save,
  X,
  CalendarX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type AvailabilityRule = Database["public"]["Tables"]["availability_rules"]["Row"];
type BlockedTime = Database["public"]["Tables"]["blocked_times"]["Row"];

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export default function AvailabilityManagement() {
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingRule, setEditingRule] = useState<AvailabilityRule | null>(null);

  // New rule form state
  const [ruleForm, setRuleForm] = useState({
    day_of_week: 1,
    start_time: "09:00",
    end_time: "17:00",
    slot_duration: 60,
    buffer_minutes: 15,
    is_active: true,
  });

  // Block time form state
  const [blockForm, setBlockForm] = useState({
    start_date: undefined as Date | undefined,
    end_date: undefined as Date | undefined,
    reason: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const [rulesRes, blockedRes] = await Promise.all([
      supabase.from("availability_rules").select("*").order("day_of_week"),
      supabase.from("blocked_times").select("*").order("start_datetime", { ascending: false }),
    ]);

    if (rulesRes.error) {
      toast({ title: "Error fetching rules", description: rulesRes.error.message, variant: "destructive" });
    } else {
      setRules(rulesRes.data || []);
    }

    if (blockedRes.error) {
      toast({ title: "Error fetching blocked times", description: blockedRes.error.message, variant: "destructive" });
    } else {
      setBlockedTimes(blockedRes.data || []);
    }
    setIsLoading(false);
  };

  const openEditRule = (rule: AvailabilityRule) => {
    setEditingRule(rule);
    setRuleForm({
      day_of_week: rule.day_of_week || 1,
      start_time: rule.start_time,
      end_time: rule.end_time,
      slot_duration: rule.slot_duration || 60,
      buffer_minutes: rule.buffer_minutes || 15,
      is_active: rule.is_active ?? true,
    });
    setIsRuleDialogOpen(true);
  };

  const openNewRule = () => {
    setEditingRule(null);
    setRuleForm({
      day_of_week: 1,
      start_time: "09:00",
      end_time: "17:00",
      slot_duration: 60,
      buffer_minutes: 15,
      is_active: true,
    });
    setIsRuleDialogOpen(true);
  };

  const saveRule = async () => {
    setIsSaving(true);
    
    if (editingRule) {
      const { error } = await supabase
        .from("availability_rules")
        .update({
          day_of_week: ruleForm.day_of_week,
          start_time: ruleForm.start_time,
          end_time: ruleForm.end_time,
          slot_duration: ruleForm.slot_duration,
          buffer_minutes: ruleForm.buffer_minutes,
          is_active: ruleForm.is_active,
        })
        .eq("id", editingRule.id);

      if (error) {
        toast({ title: "Error updating rule", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Rule updated" });
        setIsRuleDialogOpen(false);
        fetchData();
      }
    } else {
      const { error } = await supabase
        .from("availability_rules")
        .insert({
          day_of_week: ruleForm.day_of_week,
          start_time: ruleForm.start_time,
          end_time: ruleForm.end_time,
          slot_duration: ruleForm.slot_duration,
          buffer_minutes: ruleForm.buffer_minutes,
          is_active: ruleForm.is_active,
        });

      if (error) {
        toast({ title: "Error creating rule", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Rule created" });
        setIsRuleDialogOpen(false);
        fetchData();
      }
    }
    setIsSaving(false);
  };

  const deleteRule = async (ruleId: string) => {
    const { error } = await supabase.from("availability_rules").delete().eq("id", ruleId);
    if (error) {
      toast({ title: "Error deleting rule", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Rule deleted" });
      fetchData();
    }
  };

  const toggleRuleActive = async (rule: AvailabilityRule) => {
    const { error } = await supabase
      .from("availability_rules")
      .update({ is_active: !rule.is_active })
      .eq("id", rule.id);

    if (error) {
      toast({ title: "Error toggling rule", description: error.message, variant: "destructive" });
    } else {
      fetchData();
    }
  };

  const saveBlockedTime = async () => {
    if (!blockForm.start_date || !blockForm.end_date) {
      toast({ title: "Please select both start and end dates", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.from("blocked_times").insert({
      start_datetime: blockForm.start_date.toISOString(),
      end_datetime: blockForm.end_date.toISOString(),
      reason: blockForm.reason || null,
    });

    if (error) {
      toast({ title: "Error blocking time", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Time blocked successfully" });
      setIsBlockDialogOpen(false);
      setBlockForm({ start_date: undefined, end_date: undefined, reason: "" });
      fetchData();
    }
    setIsSaving(false);
  };

  const deleteBlockedTime = async (id: string) => {
    const { error } = await supabase.from("blocked_times").delete().eq("id", id);
    if (error) {
      toast({ title: "Error removing blocked time", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Blocked time removed" });
      fetchData();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Working Hours */}
      <div className="card-luxury">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="font-serif text-xl font-medium">Working Hours</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Set your weekly availability schedule
            </p>
          </div>
          <Button onClick={openNewRule} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Hours
          </Button>
        </div>

        {isLoading ? (
          <div className="py-8 text-center animate-pulse text-muted-foreground">
            Loading...
          </div>
        ) : rules.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-border rounded-xl">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No availability rules set</p>
            <Button onClick={openNewRule} variant="outline" className="mt-4">
              Add Your First Rule
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-colors",
                  rule.is_active ? "bg-background border-border" : "bg-muted/50 border-muted"
                )}
              >
                <div className="flex items-center gap-4">
                  <Switch
                    checked={rule.is_active ?? true}
                    onCheckedChange={() => toggleRuleActive(rule)}
                  />
                  <div>
                    <p className={cn("font-medium", !rule.is_active && "text-muted-foreground")}>
                      {DAYS_OF_WEEK.find((d) => d.value === rule.day_of_week)?.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {rule.start_time} - {rule.end_time} • {rule.slot_duration}min slots • {rule.buffer_minutes}min buffer
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEditRule(rule)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteRule(rule.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blocked Times */}
      <div className="card-luxury">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="font-serif text-xl font-medium">Blocked Dates</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Block specific dates or time periods
            </p>
          </div>
          <Button onClick={() => setIsBlockDialogOpen(true)} variant="outline" size="sm">
            <CalendarX className="w-4 h-4 mr-2" />
            Block Time
          </Button>
        </div>

        {blockedTimes.length === 0 ? (
          <div className="py-8 text-center border-2 border-dashed border-border rounded-xl">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No blocked times</p>
          </div>
        ) : (
          <div className="space-y-3">
            {blockedTimes.map((block) => (
              <div
                key={block.id}
                className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5"
              >
                <div>
                  <p className="font-medium">
                    {format(new Date(block.start_datetime), "MMM d, yyyy")} -{" "}
                    {format(new Date(block.end_datetime), "MMM d, yyyy")}
                  </p>
                  {block.reason && (
                    <p className="text-sm text-muted-foreground">{block.reason}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => deleteBlockedTime(block.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Rule Dialog */}
      <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingRule ? "Edit Working Hours" : "Add Working Hours"}
            </DialogTitle>
            <DialogDescription>
              Configure your availability for a specific day
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Day of Week</Label>
              <Select
                value={ruleForm.day_of_week.toString()}
                onValueChange={(v) => setRuleForm({ ...ruleForm, day_of_week: parseInt(v) })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={ruleForm.start_time}
                  onChange={(e) => setRuleForm({ ...ruleForm, start_time: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={ruleForm.end_time}
                  onChange={(e) => setRuleForm({ ...ruleForm, end_time: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Slot Duration (min)</Label>
                <Select
                  value={ruleForm.slot_duration.toString()}
                  onValueChange={(v) => setRuleForm({ ...ruleForm, slot_duration: parseInt(v) })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Buffer Time (min)</Label>
                <Select
                  value={ruleForm.buffer_minutes.toString()}
                  onValueChange={(v) => setRuleForm({ ...ruleForm, buffer_minutes: parseInt(v) })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No buffer</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={ruleForm.is_active}
                onCheckedChange={(checked) => setRuleForm({ ...ruleForm, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRuleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveRule} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Time Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Block Time</DialogTitle>
            <DialogDescription>
              Block a date range to prevent bookings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full mt-1 justify-start text-left font-normal",
                        !blockForm.start_date && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {blockForm.start_date
                        ? format(blockForm.start_date, "MMM d, yyyy")
                        : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={blockForm.start_date}
                      onSelect={(date) => setBlockForm({ ...blockForm, start_date: date })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full mt-1 justify-start text-left font-normal",
                        !blockForm.end_date && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {blockForm.end_date
                        ? format(blockForm.end_date, "MMM d, yyyy")
                        : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={blockForm.end_date}
                      onSelect={(date) => setBlockForm({ ...blockForm, end_date: date })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label>Reason (optional)</Label>
              <Textarea
                placeholder="e.g., Holiday, Conference, Personal time..."
                value={blockForm.reason}
                onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                className="mt-1"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveBlockedTime} disabled={isSaving}>
              {isSaving ? "Blocking..." : "Block Time"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
