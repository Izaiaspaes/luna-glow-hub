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

const authSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
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

    // Validate invite code for signup
    if (!isLogin) {
      if (!inviteCode.trim()) {
        toast.error("Código de convite é obrigatório para criar uma conta");
        setLoading(false);
        return;
      }

      const { data: invite, error: inviteError } = await supabase
        .from("invites")
        .select("*")
        .eq("code", inviteCode)
        .eq("is_active", true)
        .single();

      if (inviteError || !invite) {
        toast.error("Código de convite inválido");
        setLoading(false);
        return;
      }

      if (new Date(invite.expires_at) < new Date()) {
        toast.error("Este código de convite já expirou");
        setLoading(false);
        return;
      }

      if (invite.current_uses >= invite.max_uses) {
        toast.error("Este código de convite já atingiu o limite de usos");
        setLoading(false);
        return;
      }

      if (invite.email && invite.email !== email) {
        toast.error("Este convite é válido apenas para outro email");
        setLoading(false);
        return;
      }
    }

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou senha incorretos");
        } else {
          toast.error("Erro ao fazer login: " + error.message);
        }
      } else {
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Este email já está cadastrado");
        } else {
          toast.error("Erro ao criar conta: " + error.message);
        }
      } else {
        // Update invite usage - increment current_uses
        const { data: currentInvite } = await supabase
          .from("invites")
          .select("current_uses")
          .eq("code", inviteCode)
          .single();
        
        if (currentInvite) {
          await supabase
            .from("invites")
            .update({
              current_uses: currentInvite.current_uses + 1,
              used_at: new Date().toISOString(),
            })
            .eq("code", inviteCode);
        }
        
        toast.success("Conta criada com sucesso!");
        navigate("/dashboard");
      }
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
            {isLogin ? "Bem-vinda de volta" : "Crie sua conta"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Entre com seu email e senha"
              : "Preencha os dados para começar"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="invite">Código de Convite</Label>
                <Input
                  id="invite"
                  type="text"
                  placeholder="Digite seu código de convite"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Você precisa de um código de convite para criar uma conta
                </p>
              </div>
            )}
            
            <Button type="submit" className="w-full" variant="colorful" disabled={loading}>
              {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar conta"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin
                ? "Não tem uma conta? Cadastre-se"
                : "Já tem uma conta? Entre"}
            </button>
          </div>
        </CardContent>
      </Card>
      
      <WhatsAppButton />
    </div>
  );
}
