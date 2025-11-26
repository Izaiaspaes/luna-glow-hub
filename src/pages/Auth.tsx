import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import logoLuna from "@/assets/logo-luna.png";
import { useTranslation } from "react-i18next";

export default function Auth() {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
        toast.success(t("auth.success.loginSuccess"));
        navigate("/dashboard");
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error(t("auth.errors.alreadyRegistered"));
        } else {
          toast.error(t("auth.errors.signupError") + error.message);
        }
      } else {
        toast.success(t("auth.success.accountCreated"));
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
                />
              </div>
              <Button type="submit" className="w-full" variant="colorful" disabled={loading}>
                {loading ? t("auth.resettingPassword") : t("auth.resetPasswordButton")}
              </Button>
            </form>
          ) : isForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("common.email")}</Label>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("common.email")}</Label>
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
                <Label htmlFor="password">{t("common.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
      
      <WhatsAppButton />
    </div>
  );
}
