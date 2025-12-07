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
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();
  const { subscriptionStatus, userProfile } = useAuth();
  const { profile } = useProfile();
  const [journalEntry, setJournalEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [history, setHistory] = useState<JournalEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Check if user has Premium or Premium Plus
  const hasPremiumAccess = 
    subscriptionStatus?.product_id === "prod_TVfx4bH4H0okVe" || 
    subscriptionStatus?.product_id === "prod_TVfxAziuEOC4QN" ||
    userProfile?.subscription_plan === "premium_plus" ||
    profile?.subscription_plan === "premium_plus" ||
    userProfile?.subscription_plan === "premium" ||
    profile?.subscription_plan === "premium";

  useEffect(() => {
    if (hasPremiumAccess) {
      loadHistory();
    }
  }, [hasPremiumAccess]);

  const loadHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
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
        title: t('womenJournal.writeFirst'),
        description: t('womenJournal.writeFirstDesc'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-journal', {
        body: { 
          entry: journalEntry,
          language: i18n.language
        },
      });

      if (error) throw error;

      setAiInsights(data);
      setJournalEntry("");
      await loadHistory();
      toast({
        title: `✨ ${t('womenJournal.analysisComplete')}`,
        description: t('womenJournal.analysisCompleteDesc'),
      });
    } catch (error: any) {
      console.error('Error analyzing journal:', error);
      toast({
        title: t('womenJournal.errorSaving'),
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
        title: t('womenJournal.entryDeleted'),
        description: t('womenJournal.entryDeletedDesc'),
      });
    } catch (error: any) {
      console.error('Error deleting entry:', error);
      toast({
        title: t('womenJournal.errorDeleting'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!hasPremiumAccess) {
    return (
      <Card className="border-2 border-luna-purple/20">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-luna-purple to-luna-pink text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <CardTitle>🌟 {t('womenJournal.title')}</CardTitle>
          </div>
          <CardDescription>
            {t('womenJournal.premiumRequired')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {t('womenJournal.premiumMessage')}
          </p>
          <Button variant="outline" disabled className="w-full">
            {t('subscription.manageSubscription')}
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
              <CardTitle>{t('womenJournal.title')}</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="w-4 h-4 mr-2" />
              {t('womenJournal.history')}
            </Button>
          </div>
          <CardDescription>
            {t('womenJournal.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={t('womenJournal.writePlaceholder')}
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            className="min-h-[200px] resize-none"
          />
          <Button 
            onClick={handleAnalyze}
            disabled={loading || !journalEntry.trim()}
            className="w-full bg-gradient-to-r from-luna-purple via-luna-pink to-luna-orange hover:opacity-90 text-white"
          >
            {loading ? t('womenJournal.analyzing') : t('womenJournal.analyzeWithAI')}
            <Sparkles className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {showHistory && history.length > 0 && (
        <Card className="border-2 border-luna-purple/50">
          <CardHeader>
            <CardTitle className="text-lg">{t('womenJournal.historyTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {history.map((entry, index) => (
                <div key={entry.id}>
                  <div className="space-y-3 py-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-2">
                          {new Date(entry.created_at).toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'es' ? 'es-ES' : 'en-US', {
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
                              <span className="font-semibold text-luna-purple">{t('womenJournal.summary')}:</span>
                              <p className="mt-1">{entry.ai_summary}</p>
                            </div>
                            
                            {entry.ai_patterns && (
                              <div>
                                <span className="font-semibold text-luna-pink">{t('womenJournal.patterns')}:</span>
                                <p className="mt-1">{entry.ai_patterns}</p>
                              </div>
                            )}
                            
                            {entry.ai_suggestions && entry.ai_suggestions.length > 0 && (
                              <div>
                                <span className="font-semibold text-luna-orange">{t('womenJournal.suggestions')}:</span>
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
                                <span className="font-semibold text-luna-green">{t('womenJournal.correlations')}:</span>
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
              <CardTitle>{t('womenJournal.aiInsights')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiInsights.summary && (
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-luna-purple" />
                  {t('womenJournal.daySummary')}
                </h4>
                <p className="text-sm text-muted-foreground">{aiInsights.summary}</p>
              </div>
            )}
            
            {aiInsights.patterns && (
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-luna-pink" />
                  {t('womenJournal.recurringPatterns')}
                </h4>
                <p className="text-sm text-muted-foreground">{aiInsights.patterns}</p>
              </div>
            )}

            {aiInsights.suggestions && (
              <div>
                <h4 className="font-semibold mb-2">💡 {t('womenJournal.practicalSuggestions')}</h4>
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
                <h4 className="font-semibold mb-2">🔗 {t('womenJournal.correlations')}</h4>
                <p className="text-sm text-muted-foreground">{aiInsights.correlations}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}