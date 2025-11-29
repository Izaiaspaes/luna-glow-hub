import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lightbulb, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export const SuggestionsForm = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [suggestionError, setSuggestionError] = useState("");

  const suggestionSchema = z.object({
    email: z.string().trim().email({ message: t('suggestions.invalidEmail') || "E-mail inválido" }),
    suggestion: z.string().trim().min(10, { message: t('suggestions.minLength') || "A sugestão deve ter pelo menos 10 caracteres" }).max(1000, { message: t('suggestions.maxLength') || "A sugestão deve ter no máximo 1000 caracteres" })
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEmailError("");
    setSuggestionError("");

    try {
      // Validate input
      suggestionSchema.parse({ email, suggestion });

      const { error } = await supabase
        .from('user_suggestions')
        .insert([{ email, suggestion, status: 'pending' }]);

      if (error) throw error;

      toast.success(t('suggestions.success') || "Sugestão enviada com sucesso!");
      setEmail("");
      setSuggestion("");
      setEmailError("");
      setSuggestionError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        if (firstError.path[0] === 'email') {
          setEmailError(firstError.message);
        } else if (firstError.path[0] === 'suggestion') {
          setSuggestionError(firstError.message);
        }
        toast.error(firstError.message);
      } else {
        console.error('Error submitting suggestion:', error);
        toast.error(t('suggestions.error') || "Erro ao enviar sugestão. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-luna-purple/10 via-luna-pink/10 to-luna-orange/10 rounded-lg p-6 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-luna-orange" />
        <h3 className="text-lg font-semibold">{t('suggestions.title') || "Sugestões e Ideias"}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {t('suggestions.description') || "Tem alguma sugestão ou ideia para melhorar a Luna? Adoraríamos ouvir você!"}
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Input
            type="email"
            placeholder={t('suggestions.emailPlaceholder') || "Seu e-mail"}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            required
            disabled={loading}
            className={emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error-suggestions" : undefined}
          />
          {emailError && (
            <p id="email-error-suggestions" className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <span>⚠️</span> {emailError}
            </p>
          )}
        </div>
        <div>
          <Textarea
            placeholder={t('suggestions.suggestionPlaceholder') || "Compartilhe sua sugestão ou ideia..."}
            value={suggestion}
            onChange={(e) => {
              setSuggestion(e.target.value);
              setSuggestionError("");
            }}
            required
            disabled={loading}
            className={`min-h-[100px] resize-none ${suggestionError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            maxLength={1000}
            aria-invalid={!!suggestionError}
            aria-describedby={suggestionError ? "suggestion-error" : undefined}
          />
          <div className="flex justify-between items-center mt-1">
            {suggestionError && (
              <p id="suggestion-error" className="text-red-500 text-xs flex items-center gap-1">
                <span>⚠️</span> {suggestionError}
              </p>
            )}
            <p className={`text-xs ml-auto ${suggestion.length > 950 ? 'text-orange-500' : 'text-muted-foreground'}`}>
              {suggestion.length}/1000
            </p>
          </div>
        </div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('suggestions.sending') || "Enviando..."}
            </>
          ) : (
            t('suggestions.submit') || "Enviar Sugestão"
          )}
        </Button>
      </form>
    </div>
  );
};
