import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Mail, Sparkles } from "lucide-react";

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "E-mail inválido" })
    .max(255, { message: "E-mail muito longo" })
    .toLowerCase(),
});

export const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
          toast.error("Este e-mail já está cadastrado na newsletter!");
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
        toast.success(
          "Inscrição realizada! Você receberá nossos próximos conteúdos."
        );
      } else {
        toast.success(
          "Inscrição confirmada! Verifique seu e-mail para mais detalhes."
        );
      }

      setEmail("");
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      toast.error("Erro ao se inscrever. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-border/50">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">Newsletter Luna</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Receba artigos exclusivos sobre saúde feminina, bem-estar e autocuidado
        diretamente no seu e-mail.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            disabled={isLoading}
            maxLength={255}
            required
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Inscrever"}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground mt-2">
        Sem spam. Cancele a qualquer momento.
      </p>
    </div>
  );
};
