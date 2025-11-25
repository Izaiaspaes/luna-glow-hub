import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Mail, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export const NewsletterSignup = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailSchema = z.object({
    email: z
      .string()
      .trim()
      .email({ message: t('newsletter.errorInvalidEmail') })
      .max(255, { message: t('newsletter.errorEmailTooLong') })
      .toLowerCase(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const validation = emailSchema.safeParse({ email });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      // Insert into database
      const { error: insertError } = await supabase
        .from("newsletter_subscribers")
        .insert({
          email: validation.data.email,
          source: "blog",
        });

      if (insertError) {
        if (insertError.code === "23505") {
          // Unique constraint violation
          toast.error(t('newsletter.errorAlreadySubscribed'));
        } else {
          throw insertError;
        }
        return;
      }

      // Call edge function to send confirmation email
      const { error: emailError } = await supabase.functions.invoke(
        "send-newsletter-confirmation",
        {
          body: { email: validation.data.email },
        }
      );

      if (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // Don't fail the subscription if email fails
        toast.success(t('newsletter.successNoEmail'));
      } else {
        toast.success(t('newsletter.successSubscribed'));
      }

      setEmail("");
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      toast.error(t('newsletter.errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-border/50">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">{t('newsletter.title')}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {t('newsletter.description')}
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder={t('newsletter.placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            disabled={isLoading}
            maxLength={255}
            required
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t('newsletter.buttonLoading') : t('newsletter.button')}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground mt-2">
        {t('newsletter.disclaimer')}
      </p>
    </div>
  );
};
