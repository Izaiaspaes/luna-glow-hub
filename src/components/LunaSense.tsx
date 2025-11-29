import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function LunaSense() {
  const { subscriptionStatus } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! 💜 Eu sou a Luna Sense, sua assistente inteligente de bem-estar feminino. Como posso te ajudar hoje?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasPremiumPlus = subscriptionStatus?.product_id === "prod_TVfx4bH4H0okVe" || 
                         subscriptionStatus?.product_id === "prod_TVfxAziuEOC4QN";

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
          conversationHistory: messages.slice(-5) // Send last 5 messages for context
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
        title: "Erro na conversa",
        description: error.message,
        variant: "destructive",
      });
      
      // Add error message to chat
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Desculpe, tive um problema para processar sua mensagem. Pode tentar novamente?",
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
            <CardTitle>💬 Luna Sense - Assistente Inteligente</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Conversa livre e empática sobre saúde feminina, rotina e emoções. Com personalidade que se adapta à sua fase do ciclo.
          </p>
          <Button variant="outline" disabled className="w-full">
            Disponível no Premium Plus
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
            <CardTitle>Luna Sense</CardTitle>
            <p className="text-sm text-muted-foreground">Assistente Inteligente 24/7</p>
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
                  {message.timestamp.toLocaleTimeString("pt-BR", {
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
                  <span className="text-sm">Luna está pensando...</span>
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
            placeholder="Digite sua mensagem..."
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
          💜 Luna adapta sua personalidade à fase do seu ciclo
        </p>
      </CardContent>
    </Card>
  );
}
