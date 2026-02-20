import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import logoLuna from "@/assets/logo-luna.png";
import { useTranslation } from "react-i18next";
import { lovable } from "@/integrations/lovable/index";

export default function Auth() {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const authSchema = z.object({
    email: z.string().email({ message: t("auth.errors.invalidEmail") }),
    password: z.string().min(6, { message: t("auth.errors.passwordTooShort") }),
  });

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }

    // Check if user is accessing via password reset link
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsResetPassword(true);
        setIsForgotPassword(false);
      }
    });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error(t("auth.errors.wrongCredentials"));
        } else {
          toast.error(t("auth.errors.loginError") + error.message);
        }
      } else {
        // Check if user is active before allowing login
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_active")
            .eq("user_id", session.session.user.id)
            .single();
          
          if (profile && profile.is_active === false) {
            // Sign out the inactive user immediately
            await supabase.auth.signOut();
            toast.error(t("auth.errors.accountInactive"));
            setLoading(false);
            return;
          }
        }
        
        toast.success(t("auth.success.loginSuccess"));
        navigate("/dashboard");
      }
    } else {
      const { error, data } = await signUp(email, password);
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error(t("auth.errors.alreadyRegistered"));
        } else {
          toast.error(t("auth.errors.signupError") + error.message);
        }
      } else {
        toast.success(t("auth.success.accountCreated"));
        
        // Notify admins about new user registration
        if (data.user) {
          try {
            await supabase.functions.invoke("notify-admin-new-user", {
              body: {
                userId: data.user.id,
                userEmail: data.user.email,
                userName: data.user.user_metadata?.full_name || data.user.user_metadata?.name,
              },
            });
          } catch (notifyError) {
            // Log error but don't show to user - admin notifications are not critical for signup flow
            console.error("Failed to send admin notification:", notifyError);
          }
        }
        
        navigate("/dashboard");
      }
    }

    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error(t("auth.errors.enterEmail"));
      return;
    }

    const emailValidation = z.string().email().safeParse(email);
    if (!emailValidation.success) {
      toast.error(t("auth.errors.invalidEmail"));
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });

    if (error) {
      toast.error(t("auth.errors.emailSentError") + error.message);
    } else {
      toast.success(t("auth.success.emailSent"));
      setIsForgotPassword(false);
      setEmail("");
    }

    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error(t("auth.errors.passwordTooShort"));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("auth.errors.passwordsMismatch"));
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      toast.error(t("auth.errors.resetError") + error.message);
    } else {
      toast.success(t("auth.success.passwordReset"));
      setIsResetPassword(false);
      setPassword("");
      setConfirmPassword("");
      navigate("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-card">
        <CardHeader className="space-y-2 text-center">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={logoLuna} 
              alt="Luna Logo" 
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-2xl">
            {isResetPassword
              ? t("auth.resetPassword")
              : isForgotPassword
              ? t("auth.forgotPassword")
              : isLogin
              ? t("auth.welcomeBack")
              : t("auth.createAccount")}
          </CardTitle>
          <CardDescription>
            {isResetPassword
              ? t("auth.enterNewPassword")
              : isForgotPassword
              ? t("auth.sendResetLink")
              : isLogin
              ? t("auth.enterEmail")
              : t("auth.fillData")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isResetPassword ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.newPassword")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  showPasswordToggle
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("auth.confirmNewPassword")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  showPasswordToggle
                />
              </div>
              <Button type="submit" className="w-full" variant="colorful" disabled={loading}>
                {loading ? t("auth.resettingPassword") : t("auth.resetPasswordButton")}
              </Button>
            </form>
          ) : isForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" variant="colorful" disabled={loading}>
                {loading ? t("auth.sendingLink") : t("auth.sendLink")}
              </Button>
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-primary hover:underline"
                >
                  {t("auth.backToLogin")}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                disabled={googleLoading}
                onClick={async () => {
                  setGoogleLoading(true);
                  try {
                    await lovable.auth.signInWithOAuth("google", {
                      redirect_uri: window.location.origin,
                    });
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setGoogleLoading(false);
                  }
                }}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {googleLoading ? t("common.loading") : "Entrar com Google"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">ou</span>
                </div>
              </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  showPasswordToggle
                />
              </div>
              
              <Button type="submit" className="w-full" variant="colorful" disabled={loading}>
                {loading 
                  ? t("common.loading") 
                  : isLogin 
                    ? t("auth.enterButton") 
                    : t("auth.createButton")}
              </Button>

            </form>
            </div>
          )}

          {!isResetPassword && !isForgotPassword && (
            <div className="mt-4 space-y-2">
              {isLogin && (
                <div className="text-center text-sm">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-primary hover:underline"
                  >
                    {t("auth.forgotPasswordLink")}
                  </button>
                </div>
              )}
              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline"
                >
                  {isLogin
                    ? t("auth.noAccount")
                    : t("auth.hasAccount")}
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
