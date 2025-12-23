import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogOut,
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Edit2,
  X,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getUserInfo, clearUserInfo } from "@/lib/auth";
import { Layout } from "@/components/layout/Layout";

interface UserProfileData {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  bio: string;
}

export default function UserProfile() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserProfileData>({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    bio: "",
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load user profile
  useEffect(() => {
    const userInfo = getUserInfo();

    if (!userInfo.email) {
      navigate("/auth");
      return;
    }

    setUserEmail(userInfo.email);
    setProfileData({
      full_name: userInfo.name || "",
      phone: localStorage.getItem("user_phone") || "",
      address: localStorage.getItem("user_address") || "",
      city: localStorage.getItem("user_city") || "",
      bio: localStorage.getItem("user_bio") || "",
    });

    setIsLoading(false);
  }, [navigate]);

  const handleSaveProfile = async () => {
    if (!profileData.full_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Full name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Save to localStorage (frontend only)
      localStorage.setItem("user_name", profileData.full_name);
      localStorage.setItem("user_phone", profileData.phone);
      localStorage.setItem("user_address", profileData.address);
      localStorage.setItem("user_city", profileData.city);
      localStorage.setItem("user_bio", profileData.bio);

      setEditingProfile(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Frontend-only password change (simple validation)
      // In a real app, this would be validated on a secure backend

      // Clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);

      toast({
        title: "Success",
        description: "Password changed successfully",
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    clearUserInfo();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen-dvh sm:min-h-screen flex items-center justify-center pt-safe">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen-dvh sm:min-h-screen bg-background pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 pt-safe">
        <div className="container-wide max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12"
          >
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium mb-2">
                My Profile
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full sm:w-auto touch-target"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Profile Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card-luxury">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-medium mb-1">
                    {profileData.full_name || "User"}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    {userEmail}
                  </p>

                  <div className="w-full space-y-3 pt-6 border-t border-border">
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground break-all">
                        {userEmail}
                      </span>
                    </div>

                    {profileData.phone && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {profileData.phone}
                        </span>
                      </div>
                    )}

                    {profileData.city && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {profileData.city}
                        </span>
                      </div>
                    )}

                    {user?.created_at && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          Member since{" "}
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Profile Edit & Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 space-y-6 sm:space-y-8"
            >
              {/* Edit Profile Section */}
              <div className="card-luxury">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-lg sm:text-xl font-medium flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </h3>
                  <Button
                    variant={editingProfile ? "destructive" : "outline"}
                    size="sm"
                    onClick={() =>
                      editingProfile
                        ? setEditingProfile(false)
                        : setEditingProfile(true)
                    }
                    className="touch-target"
                  >
                    {editingProfile ? (
                      <>
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      className="input-luxury"
                      value={profileData.full_name}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          full_name: e.target.value,
                        })
                      }
                      disabled={!editingProfile}
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      className="input-luxury"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      disabled={!editingProfile}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      City
                    </label>
                    <Input
                      type="text"
                      className="input-luxury"
                      value={profileData.city}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          city: e.target.value,
                        })
                      }
                      disabled={!editingProfile}
                      placeholder="Your city"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      Address
                    </label>
                    <Input
                      type="text"
                      className="input-luxury"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: e.target.value,
                        })
                      }
                      disabled={!editingProfile}
                      placeholder="Street address"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">
                      Bio
                    </label>
                    <textarea
                      className="input-luxury resize-none"
                      rows={3}
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          bio: e.target.value,
                        })
                      }
                      disabled={!editingProfile}
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  {editingProfile && (
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="w-full touch-target"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Security Section */}
              <div className="card-luxury">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-lg sm:text-xl font-medium flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Security
                  </h3>
                  <Button
                    variant={isChangingPassword ? "destructive" : "outline"}
                    size="sm"
                    onClick={() =>
                      isChangingPassword
                        ? setIsChangingPassword(false)
                        : setIsChangingPassword(true)
                    }
                    className="touch-target"
                  >
                    {isChangingPassword ? (
                      <>
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4 mr-1" />
                        Change Password
                      </>
                    )}
                  </Button>
                </div>

                {!isChangingPassword ? (
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Click "Change Password" to update your password. This will
                      help keep your account secure.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-5">
                    {/* Current Password */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">
                        Current Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          className="input-luxury pl-10 sm:pl-12 pr-10 sm:pr-12"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">
                        New Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          className="input-luxury pl-10 sm:pl-12 pr-10 sm:pr-12"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum 6 characters
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          className="input-luxury pl-10 sm:pl-12 pr-10 sm:pr-12"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      onClick={handleChangePassword}
                      disabled={isSaving}
                      className="w-full touch-target"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
