import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function LunaSense() {
  const { t, i18n } = useTranslation();
  const { subscriptionStatus, userProfile } = useAuth();
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: t('lunaSense.welcomeMessage'),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasPremiumPlus = 
    subscriptionStatus?.product_id === "prod_TVfx4bH4H0okVe" || 
    subscriptionStatus?.product_id === "prod_TVfxAziuEOC4QN" ||
    userProfile?.subscription_plan === "premium_plus" ||
    profile?.subscription_plan === "premium_plus";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('luna-sense-chat', {
        body: { 
          message: input,
          conversationHistory: messages.slice(-5),
          language: i18n.language
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error chatting with Luna Sense:', error);
      toast({
        title: t('lunaSense.errorSending'),
        description: error.message,
        variant: "destructive",
      });
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: t('lunaSense.errorMessage'),
        timestamp: new Date(),
      }]);
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
              <MessageCircle className="w-5 h-5" />
            </div>
            <CardTitle>💬 {t('lunaSense.title')} - {t('featuredHighlights.lunaSense.title').split(' - ')[1]}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {t('lunaSense.premiumMessage')}
          </p>
          <Button variant="outline" disabled className="w-full">
            {t('lunaSense.premiumRequired')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-luna-purple flex flex-col h-[600px]">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-luna-purple to-luna-pink text-white">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>{t('lunaSense.title')}</CardTitle>
            <p className="text-sm text-muted-foreground">{t('lunaSense.subtitle')}</p>
          </div>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-luna-purple to-luna-pink text-white"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString(i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'es' ? 'es-ES' : 'en-US', {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-pulse text-luna-purple" />
                  <span className="text-sm">{t('lunaSense.thinking')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <CardContent className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('lunaSense.chatPlaceholder')}
            disabled={loading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-luna-purple to-luna-pink text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          💜 {t('lunaSense.adaptiveNote')}
        </p>
      </CardContent>
    </Card>
  );
}