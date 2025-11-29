import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, BookOpen, TrendingUp, History, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface JournalEntry {
  id: string;
  entry_text: string;
  ai_summary: string | null;
  ai_patterns: string | null;
  ai_suggestions: string[] | null;
  ai_correlations: string | null;
  created_at: string;
}

export function WomenJournal() {
  const { subscriptionStatus, userProfile } = useAuth();
  const { profile } = useProfile();
  const [journalEntry, setJournalEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [history, setHistory] = useState<JournalEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Check if user has Premium Plus (product_id should match one of the Premium Plus products)
  const hasPremiumPlus = 
    subscriptionStatus?.product_id === "prod_TVfx4bH4H0okVe" || 
    subscriptionStatus?.product_id === "prod_TVfxAziuEOC4QN" ||
    userProfile?.subscription_plan === "premium_plus" ||
    profile?.subscription_plan === "premium_plus";

  useEffect(() => {
    if (hasPremiumPlus) {
      loadHistory();
    }
  }, [hasPremiumPlus]);

  const loadHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Transform data to match interface
      const transformedData: JournalEntry[] = (data || []).map(entry => ({
        ...entry,
        ai_suggestions: (Array.isArray(entry.ai_suggestions) ? entry.ai_suggestions : []) as string[]
      }));
      
      setHistory(transformedData);
    } catch (error: any) {
      console.error('Error loading history:', error);
    }
  };

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
      setJournalEntry("");
      await loadHistory(); // Reload history after saving
      toast({
        title: "✨ Análise completa!",
        description: "A IA analisou seu diário e salvou a entrada",
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

  const handleDeleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadHistory();
      toast({
        title: "Entrada excluída",
        description: "A entrada do diário foi removida",
      });
    } catch (error: any) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
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
            Gerenciar Assinatura
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-luna-purple">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-luna-purple to-luna-pink text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <CardTitle>Diário da Mulher</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="w-4 h-4 mr-2" />
              Histórico
            </Button>
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

      {showHistory && history.length > 0 && (
        <Card className="border-2 border-luna-purple/50">
          <CardHeader>
            <CardTitle className="text-lg">Histórico de Entradas</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {history.map((entry, index) => (
                <div key={entry.id}>
                  <div className="space-y-3 py-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-2">
                          {new Date(entry.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-sm mb-3 italic text-muted-foreground">
                          "{entry.entry_text.substring(0, 150)}{entry.entry_text.length > 150 ? '...' : ''}"
                        </p>
                        
                        {entry.ai_summary && (
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-semibold text-luna-purple">Resumo:</span>
                              <p className="mt-1">{entry.ai_summary}</p>
                            </div>
                            
                            {entry.ai_patterns && (
                              <div>
                                <span className="font-semibold text-luna-pink">Padrões:</span>
                                <p className="mt-1">{entry.ai_patterns}</p>
                              </div>
                            )}
                            
                            {entry.ai_suggestions && entry.ai_suggestions.length > 0 && (
                              <div>
                                <span className="font-semibold text-luna-orange">Sugestões:</span>
                                <ul className="mt-1 space-y-1">
                                  {entry.ai_suggestions.map((suggestion, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="text-luna-purple">•</span>
                                      {suggestion}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {entry.ai_correlations && (
                              <div>
                                <span className="font-semibold text-luna-green">Correlações:</span>
                                <p className="mt-1">{entry.ai_correlations}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {index < history.length - 1 && <Separator />}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

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
