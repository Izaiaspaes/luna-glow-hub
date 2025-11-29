import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, BookOpen, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function WomenJournal() {
  const { subscriptionStatus } = useAuth();
  const [journalEntry, setJournalEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);

  // Check if user has Premium Plus (product_id should match one of the Premium Plus products)
  const hasPremiumPlus = subscriptionStatus?.product_id === "prod_TVfx4bH4H0okVe" || 
                         subscriptionStatus?.product_id === "prod_TVfxAziuEOC4QN";

  const handleAnalyze = async () => {
    if (!journalEntry.trim()) {
      toast({
        title: "Escreva algo primeiro",
        description: "Digite seu diário para que a IA possa analisar",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-journal', {
        body: { entry: journalEntry },
      });

      if (error) throw error;

      setAiInsights(data);
      toast({
        title: "✨ Análise completa!",
        description: "A IA analisou seu diário",
      });
    } catch (error: any) {
      console.error('Error analyzing journal:', error);
      toast({
        title: "Erro ao analisar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!hasPremiumPlus) {
    return (
      <Card className="border-2 border-luna-purple/20">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-luna-purple to-luna-pink text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <CardTitle>🌟 Diário da Mulher com IA</CardTitle>
          </div>
          <CardDescription>
            Disponível apenas no Premium Plus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Escreva livremente e receba insights poderosos da IA sobre seu dia, padrões recorrentes e correlações entre humor, sintomas e ciclo.
          </p>
          <Button variant="outline" disabled className="w-full">
            Fazer upgrade para Premium Plus
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-luna-purple">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-luna-purple to-luna-pink text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <CardTitle>Diário da Mulher</CardTitle>
          </div>
          <CardDescription>
            Escreva livremente sobre seu dia. A IA vai analisar e devolver insights personalizados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Como foi seu dia? O que você está sentindo? Compartilhe livremente..."
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            className="min-h-[200px] resize-none"
          />
          <Button 
            onClick={handleAnalyze}
            disabled={loading || !journalEntry.trim()}
            className="w-full bg-gradient-to-r from-luna-purple via-luna-pink to-luna-orange hover:opacity-90 text-white"
          >
            {loading ? "Analisando..." : "Analisar com IA"}
            <Sparkles className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {aiInsights && (
        <Card className="border-2 border-luna-purple/50 bg-gradient-to-br from-luna-purple/5 to-luna-pink/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-luna-purple" />
              <CardTitle>Insights da IA</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiInsights.summary && (
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-luna-purple" />
                  Resumo do Dia
                </h4>
                <p className="text-sm text-muted-foreground">{aiInsights.summary}</p>
              </div>
            )}
            
            {aiInsights.patterns && (
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-luna-pink" />
                  Padrões Recorrentes
                </h4>
                <p className="text-sm text-muted-foreground">{aiInsights.patterns}</p>
              </div>
            )}

            {aiInsights.suggestions && (
              <div>
                <h4 className="font-semibold mb-2">💡 Sugestões Práticas</h4>
                <ul className="space-y-2">
                  {aiInsights.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-luna-purple">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiInsights.correlations && (
              <div>
                <h4 className="font-semibold mb-2">🔗 Correlações</h4>
                <p className="text-sm text-muted-foreground">{aiInsights.correlations}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
