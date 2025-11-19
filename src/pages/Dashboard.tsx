import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Calendar, Moon, Smile, Zap, Sparkles, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'cycle' | 'sleep' | 'mood' | 'energy'>('overview');
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Nav */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold">Luna</span>
            </NavLink>
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/dashboard" className="text-sm font-medium text-primary transition-smooth" activeClassName="text-primary">
                Dashboard
              </NavLink>
              <NavLink to="/features" className="text-sm font-medium hover:text-primary transition-smooth">
                Funcionalidades
              </NavLink>
              <NavLink to="/pricing" className="text-sm font-medium hover:text-primary transition-smooth">
                Preços
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className="text-sm font-medium hover:text-primary transition-smooth">
                  Admin
                </NavLink>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Olá, bem-vinda! 👋
          </h1>
          <p className="text-muted-foreground">
            Acompanhe sua jornada de bem-estar e receba insights personalizados
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-card animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ciclo</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Dia 14</div>
              <p className="text-xs text-muted-foreground">Fase folicular</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sono</CardTitle>
              <Moon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.2h</div>
              <p className="text-xs text-muted-foreground">Média da semana</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Humor</CardTitle>
              <Smile className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2/5</div>
              <p className="text-xs text-muted-foreground">Hoje você está bem</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Energia</CardTitle>
              <Zap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.8/5</div>
              <p className="text-xs text-muted-foreground">Nível moderado</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Tracking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={activeTab === 'overview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('overview')}
              >
                Visão Geral
              </Button>
              <Button
                variant={activeTab === 'cycle' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('cycle')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Ciclo
              </Button>
              <Button
                variant={activeTab === 'sleep' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('sleep')}
              >
                <Moon className="w-4 h-4 mr-2" />
                Sono
              </Button>
              <Button
                variant={activeTab === 'mood' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('mood')}
              >
                <Smile className="w-4 h-4 mr-2" />
                Humor
              </Button>
              <Button
                variant={activeTab === 'energy' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('energy')}
              >
                <Zap className="w-4 h-4 mr-2" />
                Energia
              </Button>
            </div>

            {/* Content Area */}
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle>
                  {activeTab === 'overview' && 'Visão Geral'}
                  {activeTab === 'cycle' && 'Rastreamento de Ciclo'}
                  {activeTab === 'sleep' && 'Rastreamento de Sono'}
                  {activeTab === 'mood' && 'Rastreamento de Humor'}
                  {activeTab === 'energy' && 'Rastreamento de Energia'}
                </CardTitle>
                <CardDescription>
                  {activeTab === 'overview' && 'Resumo dos seus dados de bem-estar'}
                  {activeTab === 'cycle' && 'Acompanhe seu ciclo menstrual e sintomas'}
                  {activeTab === 'sleep' && 'Monitore a qualidade e duração do seu sono'}
                  {activeTab === 'mood' && 'Registre como você está se sentindo'}
                  {activeTab === 'energy' && 'Acompanhe seus níveis de energia ao longo do dia'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Comece a registrar seus dados para ver análises e insights personalizados
                  </p>
                  <Button variant="hero">
                    Adicionar Registro
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Insights */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-2 border-primary">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Assistente IA</CardTitle>
                    <CardDescription className="text-xs">Sempre disponível para você</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm mb-3">
                    <strong className="text-primary">💡 Insight do dia:</strong>
                    <br />
                    Você está na fase folicular do seu ciclo - é um ótimo momento para atividades sociais e projetos criativos!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Baseado nos seus últimos 7 dias de dados
                  </p>
                </div>
                <Button variant="hero" className="w-full">
                  Gerar Plano Personalizado
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg">Planos Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum plano ativo no momento
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}