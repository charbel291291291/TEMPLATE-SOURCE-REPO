import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { saveUserInfo } from "@/lib/auth";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in (frontend only)
    const userEmail = localStorage.getItem("user_email");
    if (userEmail) {
      navigate("/profile");
    }
    setIsCheckingAuth(false);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && !fullName) {
      toast({
        title: "Please fill in all fields",
        description: "Full name is required for sign up",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Frontend-only login (simple email/password validation)
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        saveUserInfo(email, "");

        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        navigate("/profile");
      } else {
        // Frontend-only signup
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        saveUserInfo(email, fullName);

        toast({
          title: "Account created!",
          description: "Welcome! You're now logged in.",
        });
        navigate("/profile");

        setIsLogin(true);
        setFullName("");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: isLogin ? "Login failed" : "Sign up failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen-dvh sm:min-h-screen bg-gradient-hero flex items-center justify-center px-4 pt-safe pb-safe">
      <div className="blob-decoration w-96 h-96 bg-sage-light top-20 -left-48" />
      <div className="blob-decoration w-80 h-80 bg-rose-light bottom-20 -right-40" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="card-luxury">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-medium mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {isLogin
                ? "Sign in to access your profile"
                : "Join our wellness community"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    className="input-luxury pl-10 sm:pl-12"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  className="input-luxury pl-10 sm:pl-12"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  className="input-luxury pl-10 sm:pl-12 pr-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 6 characters
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="sage"
              size="lg"
              className="w-full touch-target"
              disabled={isLoading}
            >
              {isLoading ? (
                "Please wait..."
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail("");
                setPassword("");
                setFullName("");
              }}
              className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <a
            href="/"
            className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to website
          </a>
        </div>
      </motion.div>
    </div>
  );
}
